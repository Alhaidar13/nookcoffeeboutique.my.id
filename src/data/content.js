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
