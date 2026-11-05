import { formatRupiah } from '../data/content.js'
import { comparePrice, discountPercent } from '../data/catalog.js'

// Harga jual + harga coret + badge diskon
// size: 'sm' (kartu) | 'md' | 'lg' (detail produk)
export default function PriceTag({ product, variant, qty = 1, size = 'sm', tone = 'dark', showBadge = true, className = '' }) {
  const price = product.prices[variant]
  const compare = comparePrice(product, variant)
  const pct = discountPercent(product, variant)
  const main = { sm: 'text-base sm:text-lg', md: 'text-xl', lg: 'text-3xl sm:text-4xl' }[size]
  const strike = { sm: 'text-[0.72rem]', md: 'text-sm', lg: 'text-base' }[size]
  const light = tone === 'light'

  return (
    <span className={`price-tag inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`whitespace-nowrap font-heading font-semibold ${main} ${light ? 'text-cream' : 'text-coffee'}`}>
        {formatRupiah(price * qty)}
        {variant === 'sachet' && qty === 1 && <span className={`text-xs font-normal ${light ? 'text-cream/60' : 'text-coffee/55'}`}> /sachet</span>}
      </span>
      {compare && (
        <s className={`whitespace-nowrap ${strike} ${light ? 'text-cream/55' : 'text-coffee/45'}`} aria-label={`Harga normal ${formatRupiah(compare * qty)}`}>
          {formatRupiah(compare * qty)}
        </s>
      )}
      {compare && showBadge && (
        <span className="discount-badge whitespace-nowrap rounded-full bg-red-600 px-2 py-0.5 text-[0.62rem] font-semibold text-white">-{pct}%</span>
      )}
    </span>
  )
}
