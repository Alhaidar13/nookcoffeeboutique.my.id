// =====================================================================
//  GAMBAR PRODUK
// =====================================================================
//  Cara mengganti gambar produk:
//  1. Upload foto ke folder:  public/static/images/products/
//     (contoh: public/static/images/products/gayo-highland.jpg)
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
  // 'gayo-highland': '/static/images/products/gayo-highland.jpg',
  // 'signature-blend': '/static/images/products/signature-blend.jpg',
  // 'luwak-liar-gayo-luxury-box': '/static/images/products/luwak-box.jpg',
}

// Gambar latar per kategori (dipakai di header kategori & latar kartu)
// diatur di src/data/catalog.js -> categories[].image

export const productImage = (id, variant) => PRODUCT_IMAGES[`${id}:${variant}`] || PRODUCT_IMAGES[id] || null
