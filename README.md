# Supply Chain Management (SCM) System

Sebuah aplikasi Supply Chain Management yang dibangun menggunakan **Laravel 11**, **React**, dan **Inertia.js** (berbasis arsitektur Monolith modern). Sistem ini dirancang untuk mengelola inventaris, pembelian (Purchase Orders), penerimaan barang (Receipts), penjualan (Sales Orders), pelaporan, dan sistem notifikasi *low-stock* secara real-time.

## Fitur Utama

- **Role-Based Access Control (RBAC):** Memiliki role Admin, Procurement, Gudang, dan Sales dengan hak akses spesifik.
- **Master Data Management:** Pengelolaan Kategori, Produk, Supplier, dan Gudang.
- **Purchase Orders & Receipts:** Siklus pengadaan barang (PO) dari supplier, disusul penerimaan fisik barang di gudang tujuan (menambah stok otomatis).
- **Sales Orders:** Sistem penjualan ke pelanggan dengan validasi stok *real-time* per-gudang (mengurangi stok otomatis).
- **Inventory Tracking:** Riwayat transaksi masuk/keluar stok (*double-entry method*) dengan perhitungan sisa stok mutlak setiap saat.
- **Low-Stock Notification System:** Peringatan dini kepada Admin dan Procurement bila ada barang yang mencapai batas minimal stok (*threshold*), via notifikasi *dashboard*.
- **Excel & PDF Export:** Laporan data komprehensif.

## Prasyarat (*Requirements*)

Pastikan sistem Anda telah memiliki komponen-komponen berikut:
- **PHP** >= 8.2
- **Composer** (untuk PHP dependencies)
- **Node.js** >= 18 & **NPM** (untuk frontend dependencies)
- **MySQL** / MariaDB
- Git

## Instalasi (Clone & Development Ready)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY_ANDA>
cd <NAMA_FOLDER_PROJECT>
```

### 2. Install Dependencies

Install library PHP via Composer:
```bash
composer install
```

Install package Node.js via NPM:
```bash
npm install
```

### 3. Konfigurasi Environment (Database)

Copy file konfigurasi environment:
```bash
cp .env.example .env
```

Buka file `.env` dan sesuaikan koneksi *database* Anda. Pastikan database MySQL dengan nama tersebut sudah Anda buat.
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=root
DB_PASSWORD=password_anda
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Migrate & Seed Database

Langkah ini sangat penting untuk membangun tabel di database beserta **Data Dummy** (User, Produk, Stok, Transaksi) agar aplikasi siap diuji coba:

```bash
php artisan migrate:fresh --seed
```

### 6. Jalankan Server Development

Aplikasi Laravel + React/Inertia membutuhkan **dua terminal** yang berjalan bersamaan di tahap *development*.

**Terminal 1 (Vite Frontend Server):**
```bash
npm run dev
```

**Terminal 2 (Laravel Backend Server):**
```bash
php artisan serve
```

Aplikasi sekarang dapat diakses di browser melalui URL: `http://localhost:8000`

---

## Akun Login (Data Seed)

Semua akun default menggunakan password **`password`**. 

| Role | Email Login | Hak Akses |
| --- | --- | --- |
| **Admin** | `admin@example.com` | Akses penuh ke seluruh fitur dan master data. |
| **Procurement** | `procurement@example.com` | Mengelola Supplier, Kategori, Produk, dan membuat Purchase Order. Menerima notifikasi *low-stock*. |
| **Gudang** | `gudang@example.com` | Menerima barang (Receipt) dan memantau stok Gudang. |
| **Sales** | `sales@example.com` | Membuat dan memantau Sales Order. |

*(Anda bisa melihat daftar lengkap user *dummy* pada menu Dashboard Admin)*

## Menjalankan Sistem Pengecekan Stok (Cron Job)

Sistem memiliki sistem otomatis yang memeriksa stok barang setiap 6 jam. Namun untuk tujuan pengetesan, Anda dapat memicu peringatan *low-stock* secara manual melalui perintah berikut di terminal:

```bash
php artisan stock:check-low
```
Perintah ini akan mengecek semua stok dan mengirimkan notifikasi kepada user **Admin** dan **Procurement** jika ada barang yang jumlahnya di bawah batas *threshold* (5 unit).

## Lisensi
Aplikasi ini bersifat open-source.
