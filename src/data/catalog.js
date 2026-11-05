// =====================================================================
//  KATALOG PRODUK — satu-satunya sumber data untuk halaman All Coffee,
//  Product Detail, Featured Coffee (homepage) dan Checkout.
// =====================================================================
//
//  CARA EDIT (ringkas)
//  1. HARGA       -> ubah angka di tabel PRODUCTS (kolom `modal`).
//                    Angka di sana = harga MODAL sesuai PRICELIST 2026.
//                    Harga jual otomatis = modal + MARGIN (Rp20.000).
//                    Sachet TIDAK ditambah margin (harga tetap).
//  2. HARGA CORET -> atur di STRIKE_PRICE (persen per kategori / override).
//  3. PRODUK BARU -> tambah 1 baris di PRODUCTS + 1 baris di PROFILES.
//  4. GAMBAR      -> lihat src/data/productImages.js
// =====================================================================

// Keuntungan per produk (Rupiah) — ditambahkan ke semua harga pricelist, kecuali sachet
export const MARGIN = 20000

// Harga sachet (tidak kena margin)
export const SACHET_PRICE = 15000

export const categories = [
  {
    id: 'espresso-based',
    name: 'Espresso Based',
    eyebrow: 'House Blend · Espresso & Kopi Susu',
    description: 'Racikan house blend Nook untuk espresso, americano dan kopi susu — body tebal, crema cantik, rasa konsisten.',
    image: '/static/images/espresso.jpg',
  },
  {
    id: 'single-origin',
    name: 'Single Origin',
    eyebrow: 'Arabika · Nusantara',
    description: 'Arabika single origin dari dataran tinggi Nusantara — Sumatra, Jawa, Bali, Flores, Sulawesi hingga Papua.',
    image: '/static/images/sack-beans.jpg',
  },
  {
    id: 'robusta',
    name: 'Robusta',
    eyebrow: 'Robusta · Bold & Strong',
    description: 'Robusta pilihan Indonesia dengan body tebal dan cokelat pekat — cocok untuk tubruk, espresso dan kopi susu.',
    image: '/static/images/hero-beans.jpg',
  },
  {
    id: 'limited-edition',
    name: 'Limited Edition',
    eyebrow: 'Rare · Kopi Luwak Liar',
    description: 'Kopi Luwak Liar Gayo — sangat langka, sangat halus, keasaman rendah. Tersedia juga dalam Luxury Box untuk hadiah.',
    image: '/static/images/beans-macro.jpg',
  },
]

// Semua varian ukuran. Produk hanya menampilkan ukuran yang punya harga.
export const variants = [
  { id: 'sachet', label: 'Sachet', detail: 'Per sachet · min. order 5', unit: 'sachet', minQty: 5 },
  { id: '100g', label: '100g', detail: 'Whole bean / ground', unit: 'bag', minQty: 1 },
  { id: '200g', label: '200g', detail: 'Whole bean / ground', unit: 'bag', minQty: 1 },
  { id: '250g', label: '250g', detail: 'Whole bean / ground', unit: 'bag', minQty: 1 },
  { id: '1kg', label: '1 Kg', detail: 'Lebih hemat untuk café', unit: 'bag', minQty: 1 },
  { id: 'box-classic', label: 'Luxury Box', detail: 'Box hadiah eksklusif', unit: 'box', minQty: 1 },
  { id: 'box-premium', label: 'Luxury Box+', detail: 'Box hadiah premium', unit: 'box', minQty: 1 },
]

