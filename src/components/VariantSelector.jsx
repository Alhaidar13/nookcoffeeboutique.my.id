import { variants } from '../data/catalog.js'
import { formatRupiah } from '../data/content.js'

// size = 'sm'  -> compact segmented pills (used on cards & toolbar)
// size = 'lg'  -> detailed option cards with price (used on Product Detail)
export default function VariantSelector({ value, onChange, prices, size = 'sm', label = 'Select size', className = '' }) {
  if (size === 'lg') {
    return (
      <fieldset className={`variant-selector ${className}`}>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-coffee/60">{label}</legend>
        <div className="grid grid-cols-3 gap-3">
          {variants.map((v) => {
            const active = value === v.id
            return (
              <label
                key={v.id}
                className={`variant-option relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-coffee focus-within:ring-offset-2 ${
                  active
                    ? 'border-coffee bg-coffee text-cream shadow-[0_18px_40px_-22px_rgba(59,36,24,0.7)]'
                    : 'border-coffee/15 bg-white text-coffee hover:border-coffee/40'
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={active}
                  onChange={() => onChange(v.id)}
                  className="sr-only"
                />
                <span className="font-heading text-base font-semibold sm:text-lg">{v.label}</span>
                <span className={`mt-0.5 text-[0.7rem] leading-snug ${active ? 'text-cream/70' : 'text-coffee/55'}`}>
                  {v.detail}
                </span>
                {prices && (
                  <span className={`mt-3 text-sm font-medium ${active ? 'text-cream' : 'text-coffee'}`}>
                    {formatRupiah(prices[v.id])}
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
      {variants.map((v) => {
        const active = value === v.id
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee ${
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
