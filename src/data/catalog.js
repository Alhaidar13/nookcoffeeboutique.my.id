// Product catalogue — single source of truth for the All Coffee page,
// Product Detail page and the featured section on the homepage.
//
// HOW TO EDIT
// - Prices live in PRICES (per category & size).
// - Which origin is available in which size lives in AVAILABILITY.
//   Just add / remove a product id from a list.
// - Tasting info per origin lives in PROFILES.

export const categories = [
  {
    id: 'khas-nusantara',
    name: 'Khas Nusantara',
    eyebrow: 'Arabika · Single Origin',
    description: 'Single-origin arabica from the highlands of the Indonesian archipelago — available in sachet, 150g and 250g.',
    image: '/static/images/sack-beans.jpg',
  },
  {
    id: 'kopi-luwak',
    name: 'Kopi Luwak',
    eyebrow: 'Robusta · Rare & Exclusive',
    description: 'Ethically sourced civet coffee — exceptionally smooth with very low acidity. Available in 100g.',
    image: '/static/images/beans-macro.jpg',
  },
  {
    id: 'robusta',
    name: 'Robusta',
    eyebrow: 'Robusta · Bold & Strong',
    description: 'Full-bodied Indonesian robusta with bold cocoa notes and thick crema — perfect for tubruk, espresso and kopi susu. Available in 250g.',
    image: '/static/images/espresso.jpg',
  },
]

// All size variants used in the shop. A product only shows the sizes it has a price for.
export const variants = [
  { id: 'sachet', label: 'Sachet', detail: 'Per sachet · min. order 5', short: 'Sachet', unit: 'sachet', minQty: 5 },
  { id: '100g', label: '100g', detail: 'Whole bean / ground', short: '100 gram', unit: 'bag', minQty: 1 },
  { id: '150g', label: '150g', detail: 'Whole bean / ground', short: '150 gram', unit: 'bag', minQty: 1 },
  { id: '250g', label: '250g', detail: 'Whole bean / ground', short: '250 gram', unit: 'bag', minQty: 1 },
]

// ---------------- Prices (Rupiah) ----------------
const PRICES = {
  'khas-nusantara': { sachet: 15000, '150g': 65000, '250g': 85000 },
  'kopi-luwak': { '100g': 215000 },
  robusta: { '250g': 105000 },
}

// ---------------- Availability per size ----------------
const AVAILABILITY = {
  'khas-nusantara': {
    sachet: [
      'java-cikuray', 'java-malabar', 'java-puntang', 'gayo-wine', 'bali-kintamani', 'espresso-blend',
      'java-pamalang', 'batak-karo', 'toraja-sapan', 'java-manglayang', 'java-temanggung',
    ],
    '150g': [
      'flores-bajawa', 'batak-karo', 'lintong', 'dampit', 'mandailing', 'papua', 'java-malabar', 'toraja-sapan',
      'gayo-highland', 'flores-manggarai', 'java-temanggung', 'java-ijen', 'kerinci', 'java-papandayan', 'java-cikuray',
    ],
    '250g': [
      'flores-bajawa', 'sidikalang', 'bali-kintamani', 'java-temanggung', 'toraja-sapan', 'java-cikuray', 'kerinci',
      'dampit', 'java-papandayan', 'java-malabar', 'lintong', 'gayo-highland',
    ],
  },
  'kopi-luwak': {
    '100g': ['luwak-gayo-highland'],
  },
  robusta: {
    '250g': ['robusta-lampung', 'robusta-gayo', 'robusta-ijen', 'robusta-temanggung'],
  },
}