// ---------------------------------------------------------------------
//  PRODUCTS — harga MODAL sesuai PRICELIST 2026 (sebelum + MARGIN)
//  [id, kategori, { varian: hargaModal }]
// ---------------------------------------------------------------------
const PRODUCTS = [
  // ---- ESPRESSO BASED (100 gr / 250 gr / 1 KG) ----
  ['signature-blend', 'espresso-based', { '100g': 50000, '250g': 107000, '1kg': 450000 }],
  ['premium-blend', 'espresso-based', { '100g': 50000, '250g': 110000, '1kg': 420000 }],
  ['delightful-blend', 'espresso-based', { '100g': 37000, '250g': 75000, '1kg': 270000 }],
  ['blend-175', 'espresso-based', { '100g': 31000, '250g': 65000, '1kg': 230000 }],

  // ---- SINGLE ORIGIN ARABICA (100 gr / 200 gr / 1 KG) ----
  ['bali-kintamani', 'single-origin', { '100g': 55000, '200g': 100000, '1kg': 470000 }],
  ['batak-karo', 'single-origin', { '100g': 52000, '200g': 94000, '1kg': 430000 }],
  ['flores-bajawa', 'single-origin', { '100g': 50000, '200g': 90000, '1kg': 380000 }],
  ['flores-manggarai', 'single-origin', { '100g': 50000, '200g': 90000, '1kg': 399000 }],
  ['gayo-highland', 'single-origin', { '100g': 52000, '200g': 92000, '1kg': 385000 }],
  ['gayo-wine', 'single-origin', { '100g': 70000, '200g': 120000, '1kg': 520000 }],
  ['java-cikuray', 'single-origin', { '100g': 58000, '200g': 105000, '1kg': 440000 }],
  ['java-harum-manis', 'single-origin', { '100g': 65000, '200g': 120000, '1kg': 520000 }],
  ['java-ijen', 'single-origin', { '100g': 50000, '200g': 85000, '1kg': 370000 }],
  ['java-malabar', 'single-origin', { '100g': 58000, '200g': 105000, '1kg': 465000 }],
  ['java-manglayang', 'single-origin', { '100g': 55000, '200g': 100000, '1kg': 460000 }],
  ['java-papandayan', 'single-origin', { '100g': 48000, '200g': 80000, '1kg': 375000 }],
  ['java-puntang', 'single-origin', { '100g': 70000, '200g': 125000, '1kg': 520000 }],
  ['java-temanggung', 'single-origin', { '100g': 45000, '200g': 80000, '1kg': 350000 }],
  ['kerinci', 'single-origin', { '100g': 50000, '200g': 88000, '1kg': 385000 }],
  ['lintong', 'single-origin', { '100g': 50000, '200g': 88000, '1kg': 395000 }],
  ['mandailing', 'single-origin', { '100g': 50000, '200g': 88000, '1kg': 395000 }],
  ['papua-wamena', 'single-origin', { '100g': 65000, '200g': 115000, '1kg': 525000 }],
  ['sidikalang', 'single-origin', { '100g': 50000, '200g': 88000, '1kg': 375000 }],
  ['toraja-sapan', 'single-origin', { '100g': 55000, '200g': 90000, '1kg': 430000 }],

  // ---- ROBUSTA (100 gr / 250 gr / 1 KG) ----
  ['robusta-gayo', 'robusta', { '100g': 58000, '250g': 85000, '1kg': 250000 }],
  ['robusta-ijen', 'robusta', { '100g': 50000, '250g': 70000, '1kg': 240000 }],
  ['robusta-lampung', 'robusta', { '100g': 50000, '250g': 70000, '1kg': 240000 }],
  ['robusta-temanggung', 'robusta', { '100g': 50000, '250g': 70000, '1kg': 240000 }],

  // ---- LIMITED EDITION ----
  ['luwak-liar-gayo', 'limited-edition', { '100g': 190000, '1kg': 1899000 }],
  ['luwak-liar-gayo-luxury-box', 'limited-edition', { 'box-classic': 360000, 'box-premium': 610000 }],

  // ---- PRODUK KHUSUS SACHET (tidak ada di pricelist, tetap dijual) ----
  ['espresso-blend', 'espresso-based', {}],
  ['java-pamalang', 'single-origin', {}],
]

// ---------------------------------------------------------------------
//  SACHET — daftar produk yang tersedia dalam sachet (harga tetap Rp15.000)
// ---------------------------------------------------------------------
const SACHET = [
  'java-cikuray', 'java-malabar', 'java-puntang', 'gayo-wine', 'bali-kintamani', 'espresso-blend',
  'java-pamalang', 'batak-karo', 'toraja-sapan', 'java-manglayang', 'java-temanggung',
]

// ---------------------------------------------------------------------
//  HARGA CORET — harga "sebelum diskon" yang ditampilkan dicoret.
//  Rumus: hargaCoret = hargaJual + persen%, dibulatkan ke atas (roundTo).
//  - enabled   : false = matikan semua harga coret
//  - percent   : persen per kategori
//  - sachet    : persen untuk sachet (0 = tanpa harga coret)
//  - overrides : set harga coret manual, format 'idProduk:varian': harga
//                (isi 0 untuk menyembunyikan harga coret varian tsb)
// ---------------------------------------------------------------------
export const STRIKE_PRICE = {
  enabled: true,
  percent: { 'espresso-based': 20, 'single-origin': 20, robusta: 18, 'limited-edition': 15 },
  sachet: 20,
  roundTo: 5000,
  overrides: {
    // contoh: 'gayo-wine:200g': 185000,
  },
}

