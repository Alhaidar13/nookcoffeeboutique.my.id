# Arunika Coffee Boutique — Homepage

## Project Overview
- **Name**: Arunika Coffee Boutique (nama brand placeholder, mudah diganti di `src/data/content.js`)
- **Goal**: Homepage premium untuk brand specialty coffee yang menjual coffee beans secara online
- **Scope tahap ini**: **Homepage saja** (belum ada Shop, Product Detail, Cart, Checkout, About, Contact)
- **Design direction**: Premium boutique · Modern minimalist · Warm & earthy · Editorial

## Sections yang Sudah Dibuat
1. **Navbar**: background cream, logo, menu Home/Shop/About/Contact, icon shopping bag, menu mobile, shadow saat scroll
2. **Hero**: layout editorial, foto biji kopi besar, kartu kemasan melayang, 2 CTA, statistik singkat
3. **Brand Introduction**: "More Than Just Coffee." dengan grid foto dan 3 pilar (Origin, Roast, Ritual)
4. **Featured Coffee**: 3 product card (Aceh Gayo, Toraja Sapan, Kintamani) dengan ukuran sama
5. **Why Choose Us**: 3 keunggulan dengan icon garis yang minimalis
6. **Brand CTA**: banner Dark Coffee Brown dengan tombol "Shop Coffee Beans"
7. **Footer**: logo, deskripsi brand, quick links, Instagram, WhatsApp, copyright

## Entry URIs
| Path | Keterangan |
|---|---|
| `/` | Homepage |
| `/#home`, `/#brand-intro`, `/#featured-coffee`, `/#why-choose-us`, `/#site-footer` | Anchor untuk smooth scroll antar-section |
| `/static/images/*` | Aset foto |

Menu Shop/About/Contact saat ini masih navigasi placeholder yang scroll ke section terkait di homepage.

## Design System
- **Colors**: `coffee` #3B2418 · `cream` #E8DCC8 · `beige` #F5F0E8 · white #FFFFFF (Tailwind v4 `@theme` di `src/index.css`)
- **Fonts**: Montserrat (`font-heading`) untuk heading · Poppins (`font-body`) untuk body, nav, tombol
- **Motion**: hover halus pada tombol/card, fade-up ringan saat scroll, mendukung `prefers-reduced-motion`

## Struktur Kode
```
src/
├── App.jsx                # Menyusun semua section
├── main.jsx / index.css   # Entry + Tailwind theme tokens
├── data/content.js        # Data brand, nav, produk, fitur (data contoh)
├── components/            # Komponen reusable
│   ├── Button, SectionHeading, Logo, Icon, Reveal
│   ├── ProductCard, CoffeeBag (SVG packaging), RoastMeter, FeatureItem
└── sections/              # Navbar, Hero, BrandIntro, FeaturedCoffee, WhyChooseUs, BrandCta, Footer
```

## Data Architecture
- Data produk berupa data contoh statis di `src/data/content.js`. Tidak ada backend, database, atau payment.

## Tech Stack
React 19 + Tailwind CSS v4 + Vite, dibuild jadi static site (`dist/`) yang siap untuk Cloudflare Pages.

## Development
```bash
npm run build                    # build ke dist/
pm2 start ecosystem.config.cjs   # serve dist/ di port 3000 (wrangler pages dev)
npm run dev                      # Vite dev server (mesin lokal)
```

## Belum Diimplementasikan / Next Steps
- Halaman Shop, Product Detail, Cart, Checkout, About, Contact
- State keranjang yang berfungsi (sekarang counter bag masih statis = 0)
- Foto produk/kemasan asli brand (sekarang kemasan berupa ilustrasi SVG yang konsisten)
- Ganti handle Instagram & nomor WhatsApp placeholder
- Deploy ke production

## Deployment
- **Platform**: Cloudflare Pages (static)
- **Status**: Preview di sandbox, belum di-deploy ke production
- **Last Updated**: 2026-11-04