// ---------------- Tasting profiles ----------------
// [name, origin, roast, roastLevel(1-5), process, altitude, notes, brew, short, label colour]
const PROFILES = {
  // ---- Khas Nusantara (Arabika) ----
  'java-cikuray': ['Java Cikuray', 'Garut, West Java', 'Medium Light', 2, 'Full-washed', '1,300–1,500 masl', ['Floral', 'Lemon', 'Brown Sugar'], ['V60', 'Kalita Wave', 'Cold Brew'], 'Bright and clean with floral aroma, lemon acidity and brown-sugar sweetness.', '#D4BC95'],
  'java-malabar': ['Java Malabar', 'Bandung, West Java', 'Medium Roast', 3, 'Natural', '1,400–1,600 masl', ['Chocolate', 'Caramel', 'Spice'], ['French Press', 'V60', 'Aeropress'], 'Rich chocolate and caramel with a warm, gently spiced finish.', '#B8916A'],
  'java-puntang': ['Java Puntang', 'Bandung, West Java', 'Light Medium', 2, 'Honey', '1,300–1,600 masl', ['Fruity', 'Jasmine', 'Honey'], ['V60', 'Chemex', 'Aeropress'], 'Juicy and fragrant with ripe fruit, jasmine florals and honey.', '#D8C3A0'],
  'gayo-wine': ['Gayo Wine', 'Aceh, Sumatra', 'Medium Roast', 3, 'Natural Wine', '1,400–1,600 masl', ['Wine', 'Dark Berry', 'Fermented Fruit'], ['V60', 'Aeropress', 'Cold Brew'], 'Bold winey character with dark berry sweetness and a boozy finish.', '#9C6B5A'],
  'bali-kintamani': ['Bali Kintamani', 'Kintamani, Bali', 'Light Medium', 2, 'Natural', '1,200–1,500 masl', ['Orange', 'Floral', 'Brown Sugar'], ['V60', 'Chemex', 'Cold Brew'], 'Light and juicy with orange zest, delicate florals and brown sugar.', '#D8C3A0'],
  'espresso-blend': ['Espresso Blend', 'Nusantara Blend', 'Medium Dark', 4, 'Blend', '1,200–1,600 masl', ['Dark Chocolate', 'Caramel', 'Nutty'], ['Espresso', 'Moka Pot', 'Kopi Susu'], 'Balanced arabica blend with dark chocolate, caramel and a nutty finish.', '#80593C'],
  'java-pamalang': ['Java Pamalang', 'Pemalang, Central Java', 'Medium Roast', 3, 'Full-washed', '1,000–1,400 masl', ['Herbal', 'Palm Sugar', 'Nutty'], ['Tubruk', 'French Press', 'V60'], 'Smooth and sweet with herbal hints, palm sugar and roasted nuts.', '#C2A07B'],
  'batak-karo': ['Batak Karo', 'Karo, North Sumatra', 'Medium Dark', 4, 'Wet-hulled', '1,200–1,500 masl', ['Spice', 'Dark Chocolate', 'Earthy'], ['French Press', 'Tubruk', 'Moka Pot'], 'Full body with warm spice, dark chocolate and an earthy depth.', '#8F6A4C'],
  'toraja-sapan': ['Toraja Sapan', 'Toraja, South Sulawesi', 'Medium Dark', 4, 'Full-washed', '1,500–1,800 masl', ['Dark Chocolate', 'Spice', 'Nutty'], ['French Press', 'V60', 'Tubruk'], 'Deep dark chocolate and warm spice with a nutty, earthy finish.', '#A88463'],
  'java-manglayang': ['Java Manglayang', 'Sumedang, West Java', 'Medium Roast', 3, 'Full-washed', '1,300–1,500 masl', ['Citrus', 'Caramel', 'Tea-like'], ['V60', 'Aeropress', 'Cold Brew'], 'Clean, tea-like cup with soft citrus and caramel sweetness.', '#CDB48C'],
  'java-temanggung': ['Java Temanggung', 'Temanggung, Central Java', 'Medium Roast', 3, 'Full-washed', '1,000–1,400 masl', ['Cocoa', 'Tobacco', 'Palm Sugar'], ['Tubruk', 'French Press', 'Moka Pot'], 'Cocoa and palm sugar sweetness with a subtle tobacco note.', '#B48B62'],
  'flores-bajawa': ['Flores Bajawa', 'Bajawa, Flores (NTT)', 'Medium Roast', 3, 'Full-washed', '1,200–1,500 masl', ['Vanilla', 'Cocoa', 'Tobacco'], ['Aeropress', 'Moka Pot', 'French Press'], 'Sweet vanilla and cocoa with a gentle tobacco-like depth.', '#B8916A'],
  lintong: ['Lintong', 'Humbang Hasundutan, North Sumatra', 'Medium Dark', 4, 'Wet-hulled', '1,200–1,500 masl', ['Herbal', 'Cedar', 'Dark Chocolate'], ['French Press', 'Tubruk', 'V60'], 'Syrupy body with herbal, cedar and dark-chocolate notes.', '#9C7652'],
  dampit: ['Dampit', 'Malang, East Java', 'Medium Roast', 3, 'Natural', '1,000–1,200 masl', ['Cocoa', 'Caramel', 'Nutty'], ['Tubruk', 'Moka Pot', 'French Press'], 'Comforting cup of cocoa, caramel and roasted nuts.', '#B08A5E'],
  mandailing: ['Mandailing', 'Mandailing Natal, North Sumatra', 'Dark Roast', 5, 'Wet-hulled', '1,100–1,400 masl', ['Earthy', 'Cedar', 'Molasses'], ['Tubruk', 'French Press', 'Moka Pot'], 'Bold, earthy and syrupy with notes of cedar and molasses.', '#8F6A4C'],
  papua: ['Papua', 'Wamena, Papua', 'Medium Roast', 3, 'Full-washed', '1,500–1,800 masl', ['Berry', 'Milk Chocolate', 'Creamy'], ['Pour Over', 'Aeropress', 'Chemex'], 'Rare highland coffee — creamy, sweet and delicately fruity.', '#C2A07B'],
  'gayo-highland': ['Gayo Highland', 'Aceh, Sumatra', 'Medium Roast', 3, 'Semi-washed', '1,300–1,600 masl', ['Chocolate', 'Caramel', 'Citrus'], ['Pour Over', 'French Press', 'Aeropress'], 'Smooth chocolate body with bright citrus and lingering caramel.', '#C9A77C'],
  'flores-manggarai': ['Flores Manggarai', 'Manggarai, Flores (NTT)', 'Medium Roast', 3, 'Full-washed', '1,200–1,500 masl', ['Floral', 'Caramel', 'Spice'], ['V60', 'Aeropress', 'French Press'], 'Sweet and balanced with florals, caramel and a hint of spice.', '#C9A77C'],
  'java-ijen': ['Java Ijen', 'Ijen Plateau, East Java', 'Light Medium', 2, 'Full-washed', '1,400–1,600 masl', ['Green Apple', 'Honey', 'Herbal'], ['V60', 'Kalita Wave', 'Cold Brew'], 'Clean and bright with green apple, honey and a herbal touch.', '#CDB48C'],
  kerinci: ['Kerinci', 'Kerinci, Jambi', 'Medium Roast', 3, 'Honey', '1,400–1,700 masl', ['Fruity', 'Brown Sugar', 'Lime'], ['V60', 'Aeropress', 'Chemex'], 'Fruity and sweet from Mount Kerinci with brown sugar and lime.', '#D4BC95'],
  'java-papandayan': ['Java Papandayan', 'Garut, West Java', 'Medium Light', 2, 'Full-washed', '1,300–1,600 masl', ['Lemon', 'Caramel', 'Floral'], ['V60', 'Chemex', 'Cold Brew'], 'Volcanic-grown Java with lemon brightness, caramel and florals.', '#D8C3A0'],
  sidikalang: ['Sidikalang', 'Dairi, North Sumatra', 'Medium Dark', 4, 'Wet-hulled', '1,000–1,400 masl', ['Dark Chocolate', 'Earthy', 'Spice'], ['Tubruk', 'French Press', 'Moka Pot'], 'Heavy body with dark chocolate, earthy tones and warm spice.', '#8F6A4C'],

  // ---- Kopi Luwak (Robusta) ----
  'luwak-gayo-highland': ['Luwak Gayo Highland', 'Aceh, Sumatra', 'Medium Dark', 4, 'Wild Civet', '800–1,200 masl', ['Honey', 'Cocoa', 'Silky'], ['French Press', 'Tubruk', 'Espresso'], 'Wild civet robusta — silky body, very low acidity, honeyed cocoa finish.', '#B08A5E'],

  // ---- Robusta ----
  'robusta-lampung': ['Robusta Lampung', 'Lampung, Sumatra', 'Dark Roast', 5, 'Natural', '400–800 masl', ['Dark Cocoa', 'Roasted Nut', 'Bold'], ['Tubruk', 'Espresso', 'Kopi Susu'], 'Indonesia\u2019s classic robusta — bold dark cocoa and roasted nuts.', '#7E5B3E'],
  'robusta-gayo': ['Robusta Gayo', 'Aceh, Sumatra', 'Medium Dark', 4, 'Natural', '600–1,000 masl', ['Cocoa', 'Caramel', 'Earthy'], ['Espresso', 'Moka Pot', 'Kopi Susu'], 'Smooth highland robusta with cocoa, caramel and an earthy finish.', '#8F6A4C'],
  'robusta-ijen': ['Robusta Ijen', 'Ijen, East Java', 'Medium Dark', 4, 'Natural', '600–900 masl', ['Nutty', 'Brown Sugar', 'Woody'], ['Tubruk', 'Espresso', 'French Press'], 'Nutty and sweet robusta with brown sugar and a woody depth.', '#9C7652'],
  'robusta-temanggung': ['Robusta Temanggung', 'Temanggung, Central Java', 'Dark Roast', 5, 'Natural', '500–900 masl', ['Dark Chocolate', 'Tobacco', 'Spice'], ['Tubruk', 'Kopi Susu', 'Moka Pot'], 'Intense robusta with dark chocolate, tobacco and warm spice.', '#7E5B3E'],
}

