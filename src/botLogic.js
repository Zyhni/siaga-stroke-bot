// src/botLogic.js
import { MAIN_MENU, MAIN_ANSWERS, SYMPTOM_DETAILS, RISK_DETAILS, BACKUP_QA, MEDIA } from "./content.js";

function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isGreeting(t) {
  return ["halo", "hai", "hi", "assalamualaikum", "selamat pagi", "selamat siang", "selamat sore", "selamat malam", "p"].some(k => t === k || t.startsWith(k + " "));
}

export function buildMainMenuText() {
  const lines = [
    "Halo! Saya *SiagaStroke*.",
    "Mau belajar apa? Ketik angka / kata kunci di bawah ini:",
    "",
    ...MAIN_MENU.map(m => `${m.key}) ${m.title}`),
    "",
    "Contoh: ketik *2* atau *Gejala*"
  ];
  return lines.join("\n");
}

function matchAnyKeyword(text, keywords) {
  const t = norm(text);
  return keywords.some(k => {
    const kk = norm(k);
    return t === kk || t.includes(kk);
  });
}

export function getReplyForMessage(messageText) {
  const t = norm(messageText);

  // greet/menu
  if (!t || isGreeting(t) || t === "menu" || t === "help") {
    return { type: "menu", text: buildMainMenuText() };
  }

  // sub-keyword gejala (langsung bisa tanpa harus pilih 2 dulu)
  for (const key of Object.keys(SYMPTOM_DETAILS)) {
    if (t === key || t.includes(key)) {
      return { type: "symptom_detail", text: `*${titleCase(key)}*\n\n${SYMPTOM_DETAILS[key]}\n\nKetik *menu* untuk kembali.` };
    }
  }

  // sub-keyword faktor risiko
  for (const key of Object.keys(RISK_DETAILS)) {
    if (t === key || t.includes(key)) {
      return { type: "risk_detail", text: `*${titleCase(key)}*\n\n${RISK_DETAILS[key]}\n\nKetik *menu* untuk kembali.` };
    }
  }

  // main menu handlers (1-5)
  for (const item of MAIN_MENU) {
    if (matchAnyKeyword(t, item.keywords)) {
      const text = MAIN_ANSWERS[item.handler] + "\n\nKetik *menu* untuk kembali.";

      if (item.handler === "stroke_symptoms" && MEDIA.stroke) {
        return {
          type: "main_with_media",
          media: MEDIA.stroke,
          caption: text
        };
      }

      return { type: "main", text };
    }
  }

  // materi cadangan = pelindung (tidak tampil di menu)
  for (const qa of BACKUP_QA) {
    if (matchAnyKeyword(t, qa.keywords)) {
      return { type: "backup", text: qa.answer + "\n\nKetik *menu* untuk kembali." };
    }
  }

  // fallback aman
  return {
    type: "fallback",
    text: "Maaf, saya belum paham. Ketik *menu* untuk melihat pilihan materi utama (1–5)."
  };
}

function titleCase(s) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}