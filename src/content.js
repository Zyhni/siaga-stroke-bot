// src/content.js
import path from "path";
import { fileURLToPath } from "url";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadMedia = (relativePath) => {
  try {
    const fullPath = path.join(__dirname, relativePath);
    return MessageMedia.fromFilePath(fullPath);
  } catch (e) {
    console.warn("media not found:", relativePath, e?.message || e);
    return null;
  }
};

// =========================
// GAMBAR
// =========================
export const IMAGE_MEDIA = {
  stroke_def: loadMedia("image/Apa itu stroke_.jpg"),
  stroke_symptoms: loadMedia("image/Apa saja gejala stroke_.jpg"),
  stroke_risks: loadMedia("image/Apa saja faktor risiko stroke_.jpg"),
  stroke_first_aid: loadMedia("image/Apa yang harus dilakukan jika merasakan gejala-gejala stroke_.jpg"),
  stroke_prevention: loadMedia("image/Bagaimana cara mencegah stroke terutama pada penderita hipertensi_.jpg"),

  myth_stroke_age: loadMedia("image/Apakah benar stroke hanya menyerang orang tua_.jpg"),
  myth_need_long_recovery: loadMedia("image/Apakah benar pemulihan stroke membutuhkan waktu yang lama_.jpg"),
  myth_needles: loadMedia("image/Apakah boleh menusuk jarum pada telinga, jari tangan atau jari kaki saat terjadi stroke_.jpg"),
  myth_recurrent: loadMedia("image/Apakah stroke bisa kambuh atau berulang_.jpg"),
  myth_heart_only: loadMedia("image/Apakah stroke hanya terjadi pada penderita_ pasien jantung_.jpg"),
  myth_full_recovery: loadMedia("image/Bisakah penderita stroke sembuh total_.jpg"),
  myth_light_vs_heavy: loadMedia("image/Apa perbedaan stroke ringan dan stroke berat_.jpg"),
  myth_sexual_activity: loadMedia("image/Apakah aktivitas seksual boleh dilakukan oleh penderita stroke_.jpg")
};

// =========================
// MENU
// =========================
export const MAIN_MENU = [
  { key: "1", title: "Apa itu stroke?", keywords: ["1", "stroke"], handler: "stroke_def" },
  { key: "2", title: "Apa saja gejala stroke?", keywords: ["2", "gejala"], handler: "stroke_symptoms" },
  { key: "3", title: "Apa saja faktor risiko stroke?", keywords: ["3", "faktor risiko", "faktor", "risiko"], handler: "stroke_risks" },
  { key: "4", title: "Apa yang harus dilakukan jika merasakan gejala-gejala stroke?", keywords: ["4", "merasakan gejala stroke"], handler: "stroke_first_aid" },
  { key: "5", title: "Bagaimana cara mencegah stroke terutama pada penderita hipertensi?", keywords: ["5", "cara mencegah", "pencegahan", "cegah", "mencegah"], handler: "stroke_prevention" }
];

// =========================
// JAWABAN TEKS CADANGAN
// kalau gambar gagal dibaca, masih ada fallback text
// =========================
export const MAIN_ANSWERS = {
  stroke_def:
`Stroke adalah kondisi yang terjadi ketika pasokan darah ke otak mengalami gangguan atau berkurang akibat penyumbatan (stroke iskemik) atau pecahnya pembuluh darah (stroke hemoragik). Tanpa pasokan darah, otak tidak akan mendapatkan asupan oksigen dan nutrisi, sehingga sel-sel pada sebagian area otak akan mati. Kondisi ini menyebabkan bagian tubuh yang dikendalikan oleh area otak yang rusak tidak dapat berfungsi dengan baik.`,

  stroke_symptoms:
`Gejala stroke menurut Kemenkes adalah seperti yang tercantum pada gambar.

Lebih luas, gejala stroke yang lain meliputi:
1) Bingung
2) Penglihatan ganda
3) Lemah (salah satu sisi tubuh)
4) Mati rasa (satu sisi wajah)
5) Kehilangan keseimbangan / terasa mau terjatuh
6) Sulit berjalan
7) Sakit kepala parah tiba-tiba
8) Bicara tidak jelas / membingungkan
9) Pusing tiba-tiba
10) Masalah koordinasi (tremor/gemetar)

Mau tahu lebih lanjut salah satu gejalanya?
Ketik salah satu kata diatas: Bingung, Penglihatan ganda, Lemah, Mati rasa dan lainnya`,

  stroke_risks:
`Mengidentifikasi faktor risiko stroke perlu dilakukan sedini mungkin. Beberapa risiko stroke yaitu:
1) Alkohol
2) Detak jantung tidak teratur
3) Hipertensi (tekanan darah tinggi)
4) Diabetes
5) Kolesterol tinggi
6) Kurang aktivitas fisik
7) Kelebihan berat badan / Obesitas
8) Riwayat serangan jantung
9) Merokok
10) Penyempitan pembuluh darah

Mau tahu lebih lanjut salah satu faktor risikonya?
Ketik salah satu kata ini: Alkohol, Detak jantung, Hipertensi, Diabetes, Kolesterol, Aktivitas, Kelebihan berat badan, Obesitas, Jantung, Merokok, Rokok, Pembuluh darah`,

  stroke_first_aid:
`Apabila merasakan gejala-gejala stroke, jangan menunggu atau berharap gejala akan hilang sendiri. Hubungi RS terdekat atau layanan kesehatan yang tersedia 24 jam. Jika Anda sedang bersama seseorang yang menunjukkan gejala stroke, tetaplah bersama orang tersebut sampai ambulans datang. Catat waktu ketika gejala pertama kali muncul dan berikan informasi ini kepada tenaga medis/kesehatan.`,

  stroke_prevention:
`Pencegahan stroke terutama pada penderita hipertensi dapat dilakukan dengan mengubah gaya hidup:
• Manajemen tekanan darah, gula darah, dan kolesterol
• Batasi garam < 1.800 mg/hari (± ¾ sdt) untuk lansia hipertensi
• Pola diet sehat (buah, sayur, susu rendah/tanpa lemak)
• Aktivitas fisik sedang–berat minimal 150 menit/minggu (jalan cepat, bersepeda, resistensi, berkebun)
• Jika obesitas, targetkan penurunan berat badan
• Kurangi stres`
};