const FEATURED = ['gayo-highland', 'toraja-sapan', 'bali-kintamani']
const BEST_SELLER = ['gayo-highland', 'java-cikuray', 'luwak-gayo-highland', 'robusta-lampung']

const BEAN = { 'khas-nusantara': 'Arabika', 'kopi-luwak': 'Robusta', robusta: 'Robusta' }

// Build the product list from the tables above
function buildCatalog() {
  const list = []
  Object.entries(AVAILABILITY).forEach(([category, sizes]) => {
    const seen = new Map()
    Object.entries(sizes).forEach(([size, ids]) => {
      ids.forEach((id) => {
        if (!seen.has(id)) seen.set(id, {})
        seen.get(id)[size] = PRICES[category][size]
      })
    })
    seen.forEach((sizePrices, id) => {
      const p = PROFILES[id]
      if (!p) throw new Error(`Missing profile for ${id}`)
      const [name, origin, roast, roastLevel, process, altitude, notes, brew, short, label] = p
      const bean = BEAN[category]
      // keep prices in the canonical variant order
      const prices = Object.fromEntries(variants.filter((v) => sizePrices[v.id] != null).map((v) => [v.id, sizePrices[v.id]]))
      list.push({
        id,
        category,
        name,
        origin,
        bean,
        short,
        description: `${short} Grown in ${origin} at ${altitude} and processed ${process.toLowerCase()}, this ${bean.toLowerCase()} is roasted to a ${roast.toLowerCase()} profile to bring out notes of ${notes.join(', ').toLowerCase()}. Roasted fresh to order by Nook.`,
        roast,
        roastLevel,
        notes,
        process,
        altitude,
        varietal: bean,
        brew,
        prices,
        label,
        featured: FEATURED.includes(id),
        bestSeller: BEST_SELLER.includes(id),
      })
    })
  })
  const order = categories.map((c) => c.id)
  return list.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name))
}

export const catalog = buildCatalog()

export const getCategory = (id) => categories.find((c) => c.id === id)
export const getProduct = (id) => catalog.find((p) => p.id === id)
export const getVariant = (id) => variants.find((v) => v.id === id)
export const minPrice = (p) => Math.min(...Object.values(p.prices))
export const minQtyFor = (variantId) => getVariant(variantId)?.minQty || 1

// Sizes a product is actually sold in
export const availableVariants = (p) => variants.filter((v) => p.prices[v.id] != null)

// Pick a size for a product: the preferred one if available, else a sensible default
const PREFERRED_ORDER = ['250g', '150g', '100g', 'sachet']
export const defaultVariantFor = (p, preferred) => {
  if (!p) return preferred || '250g'
  if (preferred && p.prices[preferred] != null) return preferred
  return PREFERRED_ORDER.find((id) => p.prices[id] != null)
}
