import { catalog } from './catalog.js'

export const brand = {
  name: 'Nook',
  tagline: 'Coffee Boutique',
  description:
    'A specialty coffee boutique celebrating the finest Indonesian origins — thoughtfully sourced, carefully roasted, and delivered fresh to your brew bar.',
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#/coffee' },
  { label: 'About', href: '#brand-intro' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#site-footer' },
]

// Featured products on the homepage are derived from the catalogue (250g bag)
export const products = catalog
  .filter((p) => p.featured)
  .map((p) => ({ ...p, weight: '250g', price: p.prices['250g'] }))

export const features = [
  {
    icon: 'bean',
    title: 'Carefully Selected Beans',
    description: 'Only selected coffee beans with attention to origin and quality.',
  },
  {
    icon: 'flame',
    title: 'Quality Roasting',
    description: 'Roasted with care to highlight the unique characteristics of every bean.',
  },
  {
    icon: 'cup',
    title: 'Fresh Coffee Experience',
    description: 'Coffee beans prepared to deliver an enjoyable and memorable brewing experience.',
  },
]

export const formatRupiah = (value) => 'Rp' + value.toLocaleString('id-ID')

export const testimonials = [
  { name: 'Rina Kartika', role: 'Home Brewer, Jakarta', rating: 5, quote: 'Aceh Gayo-nya juara! Aromanya wangi banget dan rasanya clean. Sekarang jadi langganan tiap bulan.' },
  { name: 'Dimas Pratama', role: 'Barista, Bandung', rating: 5, quote: 'Roast profile-nya konsisten dan biji kopinya fresh. Cocok banget buat manual brew maupun espresso.' },
  { name: 'Sarah Wijaya', role: 'Coffee Lover, Bekasi', rating: 5, quote: 'Packaging premium, pengiriman cepat, dan kopinya benar-benar specialty grade. Highly recommended!' },
  { name: 'Andi Saputra', role: 'Café Owner, Depok', rating: 5, quote: 'Kami pakai Nook untuk house blend di café. Pelanggan suka, rasanya balance dan body-nya mantap.' },
  { name: 'Maya Lestari', role: 'Office Worker, Jakarta', rating: 4, quote: 'Kopi sachet-nya praktis buat di kantor tapi rasanya tetap premium. Toraja favorit saya!' },
  { name: 'Budi Hartono', role: 'Coffee Enthusiast, Tangerang', rating: 5, quote: 'Kopi Luwak-nya smooth sekali, tidak asam. Worth every rupiah untuk pengalaman ngopi spesial.' },
  { name: 'Nadia Putri', role: 'Food Blogger, Jakarta', rating: 5, quote: 'Kintamani dengan notes citrus yang segar — cantik banget buat V60. Pelayanan admin juga ramah.' },
  { name: 'Fajar Nugroho', role: 'Home Barista, Bogor', rating: 5, quote: 'Dari roasting sampai tiba di rumah cuma beberapa hari. Kesegarannya terasa dari crema-nya.' },
]

export const contact = {
  address:
    'Jl. Bali Raya No. 49, Kelurahan Makasar, Kecamatan Cipinang Melayu, Jakarta Timur, DKI Jakarta, Indonesia.',
  phones: [
    { display: '+62 877-9789-0306', wa: '6287797890306' },
    { display: '+62 857-7219-6163', wa: '6285772196163' },
  ],
  instagram: { handle: '@nook.coffeeboutique', url: 'https://www.instagram.com/nook.coffeeboutique/' },
}

// Payment configuration (used by the checkout page)
export const payment = {
  whatsapp: '6287797890306',
  whatsappDisplay: '+62 877-9789-0306',
  methods: {
    gopay: {
      id: 'gopay',
      name: 'GoPay Merchant (QRIS)',
      short: 'GoPay Merchant',
      merchant: 'MUHAMMAD FIKRI AL HAIDAR',
      nmid: 'ID1026501174977',
      qr: '/static/images/qris-gopay.png',
      description: 'Scan QRIS dari GoPay, OVO, DANA, ShopeePay, LinkAja atau m-banking apa pun.',
      steps: [
        'Klik tombol "Bayar Sekarang" untuk menampilkan kode QRIS.',
        'Buka aplikasi GoPay / e-wallet / m-banking yang mendukung QRIS.',
        'Pilih menu "Bayar" atau "Scan QR", lalu arahkan kamera ke kode QRIS (atau unduh QR lalu unggah dari galeri).',
        'Pastikan nama merchant "MUHAMMAD FIKRI AL HAIDAR" dan masukkan nominal sesuai total pembayaran.',
        'Konfirmasi dengan PIN, lalu simpan bukti transfer.',
        'Klik "Saya Sudah Bayar" untuk mendapatkan struk pesanan.',
      ],
    },
    bsi: {
      id: 'bsi',
      name: 'Virtual Account BSI',
      short: 'VA BSI',
      bank: 'Bank Syariah Indonesia (BSI)',
      account: '7268050897',
      description: 'Transfer melalui BSI Mobile, ATM, internet banking, atau bank lain.',
      steps: [
        'Klik tombol "Bayar Sekarang" untuk menampilkan nomor rekening BSI.',
        'BSI Mobile: pilih menu "Transfer" › "Transfer Antar Rekening BSI", masukkan nomor 7268050897.',
        'ATM BSI: pilih "Menu Lainnya" › "Transfer" › "Rekening BSI", masukkan nomor 7268050897.',
        'Dari bank lain: pilih "Transfer Antar Bank", pilih Bank Syariah Indonesia (kode 451), masukkan nomor 7268050897.',
        'Masukkan nominal tepat sesuai total pembayaran, periksa nama penerima, lalu konfirmasi.',
        'Simpan bukti transfer dan klik "Saya Sudah Bayar" untuk mendapatkan struk pesanan.',
      ],
    },
  },
}
