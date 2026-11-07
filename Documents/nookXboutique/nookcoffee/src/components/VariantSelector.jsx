import { variants as allVariants } from '../data/catalog.js'
import { formatRupiah } from '../data/content.js'

// size = 'sm'  -> compact segmented pills (used on cards & toolbar)
// size = 'lg'  -> detailed option cards with price (used on Product Detail)
// options      -> list of variants to show (defaults to all sizes)
export default function VariantSelector({ value, onChange, prices, compare = {}, options, size = 'sm', label = 'Select size', className = '' }) {
  const list = options || (prices ? allVariants.filter((v) => prices[v.id] != null) : allVariants)

  if (size === 'lg') {
    const cols = { 1: 'grid-cols-1 sm:grid-cols-2', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[list.length] || 'grid-cols-2 sm:grid-cols-3'
    return (
      <fieldset className={`variant-selector ${className}`}>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-coffee/60">{label}</legend>
        <div className={`grid gap-3 ${cols}`}>
          {list.map((v) => {
            const active = value === v.id
            return (
              <label
                key={v.id}
                className={`variant-option relative flex cursor-pointer flex-col rounded-2xl border p-3 sm:p-4 transition-all active:scale-[0.97] duration-300 focus-within:ring-2 focus-within:ring-coffee focus-within:ring-offset-2 ${
                  active
                    ? 'border-coffee bg-coffee text-cream shadow-[0_18px_40px_-22px_rgba(59,36,24,0.7)]'
                    : 'border-coffee/15 bg-white text-coffee hover:border-coffee/40'
                }`}
              >
                <input type="radio" name="variant" value={v.id} checked={active} onChange={() => onChange(v.id)} className="sr-only" />
                <span className="font-heading text-[0.95rem] font-semibold sm:text-lg">{v.label}</span>
                <span className={`mt-0.5 text-[0.7rem] leading-snug ${active ? 'text-cream/70' : 'text-coffee/55'}`}>{v.detail}</span>
                {prices && (
                  <span className="mt-2.5 flex flex-col">
                    {compare[v.id] && (
                      <s className={`text-[0.68rem] ${active ? 'text-cream/55' : 'text-coffee/40'}`}>{formatRupiah(compare[v.id])}</s>
                    )}
                    <span className={`text-sm font-semibold ${active ? 'text-cream' : 'text-coffee'}`}>
                      {formatRupiah(prices[v.id])}
                      {v.id === 'sachet' && <span className={`text-xs font-normal ${active ? 'text-cream/70' : 'text-coffee/55'}`}> /sachet</span>}
                    </span>
                  </span>
                )}
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  return (
    <div role="radiogroup" aria-label={label} className={`variant-selector inline-flex rounded-full bg-beige p-1 ${className}`}>
      {list.map((v) => {
        const active = value === v.id
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee ${
              active ? 'bg-coffee text-cream shadow-sm' : 'text-coffee/65 hover:text-coffee'
            }`}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