function strikeFor(id, category, variant, price) {
  if (!STRIKE_PRICE.enabled) return null
  const key = `${id}:${variant}`
  if (key in STRIKE_PRICE.overrides) {
    const v = STRIKE_PRICE.overrides[key]
    return v && v > price ? v : null
  }
  const pct = variant === 'sachet' ? STRIKE_PRICE.sachet : STRIKE_PRICE.percent[category] || 0
  if (!pct) return null
  const r = variant === 'sachet' ? 1000 : STRIKE_PRICE.roundTo
  return Math.ceil((price * (1 + pct / 100)) / r) * r
}

// ---------------------------------------------------------------------
//  PROFIL RASA
//  [nama, asal, roast, roastLevel(1-5), proses, ketinggian, notes, brew, deskripsi singkat, warna label, bean]
// ---------------------------------------------------------------------
const PROFILES = {
  // ---- Espresso Based ----
  'signature-blend': ['Signature Blend', 'Nook House Blend', 'Medium Dark', 4, 'Custom Blend', '1,200–1,600 masl', ['Dark Chocolate', 'Caramel', 'Hazelnut'], ['Espresso', 'Americano', 'Kopi Susu'], 'Racikan andalan Nook — dark chocolate, karamel dan hazelnut dengan body tebal.', '#80593C', 'Custom'],
  'premium-blend': ['Premium Blend', 'Arabica House Blend', 'Medium Roast', 3, 'Blend', '1,300–1,600 masl', ['Milk Chocolate', 'Brown Sugar', 'Citrus'], ['Espresso', 'Latte', 'V60'], '100% arabika — manis, seimbang, dengan sentuhan citrus yang lembut.', '#B8916A', 'Arabika'],
  'delightful-blend': ['Delightful Blend', 'Arabica + Robusta', 'Medium Dark', 4, 'Blend', '800–1,500 masl', ['Cocoa', 'Caramel', 'Nutty'], ['Espresso', 'Kopi Susu', 'Moka Pot'], 'Perpaduan arabika & robusta — crema tebal, cokelat dan karamel yang nendang.', '#9C7652', 'Arabika + Robusta'],
  'blend-175': ['Blend 175', 'Robusta · Kopi Susu', 'Dark Roast', 5, 'Blend', '500–900 masl', ['Dark Cocoa', 'Palm Sugar', 'Bold'], ['Kopi Susu', 'Espresso', 'Tubruk'], 'Robusta blend khusus kopi susu — tetap kuat walau dicampur susu & gula aren.', '#7E5B3E', 'Robusta'],
  'espresso-blend': ['Espresso Blend', 'Nusantara Blend', 'Medium Dark', 4, 'Blend', '1,200–1,600 masl', ['Dark Chocolate', 'Caramel', 'Nutty'], ['Espresso', 'Moka Pot', 'Kopi Susu'], 'Arabika blend seimbang dengan dark chocolate, karamel dan nutty finish.', '#80593C', 'Arabika'],

  // ---- Single Origin (Arabika) ----
  'bali-kintamani': ['Bali Kintamani', 'Kintamani, Bali', 'Light Medium', 2, 'Natural', '1,200–1,500 masl', ['Orange', 'Floral', 'Brown Sugar'], ['V60', 'Chemex', 'Cold Brew'], 'Ringan dan juicy dengan citrus jeruk, floral lembut dan gula aren.', '#D8C3A0'],
  'batak-karo': ['Batak Karo', 'Karo, North Sumatra', 'Medium Dark', 4, 'Washed', '1,200–1,500 masl', ['Spice', 'Dark Chocolate', 'Earthy'], ['French Press', 'Tubruk', 'Moka Pot'], 'Body penuh dengan rempah hangat, dark chocolate dan earthy yang dalam.', '#8F6A4C'],
  'flores-bajawa': ['Flores Bajawa', 'Bajawa, Flores (NTT)', 'Medium Roast', 3, 'Washed', '1,200–1,500 masl', ['Vanilla', 'Cocoa', 'Tobacco'], ['Aeropress', 'Moka Pot', 'French Press'], 'Manis vanilla dan cokelat dengan sentuhan tobacco yang lembut.', '#B8916A'],
  'flores-manggarai': ['Flores Manggarai', 'Manggarai, Flores (NTT)', 'Medium Roast', 3, 'Washed', '1,200–1,500 masl', ['Floral', 'Caramel', 'Spice'], ['V60', 'Aeropress', 'French Press'], 'Manis dan seimbang dengan floral, karamel dan sedikit rempah.', '#C9A77C'],
  'gayo-highland': ['Gayo Highland', 'Aceh, Sumatra', 'Medium Roast', 3, 'Washed', '1,300–1,600 masl', ['Chocolate', 'Caramel', 'Citrus'], ['Pour Over', 'French Press', 'Aeropress'], 'Body cokelat yang smooth, citrus cerah dan karamel yang tertinggal lama.', '#C9A77C'],
  'gayo-wine': ['Gayo Wine', 'Aceh, Sumatra', 'Medium Roast', 3, 'Winey', '1,400–1,600 masl', ['Wine', 'Dark Berry', 'Fermented Fruit'], ['V60', 'Aeropress', 'Cold Brew'], 'Karakter winey yang tegas, manis dark berry dan aftertaste fermentasi.', '#9C6B5A'],
  'java-cikuray': ['Java Cikuray', 'Garut, West Java', 'Medium Light', 2, 'Natural', '1,300–1,500 masl', ['Floral', 'Lemon', 'Brown Sugar'], ['V60', 'Kalita Wave', 'Cold Brew'], 'Cerah dan clean dengan aroma floral, asam lemon dan manis gula aren.', '#D4BC95'],
  'java-harum-manis': ['Java Harum Manis', 'West Java', 'Light Medium', 2, 'Natural', '1,300–1,600 masl', ['Mango', 'Honey', 'Floral'], ['V60', 'Chemex', 'Aeropress'], 'Sesuai namanya — harum dan manis, dengan notes mangga, madu dan floral.', '#D8C3A0'],
  'java-ijen': ['Java Ijen', 'Ijen Plateau, East Java', 'Light Medium', 2, 'Washed', '1,400–1,600 masl', ['Green Apple', 'Honey', 'Herbal'], ['V60', 'Kalita Wave', 'Cold Brew'], 'Clean dan cerah dengan apel hijau, madu dan sentuhan herbal.', '#CDB48C'],
  'java-malabar': ['Java Malabar', 'Bandung, West Java', 'Medium Roast', 3, 'Natural', '1,400–1,600 masl', ['Chocolate', 'Caramel', 'Spice'], ['French Press', 'V60', 'Aeropress'], 'Cokelat dan karamel yang kaya dengan finish rempah yang hangat.', '#B8916A'],
  'java-manglayang': ['Java Manglayang', 'Sumedang, West Java', 'Medium Roast', 3, 'Natural', '1,300–1,500 masl', ['Citrus', 'Caramel', 'Tea-like'], ['V60', 'Aeropress', 'Cold Brew'], 'Cup yang clean seperti teh dengan citrus lembut dan manis karamel.', '#CDB48C'],
  'java-papandayan': ['Java Papandayan', 'Garut, West Java', 'Medium Light', 2, 'Washed', '1,300–1,600 masl', ['Lemon', 'Caramel', 'Floral'], ['V60', 'Chemex', 'Cold Brew'], 'Kopi vulkanik Garut dengan lemon yang cerah, karamel dan floral.', '#D8C3A0'],
  'java-puntang': ['Java Puntang', 'Bandung, West Java', 'Light Medium', 2, 'Natural', '1,300–1,600 masl', ['Fruity', 'Jasmine', 'Honey'], ['V60', 'Chemex', 'Aeropress'], 'Juicy dan wangi dengan buah matang, melati dan madu.', '#D8C3A0'],
  'java-temanggung': ['Java Temanggung', 'Temanggung, Central Java', 'Medium Roast', 3, 'Washed', '1,000–1,400 masl', ['Cocoa', 'Tobacco', 'Palm Sugar'], ['Tubruk', 'French Press', 'Moka Pot'], 'Cokelat dan gula aren dengan sentuhan tobacco yang halus.', '#B48B62'],
  'java-pamalang': ['Java Pamalang', 'Pemalang, Central Java', 'Medium Roast', 3, 'Full-washed', '1,000–1,400 masl', ['Herbal', 'Palm Sugar', 'Nutty'], ['Tubruk', 'French Press', 'V60'], 'Smooth dan manis dengan herbal, gula aren dan kacang sangrai.', '#C2A07B'],
  kerinci: ['Kerinci', 'Kerinci, Jambi', 'Medium Roast', 3, 'Washed', '1,400–1,700 masl', ['Fruity', 'Brown Sugar', 'Lime'], ['V60', 'Aeropress', 'Chemex'], 'Fruity dan manis dari Gunung Kerinci dengan gula aren dan jeruk nipis.', '#D4BC95'],
  lintong: ['Lintong', 'Humbang Hasundutan, North Sumatra', 'Medium Dark', 4, 'Washed', '1,200–1,500 masl', ['Herbal', 'Cedar', 'Dark Chocolate'], ['French Press', 'Tubruk', 'V60'], 'Body syrupy dengan herbal, cedar dan dark chocolate.', '#9C7652'],
  mandailing: ['Mandailing', 'Mandailing Natal, North Sumatra', 'Dark Roast', 5, 'Washed', '1,100–1,400 masl', ['Earthy', 'Cedar', 'Molasses'], ['Tubruk', 'French Press', 'Moka Pot'], 'Bold, earthy dan syrupy dengan notes cedar dan molasses.', '#8F6A4C'],
  'papua-wamena': ['Papua Wamena', 'Wamena, Papua', 'Medium Roast', 3, 'Washed', '1,500–1,800 masl', ['Berry', 'Milk Chocolate', 'Creamy'], ['Pour Over', 'Aeropress', 'Chemex'], 'Kopi dataran tinggi yang langka — creamy, manis dan fruity.', '#C2A07B'],
  sidikalang: ['Sidikalang', 'Dairi, North Sumatra', 'Medium Dark', 4, 'Washed', '1,000–1,400 masl', ['Dark Chocolate', 'Earthy', 'Spice'], ['Tubruk', 'French Press', 'Moka Pot'], 'Body berat dengan dark chocolate, earthy dan rempah hangat.', '#8F6A4C'],
  'toraja-sapan': ['Toraja Sapan', 'Toraja, South Sulawesi', 'Medium Dark', 4, 'Washed', '1,500–1,800 masl', ['Dark Chocolate', 'Spice', 'Nutty'], ['French Press', 'V60', 'Tubruk'], 'Dark chocolate yang dalam dan rempah hangat dengan finish nutty.', '#A88463'],

  // ---- Robusta ----
  'robusta-gayo': ['Robusta Gayo', 'Aceh, Sumatra', 'Medium Dark', 4, 'Natural', '600–1,000 masl', ['Cocoa', 'Caramel', 'Earthy'], ['Espresso', 'Moka Pot', 'Kopi Susu'], 'Robusta dataran tinggi yang smooth dengan cokelat, karamel dan earthy.', '#8F6A4C'],
  'robusta-ijen': ['Robusta Ijen', 'Ijen, East Java', 'Medium Dark', 4, 'Natural', '600–900 masl', ['Nutty', 'Brown Sugar', 'Woody'], ['Tubruk', 'Espresso', 'French Press'], 'Robusta nutty dan manis dengan gula aren dan woody yang dalam.', '#9C7652'],
  'robusta-lampung': ['Robusta Lampung', 'Lampung, Sumatra', 'Dark Roast', 5, 'Natural', '400–800 masl', ['Dark Cocoa', 'Roasted Nut', 'Bold'], ['Tubruk', 'Espresso', 'Kopi Susu'], 'Robusta klasik Indonesia — dark cocoa dan kacang sangrai yang bold.', '#7E5B3E'],
  'robusta-temanggung': ['Robusta Temanggung', 'Temanggung, Central Java', 'Dark Roast', 5, 'Natural', '500–900 masl', ['Dark Chocolate', 'Tobacco', 'Spice'], ['Tubruk', 'Kopi Susu', 'Moka Pot'], 'Robusta intens dengan dark chocolate, tobacco dan rempah hangat.', '#7E5B3E'],

  // ---- Limited Edition ----
  'luwak-liar-gayo': ['Luwak Liar Gayo', 'Aceh, Sumatra', 'Medium Roast', 3, 'Washed · Wild Civet', '1,300–1,600 masl', ['Honey', 'Cocoa', 'Silky'], ['V60', 'French Press', 'Tubruk'], 'Kopi luwak liar asli Gayo — body silky, keasaman sangat rendah, finish madu & cokelat.', '#B08A5E'],
  'luwak-liar-gayo-luxury-box': ['Luwak Liar Gayo Luxury Box', 'Aceh, Sumatra', 'Medium Roast', 3, 'Washed · Wild Civet', '1,300–1,600 masl', ['Honey', 'Cocoa', 'Silky'], ['V60', 'French Press', 'Gift'], 'Kopi luwak liar Gayo dalam kemasan Luxury Box — hadiah istimewa untuk orang tersayang.', '#C9A77C'],
}

