import Icon from './Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { variants } from '../data/catalog.js'

export default function Toast({ raised = false }) {
  const { toast } = useCart()
  const v = toast && variants.find((x) => x.id === toast.variant)
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 z-[60] ${raised ? 'bottom-24 lg:bottom-6' : 'bottom-6'} w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 transition-all duration-500 ease-out ${
        toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      {toast && (
        <div key={toast.at} className="flex items-center gap-4 rounded-2xl bg-coffee px-5 py-4 text-cream shadow-[0_24px_50px_-20px_rgba(59,36,24,0.8)]">
          <span className="pop-in flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-coffee">
            <Icon name="check" className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-sm leading-snug">
            <strong className="font-medium">{toast.name}</strong> ({v?.label}) × {toast.qty}
            <span className="block text-xs text-cream/65">Added to your bag</span>
            <a href="#/checkout" className="mt-1 inline-block text-xs font-semibold text-amber-200 underline underline-offset-2">Checkout sekarang →</a>
          </p>
        </div>
      )}
    </div>
  )
}
