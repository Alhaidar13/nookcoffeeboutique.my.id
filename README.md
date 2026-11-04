# Nook Coffee Boutique

## Project Overview
- **Name**: Nook Coffee Boutique (nama brand diatur di `src/data/content.js`)
- **Goal**: Website premium untuk brand specialty coffee yang menjual coffee beans secara online
- **Design direction**: Premium boutique · Modern minimalist · Warm & earthy · Editorial

## URLs
- **GitHub**: https://github.com/Alhaidar13/nookcoffeeboutique.my.id
- **Production**: belum di-deploy

## Fitur yang Sudah Selesai
### Homepage
1. **Navbar**: logo Nook, menu Home/Shop/About/Contact, counter keranjang yang berfungsi, menu mobile
2. **Hero**, **Brand Introduction**, **Featured Coffee** (3 produk), **Why Choose Us**, **Brand CTA**, **Footer**
3. Tombol **View All Coffee**, menu **Shop**, dan **Shop Coffee Beans** membuka halaman All Coffee

### All Coffee / Product Catalog (`#/coffee`)
- **Product Category Filter**: tab All Coffee · Khas Nusantara (Arabika, 23 origin) · Kopi Luwak (Robusta, 1) · Robusta (4), masing-masing dengan jumlah produk
- **Pengelompokan per kategori**: produk selalu tampil per kategori dengan header sendiri (gambar, deskripsi, jumlah produk, link "See only …"), tidak pernah dicampur dalam satu daftar
- **Filter ukuran** di toolbar (All / Sachet / 100g / 150g / 250g): hanya menampilkan kopi yang tersedia di ukuran tersebut
- **Selector ukuran per kartu**: hanya menampilkan ukuran yang benar-benar dijual untuk origin tersebut; harga ikut berubah
- **Daftar harga**:
  | Kategori | Ukuran | Harga |
  |---|---|---|
  | Khas Nusantara (Arabika) | Sachet | Rp15.000 / sachet (**min. order 5 sachet**) |
  | Khas Nusantara (Arabika) | 150g | Rp65.000 |
  | Khas Nusantara (Arabika) | 250g | Rp85.000 |
  | Kopi Luwak (Robusta) | 100g | Rp215.000 |
  | Robusta | 250g | Rp105.000 |
- **Product Grid Layout**: grid kartu responsif (1/2/3/4 kolom) dengan tinggi kartu yang seragam
- **Product Card**: gambar kemasan, kategori, asal, nama, deskripsi singkat, flavor notes, harga, tombol **View Detail**
- **Search Product**: mencari berdasarkan nama, asal, flavor notes, roast, proses, atau metode seduh; mendukung banyak kata kunci, shortcut `/`, tombol clear, dan tampilan "No coffee found"
- Toolbar filter tetap terlihat saat di-scroll (sticky); status filter tersimpan di URL sehingga bisa dibagikan

### Product Detail (`#/coffee/:id`)
- Breadcrumb Home › All Coffee › Kategori › Produk
- Gambar kemasan besar dan thumbnail per varian ukuran
- **Pilihan varian ukuran** dalam bentuk kartu, hanya ukuran yang tersedia untuk produk tersebut, masing-masing dengan harga
- **Aturan minimal 5 sachet**: jika jumlah sachet di bawah 5, muncul tulisan kecil berwarna merah "Sachet wajib pesan minimal 5 sachet — tambah N lagi" dan tombol Add to Bag dinonaktifkan sampai jumlahnya mencapai 5
- Pengatur jumlah dan tombol **Add to Bag** (keranjang tersimpan di localStorage, muncul notifikasi toast)
- Tasting profile (roast level, flavor notes, metode seduh), spesifikasi (asal, ketinggian, proses, varietas), deskripsi lengkap
- Rekomendasi "You May Also Like" dari kategori yang sama

