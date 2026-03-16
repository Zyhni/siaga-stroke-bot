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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchAnyKeyword(text, keywords = []) {
  const t = norm(text);

  const sortedKeywords = [...keywords].sort((a, b) => {
    return norm(b).length - norm(a).length;
  });

  return sortedKeywords.some((k) => {
    const kk = norm(k);

    if (t === kk) return true;

    const pattern = new RegExp(`(^|\\s)${escapeRegex(kk)}(\\s|$)`, "i");
    return pattern.test(t);
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

  // 2) backup / mitos / pertanyaan cadangan
  // diprioritaskan dulu karena frasanya lebih spesifik
  for (const qa of BACKUP_QA) {
    if (matchAnyKeyword(t, qa.keywords)) {
      const fallbackText =
        (qa.answer || "Informasi tidak ditemukan.") +
        "\n\nKetik *menu* untuk kembali.";

      const media = IMAGE_MEDIA?.[qa.key];

      if (media) {
        return buildMediaReply(media, "");
      }

      return buildTextReply(fallbackText);
    }
  }

  // 3) menu utama
  const sortedMainMenu = [...MAIN_MENU].sort((a, b) => {
    const longestA = Math.max(...a.keywords.map((k) => norm(k).length));
    const longestB = Math.max(...b.keywords.map((k) => norm(k).length));
    return longestB - longestA;
  });

  for (const item of sortedMainMenu) {
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

      if (item.handler === "stroke_risks" && media) {
        return buildMediaReply(
          media,
          "Mau tahu lebih lanjut salah satu faktor risikonya?\n\nKetik salah satu kata diatas, seperti: Alkohol, detak jantung, hipertensi, diabetes, kolesterol, aktivitas, obesitas, jantung, merokok/rokok, pembuluh darah"
        );
      }

      if (media) {
        return buildMediaReply(media, "");
      }

      return buildTextReply(fallbackText);
    }
  }

  // 4) detail gejala
  for (const key of Object.keys(SYMPTOM_DETAILS)) {
    const nk = norm(key);
    if (t === nk || t.includes(nk)) {
      return buildTextReply(
        `*${titleCase(key)}*\n\n${SYMPTOM_DETAILS[key]}\n\nKetik *menu* untuk kembali.`
      );
    }
  }

  // 5) detail faktor risiko
  for (const key of Object.keys(RISK_DETAILS)) {
    const nk = norm(key);
    if (t === nk || t.includes(nk)) {
      return buildTextReply(
        `*${titleCase(key)}*\n\n${RISK_DETAILS[key]}\n\nKetik *menu* untuk kembali.`
      );
    }
  }

  // 6) fallback
  return buildTextReply(
    "Maaf, saya belum paham. Ketik *menu* untuk melihat pilihan materi utama."
  );
}