const BEAN = { 'espresso-based': 'Blend', 'single-origin': 'Arabika', robusta: 'Robusta', 'limited-edition': 'Arabika' }

// Produk unggulan di homepage & label Best Seller
const FEATURED = ['gayo-highland', 'signature-blend', 'luwak-liar-gayo']
const BEST_SELLER = ['gayo-highland', 'java-cikuray', 'signature-blend', 'luwak-liar-gayo', 'robusta-gayo', 'toraja-sapan']

// ---------------------------------------------------------------------
//  Build katalog (tidak perlu diubah)
// ---------------------------------------------------------------------
function buildCatalog() {
  return PRODUCTS.map(([id, category, modal]) => {
    const p = PROFILES[id]
    if (!p) throw new Error(`Missing profile for ${id}`)
    const [name, origin, roast, roastLevel, process, altitude, notes, brew, short, label, beanOverride] = p
    const bean = beanOverride || BEAN[category]

    const raw = {}
    if (SACHET.includes(id)) raw.sachet = SACHET_PRICE
    Object.entries(modal).forEach(([v, price]) => (raw[v] = price + MARGIN))

    // urutkan sesuai urutan varian
    const prices = Object.fromEntries(variants.filter((v) => raw[v.id] != null).map((v) => [v.id, raw[v.id]]))
    const compare = Object.fromEntries(
      Object.entries(prices)
        .map(([v, price]) => [v, strikeFor(id, category, v, price)])
        .filter(([, c]) => c)
    )

    return {
      id,
      category,
      name,
      origin,
      bean,
      short,
      description: `${short} Ditanam di ${origin} pada ketinggian ${altitude} dengan proses ${process.toLowerCase()}, kopi ${bean.toLowerCase()} ini di-roast ${roast.toLowerCase()} untuk menonjolkan notes ${notes.join(', ').toLowerCase()}. Di-roast fresh setiap pesanan oleh Nook.`,
      roast,
      roastLevel,
      notes,
      process,
      altitude,
      varietal: bean,
      brew,
      prices,
      compare,
      label,
      featured: FEATURED.includes(id),
      bestSeller: BEST_SELLER.includes(id),
    }
  }).sort((a, b) => {
    const order = categories.map((c) => c.id)
    return order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name)
  })
}

