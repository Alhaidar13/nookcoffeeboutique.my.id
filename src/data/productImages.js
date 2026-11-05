// =====================================================================
//  GAMBAR PRODUK
// =====================================================================
//  Cara mengganti gambar produk:
//  1. Upload foto ke folder:  public/static/images/products/
//     (format disarankan .webp, contoh: public/static/images/products/gayo-highland.webp)
//  2. Tambahkan baris di PRODUCT_IMAGES di bawah dengan format:
//        'id-produk': '/static/images/products/nama-file.jpg',
//  3. Simpan, lalu build/deploy ulang.
//
//  - Produk yang TIDAK terdaftar di sini otomatis memakai ilustrasi
//    kemasan kopi (SVG) dengan nama produknya.
//  - Bisa juga per-varian ukuran:  'gayo-highland:1kg': '/static/...'
//    (varian lebih diprioritaskan daripada gambar umum produk)
//  - Daftar id produk ada di src/data/catalog.js (tabel PRODUCTS),
//    contoh: signature-blend, gayo-highland, java-cikuray, robusta-gayo,
//    luwak-liar-gayo, luwak-liar-gayo-luxury-box, dst.
// =====================================================================

export const PRODUCT_IMAGES = {
  // --- Foto per ukuran (varian) ---
  'java-cikuray:100g': '/static/images/products/java-cikuray-100g.webp',
  'java-cikuray:200g': '/static/images/products/java-cikuray-200g.webp',
  'java-ijen:100g': '/static/images/products/java-ijen-100g.webp',
  'java-ijen:200g': '/static/images/products/java-ijen-200g.webp',
  'java-malabar:100g': '/static/images/products/java-malabar-100g.webp',
  'java-malabar:200g': '/static/images/products/java-malabar-200g.webp',
  'java-papandayan:100g': '/static/images/products/java-papandayan-100g.webp',
  'java-papandayan:200g': '/static/images/products/java-papandayan-200g.webp',
  'java-temanggung:100g': '/static/images/products/java-temanggung-100g.webp',
  'java-temanggung:200g': '/static/images/products/java-temanggung-200g.webp',
  'kerinci:100g': '/static/images/products/kerinci-100g.webp',
  'kerinci:200g': '/static/images/products/kerinci-200g.webp',
  'toraja-sapan:100g': '/static/images/products/toraja-sapan-100g.webp',
  'toraja-sapan:200g': '/static/images/products/toraja-sapan-200g.webp',
  'bali-kintamani:200g': '/static/images/products/bali-kintamani-200g.webp',
  'flores-bajawa:200g': '/static/images/products/flores-bajawa-200g.webp',
  'lintong:200g': '/static/images/products/lintong-200g.webp',
  'papua-wamena:200g': '/static/images/products/papua-wamena-200g.webp',
  'sidikalang:200g': '/static/images/products/sidikalang-200g.webp',
  'flores-manggarai:100g': '/static/images/products/flores-manggarai-100g.webp',
  'gayo-highland:100g': '/static/images/products/gayo-highland-100g.webp',

  // --- Foto umum produk (dipakai untuk varian lain, mis. 1kg / sachet) ---
  'java-cikuray': '/static/images/products/java-cikuray-200g.webp',
  'java-ijen': '/static/images/products/java-ijen-200g.webp',
  'java-malabar': '/static/images/products/java-malabar-200g.webp',
  'java-papandayan': '/static/images/products/java-papandayan-200g.webp',
  'java-temanggung': '/static/images/products/java-temanggung-200g.webp',
  'kerinci': '/static/images/products/kerinci-200g.webp',
  'toraja-sapan': '/static/images/products/toraja-sapan-200g.webp',
  'bali-kintamani': '/static/images/products/bali-kintamani-200g.webp',
  'flores-bajawa': '/static/images/products/flores-bajawa-200g.webp',
  'lintong': '/static/images/products/lintong-200g.webp',
  'papua-wamena': '/static/images/products/papua-wamena-200g.webp',
  'sidikalang': '/static/images/products/sidikalang-200g.webp',
  'flores-manggarai': '/static/images/products/flores-manggarai-100g.webp',
  'gayo-highland': '/static/images/products/gayo-highland-100g.webp',

  // Foto tersedia tapi produk belum ada di katalog:
  // 'robusta-dampit': '/static/images/products/dampit-200g.webp',
}

// Gambar latar per kategori (dipakai di header kategori & latar kartu)
// diatur di src/data/catalog.js -> categories[].image

export const productImage = (id, variant) => PRODUCT_IMAGES[`${id}:${variant}`] || PRODUCT_IMAGES[id] || null
