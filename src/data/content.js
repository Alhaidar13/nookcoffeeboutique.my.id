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