export const SYMPTOM_DETAILS = {
  "bingung": `Penderita stroke biasanya mengalami penurunan kesadaran yang disebabkan oleh kondisi hipoksia otak akibat sumbatan pembuluh darah atau pecahnya pembuluh darah. Kondisi ini memunculkan gejala bingung pada pasien stroke.`,
  "penglihatan ganda": `Penglihatan ganda adalah kondisi posisi mata tidak fokus pada objek yang sama. Stroke dapat merusak saraf halus yang mengontrol gerakan mata sehingga menyebabkan masalah pada pergerakan mata.`,
  "lemah": `Stroke membuat aliran darah terhenti dan apabila menyerang bagian otak yang mengatur pergerakan tubuh, bagian tersebut rusak sehingga sinyal ke otot berkurang/hilang.`,
  "mati rasa": `Stroke dapat merusak bagian otak yang mengatur gerakan wajah sehingga sinyal ke otot wajah terputus sehingga satu sisi wajah melemah. Gejala ini membuat seseorang cenderung sering kesulitan atau tersedak untuk minum.`,
  "keseimbangan": `Jika stroke terjadi pada otak kecil atau batang otak (area yang mengontrol keseimbangan), kehilangan keseimbangan dapat terjadi.`,
  "terjatuh": `Jika stroke terjadi pada otak kecil atau batang otak (area yang mengontrol keseimbangan), kehilangan keseimbangan dapat terjadi.`,
  "berjalan": `Karena adanya kelemahan pada satu sisi tubuh, kaki menjadi kaku dan sulit ditekuk sehingga koordinasi otot tungkai kaki menjadi kurang aktif dan menyebabkan sulit berjalan.`,
  "sakit kepala": `Sakit kepala akibat stroke biasanya datang secara tiba-tiba karena pecahnya pembuluh darah sehingga terjadi peningkatan tekanan di dalam kepala.`,
  "bicara": `Gejala ini terjadi karena area otak yang mengatur bicara tidak dialirkan darah sehingga otot lidah, bibir, dan rahang sulit dikendalikan.`,
  "pusing": `Saat stroke mengenai sistem otak yang mengatur keseimbangan, integrasi sinyal keseimbangan terganggu sehingga bisa memunculkan vertigo bahkan mual.`,
  "tremor": `Tremor pada pasien stroke terjadi karena kerusakan pada bagian otak (serebelum) yang membuat gerakan menjadi tidak terkoordinasi.`,
  "gemetar": `Tremor pada pasien stroke terjadi karena kerusakan pada bagian otak (serebelum) yang membuat gerakan menjadi tidak terkoordinasi.`,
  "masalah koordinasi": `Tremor pada pasien stroke terjadi karena kerusakan pada bagian otak (serebelum) yang membuat gerakan menjadi tidak terkoordinasi.`
};

