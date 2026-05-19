# Dokumen Fitur & Alur Sistem Rikkes TNI AU

Dokumen ini merangkum **fitur lengkap** aplikasi serta **alur kerja end-to-end** agar mudah dipakai untuk presentasi, handover, atau blueprint pengembangan lanjutan.

---

## 1. Tujuan Sistem

Sistem ini dirancang untuk:
- Mengelola pemeriksaan kesehatan berkala personel TNI AU.
- Memecah pengisian data ke section medis agar kolaborasi multi-role lebih terstruktur.
- Menyediakan kontrol proses dari draft, submit, revisi, finalisasi hingga unduh PDF.
- Memberikan ringkasan analitik untuk pemantauan operasional.

---

## 2. Aktor / Role Pengguna

Role yang tersedia dalam aplikasi:
- **Admin**
- **Dokter Umum**
- **Dokter Gigi**
- **ATLM Lab**
- **Radiografer**
- **Reviewer**

Hak akses ditentukan berbasis role terhadap section tertentu. Role yang tidak berwenang tetap dapat melihat section, namun aksi edit/submit akan dibatasi sesuai aturan sistem.

---

## 3. Daftar Fitur Lengkap

### 3.1 Otentikasi (Simulasi Login)
- Pengguna memilih role saat login.
- Role aktif menjadi dasar kontrol halaman dan aksi.
- Mekanisme ini masih simulatif (belum autentikasi real/JWT/SSO).

### 3.2 Dashboard Pemeriksaan
- Menampilkan daftar pemeriksaan personel dalam bentuk kartu/list.
- Menampilkan status pemeriksaan (misalnya in progress, pending review, finalized, revision needed).
- Menampilkan progres penyelesaian per pemeriksaan.
- Mendukung filter status.
- Mendukung filter rentang tanggal pemeriksaan.
- Mendukung pencarian nama/NRP.
- Menyediakan aksi reset filter.

### 3.3 Manajemen Personel Baru (Admin)
- Admin dapat menambah personel baru.
- Saat personel dibuat, sistem otomatis membuat data pemeriksaan awal beserta section default.
- Mempercepat onboarding data pemeriksaan baru.

### 3.4 Halaman Detail Pemeriksaan
- Menampilkan seluruh section pemeriksaan untuk satu personel.
- Menyediakan navigasi section melalui sidebar.
- Menyajikan status setiap section (draft/submitted/revision).
- Menjadi pusat input data klinis lintas role.

### 3.5 Modul Formulir per Section
Section utama yang dikelola:
- Identitas
- Evaluasi Klinis
- Gigi/Odontogram
- Pemeriksaan Penunjang
- Tanda Vital
- Spesialis (termasuk mata/THT sesuai kebutuhan form)
- Laboratorium
- Resume/Kesimpulan

Setiap section dipisah sebagai komponen tersendiri untuk memudahkan:
- maintainability kode,
- pembagian tanggung jawab tim,
- validasi per domain medis.

### 3.6 Kontrol Status Section
Untuk setiap section tersedia alur:
- **Save Draft**: simpan sementara, masih bisa dilanjutkan.
- **Submit Section**: menandai section selesai oleh role terkait.
- Setelah submit, section dapat terkunci dari role non-berwenang.

### 3.7 Mekanisme Revisi oleh Admin
- Admin dapat mengembalikan section dari status submitted ke draft.
- Admin wajib/opsional memberikan alasan revisi (sesuai alur UI).
- Alasan revisi ditampilkan ke pengguna terkait sebagai umpan balik perbaikan.

### 3.8 Preview Dokumen Rikkes
- Sistem menampilkan preview dokumen laporan (2 halaman).
- Preview mengikuti layout siap cetak.
- Berguna untuk pengecekan akhir sebelum finalisasi.

### 3.9 Finalisasi Laporan
- Admin/role berwenang dapat memfinalisasi pemeriksaan.
- Status pemeriksaan berubah ke finalized.
- Menandakan proses input dan review utama selesai.