export const catalog = buildCatalog()

export const getCategory = (id) => categories.find((c) => c.id === id)
export const getProduct = (id) => catalog.find((p) => p.id === id)
export const getVariant = (id) => variants.find((v) => v.id === id)
export const minPrice = (p) => Math.min(...Object.values(p.prices))
export const minQtyFor = (variantId) => getVariant(variantId)?.minQty || 1

// Harga coret (null jika tidak ada) & persen diskon
export const comparePrice = (p, variantId) => p?.compare?.[variantId] || null
export const discountPercent = (p, variantId) => {
  const c = comparePrice(p, variantId)
  const price = p?.prices?.[variantId]
  return c && price ? Math.round(((c - price) / c) * 100) : 0
}
export const maxDiscount = (p) => Math.max(0, ...Object.keys(p.prices).map((v) => discountPercent(p, v)))

// Ukuran yang benar-benar dijual untuk produk
export const availableVariants = (p) => variants.filter((v) => p.prices[v.id] != null)

// Pilih ukuran default: yang diminta jika tersedia, jika tidak pakai urutan ini
const PREFERRED_ORDER = ['250g', '200g', '100g', '1kg', 'box-classic', 'box-premium', 'sachet']
export const defaultVariantFor = (p, preferred) => {
  if (!p) return preferred || '100g'
  if (preferred && p.prices[preferred] != null) return preferred
  return PREFERRED_ORDER.find((id) => p.prices[id] != null)
}
