# PHP/Falcon Adaptation (Konsep Sama dengan Codebase Asli)

Folder ini berisi adaptasi backend sederhana menggunakan **PHP + Phalcon** berdasarkan konsep yang sama dari frontend React saat ini:

- **Entitas utama sama**: `Person`, `Exam`, `ExamSection`, status pemeriksaan, role pengguna, dan section code.
- **Flow data sama** seperti `useMockApi`:
  - ambil daftar exam,
  - ambil detail exam per ID,
  - update exam,
  - tambah personel + exam baru dalam satu aksi.
- **Struktur section baru sama**: semua section otomatis `Draft`, section `identitas` terisi data awal.

## Struktur

- `app/Domain/RikkesTypes.php`
  - konstanta role/status/section,
  - generator section awal (`createNewExamSections`).
- `app/Infrastructure/InMemoryRikkesRepository.php`
  - repository in-memory untuk person dan exam.
- `app/Controllers/ApiController.php`
  - controller API untuk endpoint utama.
- `public/index.php`
  - bootstrap aplikasi dan route map.

## Endpoint

- `GET /api/exams`
- `GET /api/exams/{examId}`
- `PUT /api/exams/{examId}`
- `POST /api/exams`
- `GET /api/persons`

## Jalankan (contoh)

```bash
cd php/falcon
composer install
php -S 127.0.0.1:8080 -t public
```

Lalu akses endpoint misalnya: `http://127.0.0.1:8080/api/exams`.