### Homepage — Testimonials & Footer
- **Hero**: judul "Discover the Art of Exceptional Coffee." memakai satu gaya tulisan yang sama (tanpa italic)
- **Testimonials** (`src/sections/Testimonials.jsx`, `#testimonials`): 2 baris kartu yang bergerak otomatis ke arah berlawanan (baris atas ke kiri, baris bawah ke kanan), loop tanpa jeda, berhenti saat di-hover, dan mematuhi `prefers-reduced-motion`. Data ada di `testimonials` di `src/data/content.js`
- **Footer**:
  - Customer Center (lokasi): Jl. Bali Raya No. 49, Kelurahan Makasar, Kecamatan Cipinang Melayu, Jakarta Timur, DKI Jakarta, Indonesia (link ke Google Maps)
  - WhatsApp: +6287797890306 dan +6285772196163, langsung membuka chat `wa.me` dengan pesan pembuka
  - Instagram: @nook.coffeeboutique
  - Data kontak ada di `contact` di `src/data/content.js`

## Entry URIs
| Path | Keterangan |
|---|---|
| `/` atau `/#home` | Homepage (`#brand-intro`, `#featured-coffee`, `#why-choose-us`, `#site-footer` = anchor section) |
| `/#/coffee` | All Coffee / Product Catalog |
| `/#/coffee?category=khas-nusantara\|kopi-luwak\|robusta` | Catalog dengan filter kategori |
| `/#/coffee?size=sachet\|150g\|250g` | Catalog dengan ukuran default |
| `/#/coffee?q=luwak` | Catalog dengan kata kunci pencarian |
| `/#/coffee/:id?size=150g` | Product Detail, misalnya `/#/coffee/aceh-gayo?size=150g` |

## Data Architecture
- **Data produk**: data statis di `src/data/catalog.js`, terdiri dari `categories`, `variants`, dan `catalog` (27 produk, dibangun otomatis dari tabel `PRICES`, `AVAILABILITY`, dan `PROFILES`). Untuk menambah atau menghapus origin di suatu ukuran, cukup edit daftar id di `AVAILABILITY`. Setiap produk punya `category`, `bean`, `prices` (hanya ukuran yang tersedia), `notes`, `roast`, `process`, `altitude`, `varietal`, `brew`, dan `description`
- **Keranjang**: React context (`src/context/CartContext.jsx`) yang disimpan di `localStorage` (`nook-cart-v1`)
- **Routing**: hash router ringan (`src/hooks/useHashRoute.js`), tanpa dependency tambahan
- Tidak ada backend, database, atau payment

## Struktur Kode
```
src/
├── App.jsx                    # Router: Home / Catalog / Detail
├── data/content.js            # Brand, nav, featured products, features
├── data/catalog.js            # Harga, ketersediaan per ukuran, profil rasa (27 produk)
├── hooks/useHashRoute.js      # Hash router + sinkronisasi query string
├── context/CartContext.jsx    # State keranjang + toast
├── pages/CatalogPage.jsx      # Halaman All Coffee
├── pages/ProductDetailPage.jsx
├── components/                # Button, Logo, Icon, CoffeeBag, ProductCard,
│                              # CatalogCard, VariantSelector, Toast, dll.
└── sections/                  # Navbar, Hero, BrandIntro, FeaturedCoffee, ...
```

## Design System
- **Colors**: `coffee` #3B2418 · `cream` #E8DCC8 · `beige` #F5F0E8 · white
- **Fonts**: Montserrat (heading) · Poppins (body)
- **Motion**: hover halus, fade-up saat scroll, mendukung `prefers-reduced-motion`

## User Guide
1. Di homepage, klik **View All Coffee** (atau menu **Shop**)
2. Pilih kategori lewat tab, ubah ukuran lewat selector **Size**, atau ketik di kolom pencarian
3. Klik **View Detail** pada produk, pilih ukuran dan jumlah, lalu klik **Add to Bag**

## Development
```bash
npm run build                    # build ke dist/
pm2 start ecosystem.config.cjs   # serve dist/ di port 3000 (wrangler pages dev)
npm run dev                      # Vite dev server (mesin lokal)
```

## Belum Diimplementasikan / Next Steps
- Halaman Cart, Checkout, About, Contact
- Pilihan grind (whole bean / ground) dan sorting harga di catalog
- Foto produk asli (sekarang kemasan berupa ilustrasi SVG yang konsisten)
- Mengganti handle Instagram dan nomor WhatsApp placeholder
- Deploy ke production

## Deployment
- **Platform**: Cloudflare Pages (static)
- **Status**: Preview di sandbox, belum di-deploy ke production
- **Tech Stack**: React 19 + Tailwind CSS v4 + Vite
- **Last Updated**: 2026-11-04
