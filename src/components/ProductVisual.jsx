import CoffeeBag from './CoffeeBag.jsx'
import { productImage } from '../data/productImages.js'

// Tampilkan foto produk jika terdaftar di src/data/productImages.js,
// jika tidak, tampilkan ilustrasi kemasan kopi (SVG).
export default function ProductVisual({ product, variant, weight, className = '', imgClassName = '' }) {
  const src = productImage(product.id, variant)
  if (src) {
    return (
      <img
        src={src}
        alt={`${product.name}${weight ? ` ${weight}` : ''}`}
        loading="lazy"
        className={`relative mx-auto h-full w-full object-cover ${imgClassName}`}
      />
    )
  }
  return <CoffeeBag product={{ ...product, weight: weight || '' }} className={className} />
}
