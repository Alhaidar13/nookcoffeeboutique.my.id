export const brand = {
  name: 'Arunika',
  tagline: 'Coffee Boutique',
  description:
    'A specialty coffee boutique celebrating the finest Indonesian origins — thoughtfully sourced, carefully roasted, and delivered fresh to your brew bar.',
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#featured-coffee' },
  { label: 'About', href: '#brand-intro' },
  { label: 'Contact', href: '#site-footer' },
]

export const products = [
  {
    id: 'aceh-gayo',
    name: 'Aceh Gayo',
    origin: 'Aceh, Indonesia',
    roast: 'Medium Roast',
    roastLevel: 3,
    notes: ['Chocolate', 'Caramel', 'Citrus'],
    price: 85000,
    weight: '200g',
    altitude: '1,400 masl',
    label: '#C9A77C',
  },
  {
    id: 'toraja-sapan',
    name: 'Toraja Sapan',
    origin: 'Toraja, Indonesia',
    roast: 'Medium Dark',
    roastLevel: 4,
    notes: ['Dark Chocolate', 'Spice', 'Nutty'],
    price: 95000,
    weight: '200g',
    altitude: '1,600 masl',
    label: '#A88463',
  },
  {
    id: 'kintamani',
    name: 'Kintamani',
    origin: 'Bali, Indonesia',
    roast: 'Light Roast',
    roastLevel: 2,
    notes: ['Citrus', 'Floral', 'Brown Sugar'],
    price: 90000,
    weight: '200g',
    altitude: '1,300 masl',
    label: '#D8C3A0',
  },
]

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
