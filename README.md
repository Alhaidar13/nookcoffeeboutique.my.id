# Nook Coffee Boutique

## Project Overview
- **Name**: Nook Coffee Boutique (nama brand diatur di `src/data/content.js`)
- **Goal**: Website toko online untuk brand specialty coffee
- **Tech Stack**: React 19 + Vite + Tailwind CSS v4, di-deploy sebagai static site di Cloudflare Pages. Database pesanan memakai **Supabase**

## URLs
- **GitHub**: https://github.com/Alhaidar13/nookcoffeeboutique.my.id
- **Production**: belum di-deploy

---

## Mau edit sesuatu? Ini file-nya

| Yang mau diubah | File |
|---|---|
| **Gambar produk** | `src/data/productImages.js` + taruh fotonya di `public/static/images/products/` |
| Harga, varian, produk baru | `src/data/catalog.js` → tabel `PRODUCTS` |
| Keuntungan per produk (Rp20.000) | `src/data/catalog.js` → `MARGIN` |
| Harga sachet | `src/data/catalog.js` → `SACHET_PRICE` dan daftar `SACHET` |
| Harga coret / diskon | `src/data/catalog.js` → `STRIKE_PRICE` |
| Deskripsi rasa, asal, roast | `src/data/catalog.js` → `PROFILES` |
| Gambar latar kategori | `src/data/catalog.js` → `categories[].image` |
| Gambar hero / about / CTA | `public/static/images/` (ganti file dengan nama yang sama) |
| Rekening BSI, QRIS, WhatsApp | `src/data/content.js` → `payment` & `contact` |
| Testimoni | `src/data/content.js` → `testimonials` |
| Database pesanan | `supabase/schema.sql` |

### Cara mengganti gambar produk
1. Upload fotonya ke folder `public/static/images/products/`, misalnya `gayo-highland.jpg`. Disarankan rasio 1:1 atau 4:5, ukuran maksimal sekitar 300KB.
2. Buka `src/data/productImages.js` dan tambahkan:
   ```js
   export const PRODUCT_IMAGES = {
     'gayo-highland': '/static/images/products/gayo-highland.jpg',
     'gayo-highland:1kg': '/static/images/products/gayo-1kg.jpg', // opsional, khusus varian 1kg
   }
   ```
3. Build/deploy ulang. Produk yang tidak terdaftar otomatis memakai ilustrasi kemasan kopi.

ID produk bisa dilihat di `src/data/catalog.js` (tabel `PRODUCTS`). Contohnya: `signature-blend`, `premium-blend`, `delightful-blend`, `blend-175`, `bali-kintamani`, `gayo-highland`, `java-cikuray`, `robusta-gayo`, `luwak-liar-gayo`, `luwak-liar-gayo-luxury-box`.

---

## Daftar Harga (Pricelist 2026 + Rp20.000)
Harga jual = harga di pricelist + **Rp20.000** (keuntungan). **Sachet tidak ditambah** (tetap Rp15.000, min. order 5).

| Kategori | Varian | Contoh (modal → jual) |
|---|---|---|
| Espresso Based (4 blend) | 100g / 250g / 1kg | Signature Blend 250g: 107.000 → **127.000** |
| Single Origin Arabika (20 origin) | 100g / 200g / 1kg | Gayo Highland 200g: 92.000 → **112.000** |
| Robusta (4) | 100g / 250g / 1kg | Robusta Gayo 250g: 85.000 → **105.000** |
| Limited Edition | Luwak Liar Gayo 100g / 1kg | 190.000 → **210.000** · 1.899.000 → **1.919.000** |
| Limited Edition | Luwak Liar Gayo Luxury Box / Box+ | 360.000 → **380.000** · 610.000 → **630.000** |
| Sachet (11 produk) | Sachet | **Rp15.000** (tanpa margin) |

### Harga Coret
- Diatur di `STRIKE_PRICE` (`src/data/catalog.js`)
- Rumus: `harga coret = harga jual + persen%`, lalu dibulatkan ke atas per Rp5.000. Untuk sachet dibulatkan per Rp1.000
- Persen default: Espresso & Single Origin 20%, Robusta 18%, Limited 15%, Sachet 20%
- Harga coret bisa diatur manual per varian lewat `overrides`, contohnya `'gayo-wine:200g': 185000`. Isi `0` untuk menyembunyikan harga coret varian itu
- Matikan semua harga coret dengan `enabled: false`
- Tampil di kartu produk (badge "Hemat X%"), halaman detail ("Promo — hemat RpX"), pilihan ukuran, ringkasan checkout ("Kamu hemat"), dan pita promo di hero

---

## Pembayaran & Supabase
Pembayaran **tidak lagi otomatis sukses**. Alurnya:

1. Pembeli mengisi data, memilih GoPay QRIS atau VA BSI, lalu klik **Saya Sudah Bayar**
2. Pesanan disimpan ke Supabase dengan status **`waiting_verification`** (Menunggu Verifikasi)
3. Admin mengecek mutasi rekening, lalu di Supabase mengubah `payment_status` menjadi:
   - `paid` → halaman pembeli otomatis berubah menjadi **Pembayaran Diterima**
   - `rejected` (isi juga `admin_note`) → tampil **Pembayaran Ditolak** beserta catatannya
4. Halaman pembeli mengecek status sendiri setiap 15 detik. Ada juga tombol **Cek status sekarang**

