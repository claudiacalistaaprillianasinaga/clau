# 🚀 ChronoFlow: Daily Routine Planner & Smart Productivity Route

> **Aplikasi Pemantau Rute Aktivitas Harian (Pagi → Malam) dengan Sistem Pengingat Produktivitas Pintar & Kalkulasi Skor Real-Time.**  
> *Dibuat oleh: **Claudia Calista Aprilliana Sinaga***

---

## 📖 Deskripsi Proyek

**ChronoFlow (DailyRoutinePlanner)** adalah aplikasi web produktivitas interaktif yang dirancang untuk memetakan dan mengawal ritme harian seseorang dari bangun pagi hingga malam hari. 

Berbeda dengan to-do list konvensional, ChronoFlow memvisualisasikan aktivitas harian sebagai **"Rute Perjalanan Waktu (Chrono Route)"**, memberikan umpan balik instan berupa **Skor Produktivitas Real-Time (%)**, serta memicu **Smart Productivity Alert Banner** secara dinamis untuk mencegah kelelahan (*burnout*) dan menekan distraksi (*procrastination*).

---

## ✨ Fitur-Fitur Unggulan

### 1. 📊 Real-Time Productivity Score Engine
* **Kalkulasi Otomatis**: Setiap kali aktivitas ditandai selesai (`✔`), skor persentase produktivitas langsung dihitung dan diperbarui secara otomatis.
* **Tiga Zona Status Reaktif**:
  * 🟢 **Zona Hijau (≥ 75%) — 🔥 SANGAT PRODUKTIF**: Menjaga momentum ritme kerja puncak.
  * 🟡 **Zona Kuning (40% - 74%) — ⚡ CUKUP BAIK**: Peringatan untuk tidak lengah terhadap gangguan.
  * 🔴 **Zona Merah (< 40%) — 🚨 KURANG PRODUKTIF**: Peringatan keras untuk segera kembali fokus mengejar target harian.
* **Animated Gradient Progress Bar**: Visualisasi persentase progres yang mulus dengan transisi kubik.

### 2. 🗺️ Visual Chrono Timeline (Rute Pagi → Malam)
* Garis pandu rute terhubung vertikal (*continuous chronological route line*).
* Setiap node aktivitas dilengkapi:
  * **Badge Jam Presisi**: Menampilkan jendela waktu pelaksanaan (misal: `06:00 - 07:00`, `08:30 - 11:30`).
  * **Kategori Terfilter**: 
    * 💼 **Produktif (Kerja / Belajar)** — *Indigo Aura*
    * 🏃 **Kesehatan (Olahraga / Fisik)** — *Emerald Aura*
    * ☕ **Istirahat (Makan / Relaksasi / Evaluasi)** — *Amber Aura*
  * **Interaksi Cepat**: Tombol checklist (`✔` / `✅`) yang langsung mencoret teks dan memperbarui persentase status secara instan.

### 3. 🚨 Smart Productivity Alert Banner
* Sistem deteksi otomatis yang memberikan rekomendasi berbasis kondisi kerja, seperti:
  * Pengingat istirahat mata & hidrasi air putih setelah sesi kerja fokus 2 jam berturut-turut.
  * Peringatan dinamis jika target rute harian belum mencukupi batas minimum keberhasilan.

### 4. ➕ Modal Penambahan Aktivitas Dinamis
* Pengguna dapat menambahkan jadwal aktivitas baru sewaktu-waktu:
  * Input Nama Aktivitas
  * Input Rentang Jam / Waktu
  * Pemilihan Kategori (Kerja, Kesehatan, Istirahat)
* Aktivitas baru langsung masuk ke antrean timeline tanpa perlu me-reload halaman.

### 5. 💾 Fitur Simpan Instan (`Ctrl + S` / `Ctrl + Shift + S`)
* Dilengkapi *event listener* shortcut keyboard bawaan. Menekan kombinasi `Ctrl + S` atau `Ctrl + Shift + S` akan langsung mengekspor dan mengunduh seluruh status aktivitas ke file HTML lokal secara otomatis.

---

## 🎨 Desain & Estetika Antarmuka

| Komponen | Spesifikasi & Teknologi |
| :--- | :--- |
| **Gaya Visual** | Modern Glassmorphism (Backdrop blur, translucent cards, neon glow borders) |
| **Palet Warna** | Cyber Dark Theme (`#070913`, `#12182b`), Indigo (`#6366f1`), Emerald (`#10b981`), Amber (`#f59e0b`), Crimson (`#ef4444`) |
| **Tipografi** | Google Fonts: **Outfit** (Heading / Display) & **Plus Jakarta Sans** (Body & UI text) |
| **Responsivitas** | 100% Mobile & Desktop Friendly (Flexbox & CSS Grid) |

---

## 📂 Struktur File

```plaintext
project-game-claudia/
├── DailyRoutinePlanner.html     # File utama aplikasi (HTML5, CSS3, & Modern JS terintegrasi)
├── README_DailyRoutinePlanner.md # Dokumentasi spesifikasi lengkap ChronoFlow
└── README.md                    # Dokumentasi utama repositori
```

---

## 🚀 Cara Menjalankan Aplikasi

1. **Buka Langsung di Browser**:
   * Klik ganda pada file `DailyRoutinePlanner.html` atau buka melalui browser apa pun (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. **Tanpa Dependensi Tambahan**:
   * Tidak membutuhkan instalasi Node.js, server backend, atau database eksternal. Semua berjalan murni di sisi klien (*client-side execution*).

---

## 💡 Rutinitas Default Bawaan (Template)

1. `06:00 - 07:00` — 🌅 Bangun Pagi & Olahraga Ringan *(Kesehatan)*
2. `07:00 - 08:00` — 🍳 Sarapan Sehat & Persiapan Diri *(Istirahat)*
3. `08:30 - 11:30` — 💻 Sesi Fokus Utama / Deep Work *(Produktif)*
4. `12:00 - 13:00` — 🍱 Makan Siang & Istirahat Mata *(Istirahat)*
5. `13:30 - 16:30` — 🚀 Pengerjaan Proyek & Kolaborasi *(Produktif)*
6. `17:00 - 18:00` — 🏃 Jogging Sore / Olahraga Fisik *(Kesehatan)*
7. `19:00 - 20:30` — 📚 Membaca Buku / Skill Up *(Produktif)*
8. `21:00 - 22:00` — 😴 Evaluasi Harian & Persiapan Tidur *(Istirahat)*

---

*Dikembangkan dengan penuh dedikasi oleh **Claudia Calista Aprilliana Sinaga** untuk mendorong gaya hidup produktif, teratur, dan seimbang.* ✨
