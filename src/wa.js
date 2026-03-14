// src/wa.js
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

function getPuppeteerConfig() {
  const isLinux = process.platform === "linux";
  const isWindows = process.platform === "win32";

  const config = {
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-features=Translate,BackForwardCache,AcceptCHFrame",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-first-run",
      "--no-default-browser-check"
    ]
  };

  // VPS Linux
  if (isLinux) {
    config.executablePath =
      process.env.CHROME_PATH || "/usr/bin/google-chrome-stable";
  }

  // Windows lokal:
  // tidak perlu executablePath, biarkan Puppeteer cari sendiri
  // kalau mau paksa path Windows, bisa pakai ini:
  if (isWindows && process.env.CHROME_PATH) {
    config.executablePath = process.env.CHROME_PATH;
  }

  return config;
}

export function createWaManager({ onQR, onStatus, onMessage }) {
  let client = null;

  function buildClient() {
    const c = new Client({
      authStrategy: new LocalAuth({ clientId: "siagastroke" }),
      puppeteer: getPuppeteerConfig()
    });

    c.on("qr", (qr) => {
      onStatus?.({ state: "qr", message: "QR tersedia. Silakan scan." });
      onQR?.(qr);
    });

    c.on("loading_screen", (percent, message) => {
      onStatus?.({ state: "loading", message: `${percent}% - ${message}` });
    });

    c.on("change_state", (state) => {
      onStatus?.({ state: "change_state", message: String(state) });
    });

    c.on("authenticated", () =>
      onStatus?.({ state: "authenticated", message: "Authenticated" })
    );

    c.on("ready", () =>
      onStatus?.({ state: "ready", message: "WhatsApp client siap" })
    );

    c.on("auth_failure", (msg) =>
      onStatus?.({ state: "auth_failure", message: String(msg || "Auth failure") })
    );

    c.on("disconnected", (reason) =>
      onStatus?.({ state: "disconnected", message: String(reason || "Disconnected") })
    );

    c.on("message", async (msg) => {
      try {
        await onMessage?.(msg);
      } catch (e) {
        console.error("[WA] onMessage error:", e);
      }
    });

    return c;
  }

  async function start() {
    if (client) return;
    onStatus?.({ state: "starting", message: "Starting WhatsApp client..." });
    client = buildClient();
    await client.initialize();
  }

  async function stop() {
    if (!client) return;
    onStatus?.({ state: "stopping", message: "Stopping WhatsApp client..." });
    try {
      await client.destroy();
    } catch (e) {
      console.error("[WA] destroy error:", e);
    }
    client = null;
  }

  async function restart() {
    onStatus?.({ state: "restarting", message: "Restarting WhatsApp client..." });
    await stop();
    await start();
  }

  async function logout() {
    if (!client) {
      await start();
    }
    try {
      onStatus?.({ state: "logging_out", message: "Logging out WhatsApp..." });
      await client.logout();
    } catch (e) {
      console.error("[WA] logout error:", e);
    }
    await restart();
  }

  return { start, stop, restart, logout, getClient: () => client };
}