export const RISK_DETAILS = {
  "alkohol": `Mengonsumsi alkohol secara berlebihan dapat merusak pembuluh darah serta menaikkan tekanan darah yang dapat memicu stroke.`,
  "detak jantung": `Detak jantung yang tidak teratur bisa membentuk gumpalan darah yang dapat menyumbat pembuluh darah ke otak.`,
  "hipertensi": `Tekanan darah tinggi dapat membuat pembuluh darah cepat rusak dan pecah.`,
  "diabetes": `Gula darah tinggi dapat membuat darah lebih kental sehingga pembuluh darah mengalami kerusakan yang menyebabkan penyumbatan.`,
  "kolesterol": `Penumpukan kolesterol dapat menyempitkan pembuluh darah bahkan membuat pembuluh darah pecah sehingga berisiko besar menyebabkan stroke.`,
  "aktivitas": `Aktivitas fisik yang kurang dapat membuat denyut jantung lebih tinggi, jantung bekerja lebih keras, dan tekanan darah meningkat sehingga meningkatkan risiko stroke.`,
  "kelebihan berat badan": `Kelebihan berat badan meningkatkan risiko stroke karena membuat tekanan darah, gula darah, dan kolesterol mudah naik, sehingga pembuluh darah lebih cepat rusak atau tersumbat.`,
  "obesitas": `Kelebihan berat badan meningkatkan risiko stroke karena membuat tekanan darah, gula darah, dan kolesterol mudah naik, sehingga pembuluh darah lebih cepat rusak atau tersumbat.`,
  "jantung": `Serangan jantung menandakan adanya gangguan pada pembuluh darah. Bila terjadi pada pembuluh darah yang memasok darah menuju otak, dapat memicu stroke.`,
  "merokok": `Merokok dapat menyebabkan darah menjadi lebih kental sehingga meningkatkan risiko terbentuknya gumpalan darah yang bisa menyumbat aliran darah ke otak.`,
  "rokok": `Merokok dapat menyebabkan darah menjadi lebih kental sehingga meningkatkan risiko terbentuknya gumpalan darah yang bisa menyumbat aliran darah ke otak.`,
  "pembuluh darah": `Pembuluh darah yang sudah menyempit membuat darah mudah tersumbat dan menghambat aliran darah ke otak.`
};

export const BACKUP_QA = [
  {
    key: "myth_needles",
    keywords: ["jarum", "tusuk", "menusuk"],
    answer: `Tidak boleh menusukkan jarum pada pasien stroke. Stroke terjadi karena sumbatan atau pecahnya pembuluh darah otak, bukan pembuluh darah tepi. Tusukan bisa menaikkan tekanan darah (memperburuk stroke) dan berisiko infeksi bila tidak steril.`
  },
  {
    key: "myth_heart_only",
    keywords: ["pasien jantung", "penderita jantung"],
    answer: `Stroke adalah “brain attack” dan bisa terjadi pada siapa saja. Penderita jantung memang berisiko lebih tinggi, tetapi faktor risiko lain juga banyak seperti hipertensi, diabetes, kolesterol tinggi, obesitas, merokok, dan gaya hidup tidak sehat.`
  },
  {
    key: "myth_stroke_age",
    keywords: ["orang tua"],
    answer: `Stroke bisa terjadi pada siapa pun dan usia berapa pun. Saat ini kecenderungan usia pasien stroke bisa lebih muda karena gaya hidup tidak sehat (makanan, kurang olahraga, merokok, alkohol, dll).`
  },
  {
    key: "myth_need_long_recovery",
    keywords: ["pemulihan", "penyembuhan"],
    answer: `Pemulihan stroke umumnya membutuhkan waktu. Jika penanganan tidak teratur bisa berakibat cacat permanen. Biasanya perlu rehabilitasi/fisioterapi rutin.`
  },
  {
    key: "myth_full_recovery",
    keywords: ["sembuh total"],
    answer: `Bisa, tetapi tergantung kondisi individu, jenis stroke, penanganan, dan rehabilitasi. Umumnya pemulihan butuh waktu cukup panjang.`
  },
  {
    key: "myth_light_vs_heavy",
    keywords: ["stroke ringan", "stroke berat"],
    answer: `Perbedaannya dari luas dan lokasi kerusakan otak. Stroke ringan biasanya sumbatan kecil dengan area lebih kecil. Stroke berat biasanya sumbatan/pecah pembuluh darah besar sehingga gejala lebih parah dan bisa menyebabkan kecacatan permanen.`
  },
  {
    key: "myth_recurrent",
    keywords: ["kambuh", "berulang"],
    answer: `Pasien yang pernah stroke berisiko mengalami stroke berulang, bahkan bisa lebih parah dari serangan pertama karena luas kerusakan otak bisa bertambah.`
  },
  {
    key: "myth_sexual_activity",
    keywords: ["seksual", "sex", "seks"],
    answer: `Aktivitas seksual umumnya boleh dilakukan bertahap. Dengan komunikasi, penyesuaian, konseling/terapi medis, kontrol tekanan darah, dan dukungan keluarga, fungsi seksual dapat membaik walau pemulihan butuh waktu.`
  },

  // yang ini tetap teks karena belum ada gambar
  {
    key: "text_preventable",
    keywords: ["tidak bisa dicegah"],
    answer: `Tidak benar. Hampir 80% kejadian stroke bisa dicegah dengan mengendalikan faktor risiko stroke.`
  },
  {
    key: "text_headache",
    keywords: ["selalu sakit kepala"],
    answer: `Stroke tidak selalu disertai sakit kepala hebat. Sakit kepala hebat lebih sering pada stroke hemoragik (pecah pembuluh darah).`
  }
];