// src/app.js
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import QRCode from "qrcode";

import { createWaManager } from "./wa.js";
import { getReplyForMessage } from "./botLogic.js";
import { requireAuth, loginHandler, logoutHandler } from "./auth.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// middleware
app.use(
  helmet({
    // biar Tailwind CDN + inline script dashboard jalan
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        "script-src-elem": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        "connect-src": ["'self'", "ws:", "wss:"],
        "img-src": ["'self'", "data:", "blob:"],
        "style-src": ["'self'", "'unsafe-inline'"]
      }
    }
  })
);

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

app.use(
  session({
    name: "siagastroke.sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" }
  })
);

const PORT = Number(process.env.PORT || 3000);

let lastQRDataUrl = null;
let waStatus = { state: "booting", message: "Booting..." };

function emitStatus() {
  io.emit("wa_status", { ...waStatus, qrDataUrl: lastQRDataUrl });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function calcTypingDelayMs(text) {
  const len = (text || "").length;
  const base = 600;
  const perChar = 35;
  const max = 6000;
  return Math.min(base + len * perChar, max);
}

// WA Manager
const wa = createWaManager({
  onQR: async (qr) => {
    lastQRDataUrl = await QRCode.toDataURL(qr);
    emitStatus();
  },
  onStatus: (st) => {
    waStatus = st;
    emitStatus();
  },
  onMessage: async (msg) => {
    const incoming = msg.body || "";
    const reply = getReplyForMessage(incoming);

    try {
      const chat = await msg.getChat();
      await chat.sendSeen();
      await chat.sendStateTyping();
      await sleep(calcTypingDelayMs(reply.text));
      await chat.clearState();
      if (reply.media) {
        await chat.sendMessage(reply.media, { caption: reply.caption || "" });
      } else {
        await msg.reply(reply.text);
      }
    } catch (e) {
      console.error("[BOT] reply pipeline error:", e);
      try { await msg.reply(reply.text); } catch {}
    }
  }
});

// socket
io.on("connection", (socket) => {
  socket.emit("wa_status", { ...waStatus, qrDataUrl: lastQRDataUrl });
});

// routes
app.get("/", (req, res) => res.redirect("/dashboard"));

app.get("/login", (req, res) => res.sendFile(process.cwd() + "/src/views/login.html"));
app.post("/login", loginHandler);
app.post("/logout", logoutHandler);

app.get("/dashboard", requireAuth, (req, res) => res.sendFile(process.cwd() + "/src/views/dashboard.html"));

app.get("/api/status", requireAuth, (req, res) => {
  res.json({ ...waStatus, qrDataUrl: lastQRDataUrl });
});

// restart WA tanpa logout (buat kasus authenticated tapi gak ready)
app.post("/api/wa/restart", requireAuth, async (req, res) => {
  try {
    await wa.restart();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// logout WA dan paksa QR muncul lagi
app.post("/api/wa/logout", requireAuth, async (req, res) => {
  try {
    lastQRDataUrl = null;
    await wa.logout();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

server.listen(PORT, async () => {
  console.log(`Dashboard: http://localhost:${PORT}/login`);
  try {
    await wa.start();
  } catch (e) {
    waStatus = { state: "error", message: String(e?.message || e) };
    emitStatus();
    console.error("[WA] init failed:", e);
  }
});