### Setup Supabase (sekali saja)
1. Buka Supabase Dashboard → **SQL Editor** → **New query**
2. Paste seluruh isi `supabase/schema.sql`, lalu klik **Run**. File ini aman dijalankan berulang kali
3. Ambil **Project URL** dan **anon public key** di Project Settings → API
4. Isi environment variable:
   - Lokal: salin `.env.example` menjadi `.env`
   - Cloudflare Pages: Settings → Environment variables
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Build/deploy ulang. Variabel `VITE_` dibaca saat build

Jika env belum diisi, checkout tetap jalan dengan status "Menunggu Verifikasi" yang hanya tersimpan di browser, dan verifikasi dilakukan lewat WhatsApp.

### Isi database (`supabase/schema.sql`)
- **`orders`**: kode pesanan, data pembeli, metode bayar, subtotal, ongkir, total, `payment_status` (`unpaid` / `waiting_verification` / `paid` / `rejected` / `refunded`), `order_status` (`new` / `processing` / `shipped` / `completed` / `cancelled`), no. resi, catatan admin, `paid_at`
- **`order_items`**: produk, varian, harga, harga coret, jumlah, subtotal
- **RPC `create_order`**: dipanggil website. Memvalidasi input, menghitung ulang subtotal di server, dan aman terhadap klik ganda
- **RPC `get_order_status`**: cek status. Wajib kode pesanan + no. telepon yang cocok
- **Trigger**: `updated_at` otomatis. Saat status menjadi `paid`, `paid_at` terisi dan `order_status` berubah ke `processing`. `total = subtotal + ongkir`
- **Keamanan (RLS)**: pengunjung tidak bisa membaca atau mengubah tabel secara langsung, hanya lewat 2 RPC di atas
- **View `admin_orders_overview`**: ringkasan pesanan untuk admin
- Di bagian bawah file ada contoh query admin (verifikasi, tolak, isi ongkir/resi)

Skema ini sudah diuji di PostgreSQL 17 dengan role `anon`, sama seperti di Supabase: buat order, klik ganda, cek status, akses tabel ditolak, dan admin set `paid`.

---

## Fitur Utama
### Homepage
- **Navbar**: menu benar-benar di tengah layar (grid 3 kolom), pill aktif, mengecil saat scroll, progress bar scroll, badge keranjang beranimasi saat item bertambah, menu HP full-screen dengan animasi
- **Hero**: judul muncul per kata, teks "Exceptional" berkilau, biji kopi melayang, blob latar bergerak, uap kopi, efek tilt mengikuti mouse, angka statistik menghitung naik, kartu produk mengambang
- **Pita promo berjalan** di bawah hero
- Featured Coffee, About, Why Choose Us, Testimonials (auto-scroll), CTA (zoom pelan / ken-burns), Footer
- **Tombol WhatsApp mengambang** dengan gelembung sapaan + tombol kembali ke atas

### All Coffee (`#/coffee`)
- 4 kategori: Espresso Based · Single Origin · Robusta · Limited Edition
- Filter ukuran (Sachet / 100g / 200g / 250g / 1kg), pencarian, toolbar sticky
- Kartu produk: animasi mengambang, kilau saat hover, badge Best Seller & Hemat X%, harga coret

### Product Detail (`#/coffee/:id`)
- Pilihan ukuran lengkap dengan harga & harga coret, aturan minimal 5 sachet
- **Bar "Add to Bag" menempel di bawah layar HP**

### Checkout (`#/checkout`)
- Stepper 3 langkah yang **simetris & di tengah**: Data → Bayar → Verifikasi, dengan garis progres beranimasi
- GoPay QRIS & VA BSI, pop-up pembayaran, struk PNG, kirim ke WhatsApp
- Step 3 menampilkan status: Menunggu Verifikasi / Diterima / Ditolak

### Optimasi HP
- Tidak ada scroll horizontal (dicek di lebar 390px), padding & ukuran font disesuaikan
- Input 16px agar iOS tidak auto-zoom, mendukung safe-area untuk iPhone, modal memakai `dvh`
- Tombol penuh lebar di HP, tab/filter bisa digeser
- Animasi tetap jalan walau mode hemat baterai menyalakan "reduced motion"

## Struktur Folder
```
src/
  data/catalog.js        ← produk, harga, margin, harga coret
  data/productImages.js  ← gambar produk
  data/content.js        ← brand, kontak, pembayaran, testimoni
  lib/supabase.js        ← koneksi Supabase (RPC)
  pages/                 ← CatalogPage, ProductDetailPage, CheckoutPage
  sections/              ← Navbar, Hero, Footer, dll.
  components/            ← PriceTag, ProductVisual, FloatingActions, dll.
supabase/schema.sql      ← SQL untuk Supabase
public/static/images/    ← gambar (products/ untuk foto produk)
```

## Development
```bash
npm install
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000   # atau: pm2 start ecosystem.config.cjs
```

## Belum Dikerjakan / Saran Berikutnya
- Panel admin di website untuk verifikasi pembayaran (saat ini lewat Supabase Dashboard)
- Ongkir otomatis (RajaOngkir / Biteship)
- Notifikasi email/WA otomatis saat status berubah menjadi `paid`
- Upload bukti transfer langsung ke Supabase Storage
- Deploy ke Cloudflare Pages + custom domain nookcoffeeboutique.my.id

## Deployment
- **Platform**: Cloudflare Pages (static)
- **Status**: ❌ Belum di-deploy
- **Last Updated**: 5 November 2026
