// src/botLogic.js
import {
  MAIN_MENU,
  MAIN_ANSWERS,
  SYMPTOM_DETAILS,
  RISK_DETAILS,
  BACKUP_QA,
  IMAGE_MEDIA
} from "./content.js";

function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(s) {
  return (s || "").replace(/\w\S*/g, (w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
}

function isGreeting(t) {
  const greetings = [
    "halo",
    "hai",
    "hi",
    "assalamualaikum",
    "selamat pagi",
    "selamat siang",
    "selamat sore",
    "selamat malam",
    "p"
  ];

  return greetings.some((k) => t === k || t.startsWith(k + " "));
}

function matchAnyKeyword(text, keywords = []) {
  const t = norm(text);

  return keywords.some((k) => {
    const kk = norm(k);
    return t === kk || t.includes(kk);
  });
}

export function buildMainMenuText() {
  const lines = [
    "Halo! Saya *SiagaStroke*.",
    "Mau belajar apa? Ketik angka / kata kunci di bawah ini:",
    "",
    ...MAIN_MENU.map((m) => `${m.key}) ${m.title}`),
    "",
    "Contoh: ketik *2* atau *Gejala*"
  ];

  return lines.join("\n");
}

function buildTextReply(text) {
  return { text };
}

function buildMediaReply(media, caption = "") {
  return { media, caption };
}

export function getReplyForMessage(messageText) {
  const t = norm(messageText);

  // 1) greet / menu
  if (!t || isGreeting(t) || t === "menu" || t === "help") {
    return buildTextReply(buildMainMenuText());
  }

  // 2) detail gejala -> tetap teks
  for (const key of Object.keys(SYMPTOM_DETAILS)) {
    const nk = norm(key);
    if (t === nk || t.includes(nk)) {
      return buildTextReply(
        `*${titleCase(key)}*\n\n${SYMPTOM_DETAILS[key]}\n\nKetik *menu* untuk kembali.`
      );
    }
  }

  // 3) detail faktor risiko -> tetap teks
  for (const key of Object.keys(RISK_DETAILS)) {
    const nk = norm(key);
    if (t === nk || t.includes(nk)) {
      return buildTextReply(
        `*${titleCase(key)}*\n\n${RISK_DETAILS[key]}\n\nKetik *menu* untuk kembali.`
      );
    }
  }

  // 4) menu utama (1-5)
  for (const item of MAIN_MENU) {
    if (matchAnyKeyword(t, item.keywords)) {
      const fallbackText =
        (MAIN_ANSWERS[item.handler] || "Informasi tidak ditemukan.") +
        "\n\nKetik *menu* untuk kembali.";

      const media = IMAGE_MEDIA?.[item.handler];

      if (item.handler === "stroke_symptoms" && media) {
        return buildMediaReply(
          media,
          "Mau tahu lebih lanjut salah satu gejalanya?\n\nKetik salah satu kata diatas: Bingung, Penglihatan ganda, Lemah, Mati rasa dan lainnya"
        );
      }

      if (media) {
        return buildMediaReply(media, "");
      }

      return buildTextReply(fallbackText);
    }
  }

  // 5) backup / mitos / pertanyaan cadangan
  for (const qa of BACKUP_QA) {
    if (matchAnyKeyword(t, qa.keywords)) {
      const fallbackText =
        (qa.answer || "Informasi tidak ditemukan.") +
        "\n\nKetik *menu* untuk kembali.";

      const media = IMAGE_MEDIA?.[qa.key];

      // kalau ada gambar, kirim gambar
      if (media) {
        return buildMediaReply(media, "");
      }

      // kalau tidak ada gambar, tetap teks
      return buildTextReply(fallbackText);
    }
  }

  // 6) fallback
  return buildTextReply(
    "Maaf, saya belum paham. Ketik *menu* untuk melihat pilihan materi utama."
  );
}