# Sistem Pemeriksaan Kesehatan Berkala TNI AU

> Aplikasi web untuk manajemen alur pemeriksaan kesehatan berkala personel TNI AU secara multi-role, dari input per bagian sampai finalisasi laporan dan unduh PDF.

---

## 📌 Ringkasan Proyek

**Sistem Pemeriksaan Kesehatan Berkala TNI AU** adalah aplikasi React + TypeScript berbasis Vite untuk memproses laporan rikkes secara terstruktur. Sistem ini memecah formulir menjadi beberapa section medis (Identitas, Klinis, Gigi, Penunjang, Vital, Mata/THT, Lab, Resume) dan mengelola proses submit, revisi, finalisasi, serta analitik ringkas.

Aplikasi dirancang dengan pendekatan:
- **Role-based workflow** (Admin, Dokter Umum, Dokter Gigi, ATLM Lab, Radiografer, Reviewer).
- **Section-level status** (Draft / Submitted).
- **Exam-level status** (In Progress / Pending Review / Finalized / Revision Needed).
- **Mock API simulation** untuk pengembangan cepat tanpa backend nyata.

---

## ✨ Fitur Utama

### 1) Otentikasi berbasis peran (simulasi login)
Pengguna memilih peran saat login untuk mengakses fungsi sesuai otoritas.

### 2) Dashboard pemeriksaan
- Daftar kartu pemeriksaan personel.
- Progress bar per laporan berdasarkan jumlah section yang sudah submitted.
- Filter status laporan.
- Filter rentang tanggal pemeriksaan.
- Pencarian nama/NRP.
- Reset filter cepat.

### 3) Manajemen personel baru (Admin)
Admin dapat menambahkan data personel dan otomatis membuat pemeriksaan baru dengan section awal default.

### 4) Pengisian formulir per section
Section dipisah menjadi modul terpisah agar alur kolaboratif antar tenaga medis lebih jelas dan maintainable.

### 5) Kontrol status section
- Simpan sebagai draft.
- Submit section.
- Lock otomatis untuk peran non-berwenang saat section submitted.

### 6) Mekanisme revisi oleh Admin
Admin bisa mengembalikan section submitted menjadi draft dengan alasan revisi. Alasan ditampilkan ke pengguna terkait sebagai notifikasi revisi.

### 7) Preview dan finalisasi laporan
- Preview laporan dua halaman sesuai format dokumen rikkes.
- Finalisasi laporan untuk menandai laporan sudah selesai.

### 8) Export PDF
Generate file PDF menggunakan `html2canvas` + `jsPDF` dari layout preview halaman 1 dan 2.

### 9) Dashboard analitik (Admin)
Menyediakan statistik operasional:
- total laporan,
- laporan in progress,
- laporan final,
- rata-rata waktu penyelesaian,
- distribusi kesimpulan kesehatan,
- top 5 temuan abnormal klinis,
- status kesehatan per kesatuan.

---

## 🧩 Fungsi Sistem (Analisis Mendalam)

## A. Arsitektur Frontend
Aplikasi bersifat **single-page application (SPA)** dengan entry point `index.tsx` yang merender `App`. Komponen `App` berperan sebagai orchestrator state global UI:
- state autentikasi role,
- state halaman aktif (dashboard/analytics),
- state pemeriksaan terpilih,
- state sidebar desktop/mobile,
- binding ke custom hook `useMockApi`.

## B. Data Model dan Domain
Model domain ditetapkan kuat via TypeScript (`types.ts`):
- enum role pengguna,
- enum status laporan,
- enum status section,
- enum kode section,
- struktur data rinci tiap section medis.

Pendekatan ini mengurangi inkonsistensi payload antar section dan memudahkan validasi di level komponen.

## C. Konfigurasi role terhadap section
`constants.ts` memetakan section ke role yang berwenang (`SECTION_CONFIG`). Ini menjadi dasar:
- kontrol editability di sidebar section,
- lock/unlock aksi simpan/submit,
- visual indicator di UI (edit/lock/submitted/revision).

## D. Sumber data dan API simulasi
`useMockApi.ts` mensimulasikan API async menggunakan `setTimeout` + success rate probabilistik.
Fungsi inti:
- load awal data exam + person,
- update exam,
- lookup exam by id,
- create person + exam baru.

Keunggulan untuk development:
- mudah uji state loading/error,
- dapat meniru latency jaringan,
- tanpa ketergantungan backend saat prototyping.