### 3.10 Export PDF
- Dokumen preview dapat diunduh menjadi PDF.
- Mekanisme teknis menggunakan render DOM ke canvas lalu dibentuk ke dokumen PDF A4.
- File siap dibagikan/diarsipkan.

### 3.11 Dashboard Analitik (Admin)
Menyediakan metrik operasional seperti:
- total laporan,
- laporan in progress,
- laporan finalized,
- rata-rata waktu penyelesaian,
- distribusi kesimpulan kesehatan,
- top temuan abnormal klinis,
- status kesehatan per kesatuan.

---

## 4. Alur Bisnis Utama (End-to-End)

### 4.1 Alur Normal
1. Pengguna login dan memilih role.
2. Pengguna masuk dashboard dan memilih data pemeriksaan.
3. Pengguna membuka detail pemeriksaan.
4. Setiap role mengisi section yang menjadi kewenangannya.
5. Section disimpan sebagai draft jika belum selesai.
6. Section di-submit ketika sudah lengkap.
7. Admin/reviewer memantau progres keseluruhan.
8. Jika semua lengkap, lakukan preview laporan.
9. Finalisasi laporan.
10. Unduh PDF untuk dokumentasi.

### 4.2 Alur Revisi
1. Admin menemukan section yang perlu koreksi.
2. Admin mengembalikan section ke draft + memberi alasan revisi.
3. Role terkait menerima informasi revisi.
4. Role melakukan perbaikan data.
5. Role submit ulang section.
6. Setelah valid, lanjut ke finalisasi.

---

## 5. Status yang Dikelola Sistem

### 5.1 Status Section
- **Draft**: masih proses pengisian/perbaikan.
- **Submitted**: selesai diisi oleh role terkait dan menunggu tahap berikutnya.

### 5.2 Status Pemeriksaan (Exam)
- **In Progress**
- **Pending Review**
- **Finalized**
- **Revision Needed**

Status exam biasanya diturunkan dari kombinasi status section + aksi admin/reviewer.

---

## 6. Validasi & Umpan Balik

- Setiap section memiliki validasi lokal (field wajib, format, dan kelengkapan).
- Error ditampilkan inline agar cepat diperbaiki.
- Aplikasi menampilkan state loading/success/error pada aksi penting.

---

## 7. Arsitektur Singkat

### 7.1 Frontend
- SPA berbasis React + TypeScript.
- Entry point merender `App` sebagai orchestrator utama state aplikasi.

### 7.2 Data Model
- Tipe domain terdefinisi kuat (enum role, status exam, status section, struktur data section).
- Menurunkan risiko inkonsistensi data antar modul.

### 7.3 API Layer (Mock)
- Hook mock API mensimulasikan load/update/create data dengan async delay.
- Cocok untuk pengembangan sebelum backend nyata tersedia.

---

## 8. Batasan Saat Ini

- Login masih simulasi role selector.
- Data masih in-memory/mock (belum persist database produksi).
- Belum ada audit trail detail per perubahan field.
- Belum ada tanda tangan digital finalisasi.

---

## 9. Rekomendasi Pengembangan Lanjutan

1. Integrasi backend + database persisten.
2. Implementasi autentikasi (JWT/SSO internal).
3. RBAC lebih granular hingga level aksi/field.
4. Audit trail lengkap perubahan data.
5. Digital signature untuk finalisasi dokumen.
6. Export analitik (CSV/XLSX).
7. Penambahan unit & integration test.
8. Hardening keamanan dan logging operasional.

---

## 10. Ringkasan Cepat untuk Presentasi

- Sistem mendukung **workflow rikkes multi-role** dari input data hingga dokumen final.
- Fitur kunci: **dashboard operasional, section-based form, submit/revisi, preview, finalisasi, export PDF, dan analitik admin**.
- Alur dirancang agar kolaboratif, terukur statusnya, dan siap dikembangkan ke integrasi backend produksi.