## E. Workflow pemeriksaan
Alur kerja inti:
1. Login sesuai role.
2. Pilih data pemeriksaan dari dashboard.
3. Masuk ke halaman detail pemeriksaan.
4. Isi section sesuai hak akses.
5. Simpan draft / submit section.
6. Jika perlu, admin revert section ke draft dengan alasan.
7. Buka preview PDF.
8. Finalisasi laporan.
9. Unduh PDF final.

## F. Sistem validasi formulir
Setiap section memiliki validasi lokal (contoh: field wajib, minimal opsi terpilih, dsb.). Error ditampilkan inline, feedback aksi ditampilkan terpisah. Ini meningkatkan kejelasan UX saat input data medis panjang.

## G. Pengelolaan PDF
Komponen `PdfPreview` merender template dokumen siap cetak. Utility `generateExamPdf`:
- menangkap elemen DOM `pdf-page-1` & `pdf-page-2`,
- render ke canvas,
- konversi ke image,
- injeksi ke dokumen A4,
- trigger download.

## H. Analitik data
`AnalyticsDashboard` menghitung metrik dari state exam in-memory dan merender grafik via Chart.js:
- pie chart distribusi hasil,
- horizontal bar top abnormal findings,
- stacked bar hasil per kesatuan.

## I. UI/UX teknis
- Styling memakai Tailwind via CDN.
- Sidebar mendukung collapse desktop dan overlay mobile.
- Status section divisualkan dengan icon kontekstual.
- Aplikasi memiliki feedback operasional (loading/error/success).

---

## 🗂️ Struktur Direktori Inti

```bash
.
├── App.tsx
├── index.tsx
├── types.ts
├── constants.ts
├── hooks/
│   └── useMockApi.ts
├── components/
│   ├── Dashboard.tsx
│   ├── ExamDetail.tsx
│   ├── ExamSidebar.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── sections/
│   └── shared/
├── utils/
│   └── pdfGenerator.ts
├── index.html
├── vite.config.ts
└── package.json
```

---

## ⚙️ Teknologi yang Digunakan

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS (CDN runtime config)**
- **Chart.js (CDN)**
- **html2canvas (CDN)**
- **jsPDF (CDN)**

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Node.js 18+ (disarankan LTS terbaru)
- npm

### Langkah
```bash
npm install
npm run dev
```

Aplikasi default berjalan pada:
- `http://localhost:3000`

### Build produksi
```bash
npm run build
npm run preview
```

---

## 🔐 Catatan Keamanan & Keterbatasan Saat Ini

- Login saat ini masih simulasi role selector, belum autentikasi real.
- Data masih mock/in-memory (belum persisten ke database).
- API key mapping di `vite.config.ts` tersedia, namun belum digunakan sebagai backend integration aktif.
- PDF berbasis render DOM, jadi sangat bergantung pada konsistensi tampilan browser.

---

## 🛠️ Rekomendasi Pengembangan Lanjutan

1. Integrasi backend (REST/GraphQL) + database.
2. Implementasi autentikasi JWT/SSO internal.
3. Audit trail detail per perubahan field.
4. RBAC lebih granular per aksi.
5. Digital signature untuk finalisasi laporan.
6. Ekspor data analitik (CSV/XLSX).
7. Unit test dan integration test (Vitest + React Testing Library).
8. Internationalization bila dibutuhkan lintas unit.

---

## 👤 Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

- GitHub: [github.com/sobri3195](https://github.com/sobri3195)
- Email: [muhammadsobrimaulana31@gmail.com](mailto:muhammadsobrimaulana31@gmail.com)
- YouTube: [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- TikTok: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- Grup WhatsApp: [Join Group](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)
- Website: [muhammadsobrimaulana.netlify.app](https://muhammadsobrimaulana.netlify.app)
- Landing Page: [sevalla.page](https://muhammad-sobri-maulana-kvr6a.sevalla.page/)
- Toko Online Sobri: [pegasus-shop.netlify.app](https://pegasus-shop.netlify.app)
- Gumroad: [maulanasobri.gumroad.com](https://maulanasobri.gumroad.com/)

---

## ❤️ Donasi & Dukungan

Jika proyek ini bermanfaat, Anda dapat mendukung melalui:

- Lynk: [lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)
- Trakteer: [trakteer.id/g9mkave5gauns962u07t](https://trakteer.id/g9mkave5gauns962u07t)
- KaryaKarsa: [karyakarsa.com/muhammadsobrimaulana](https://karyakarsa.com/muhammadsobrimaulana)
- Nyawer: [nyawer.co/MuhammadSobriMaulana](https://nyawer.co/MuhammadSobriMaulana)

---

## 📄 Lisensi

Silakan sesuaikan lisensi proyek sesuai kebutuhan organisasi (MIT/Apache-2.0/Proprietary).

