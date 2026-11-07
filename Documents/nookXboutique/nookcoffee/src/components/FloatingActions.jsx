import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { contact } from '../data/content.js'

// Tombol WhatsApp mengambang + tombol kembali ke atas.
// `raised` = naikkan posisi (mis. saat ada bar "Add to Bag" di bawah layar HP)
export default function FloatingActions({ hideOnMobile = false }) {
  const [showTop, setShowTop] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // tampilkan gelembung sapaan sebentar
    const t1 = setTimeout(() => setHint(true), 4000)
    const t2 = setTimeout(() => setHint(false), 11000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const wa = contact.phones[0]
  const msg = encodeURIComponent('Halo Nook Coffee, saya ingin bertanya tentang produk kopi.')

  return (
    <div
      id="floating-actions"
      className={`fixed bottom-5 right-4 z-40 flex-col items-end gap-3 sm:bottom-6 sm:right-6 ${hideOnMobile ? 'hidden lg:flex' : 'flex'}`}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fab flex h-11 w-11 items-center justify-center rounded-full bg-white text-coffee shadow-lg ring-1 ring-coffee/10 hover:bg-coffee hover:text-cream ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="Kembali ke atas"
      >
        <Icon name="arrow" className="h-5 w-5 -rotate-90" />
      </button>

      <div className="relative flex items-center">
        <span
          className={`absolute right-[4.25rem] hidden whitespace-nowrap sm:block rounded-2xl bg-white px-4 py-2.5 text-xs font-medium text-coffee shadow-lg ring-1 ring-coffee/10 transition-all duration-500 ${
            hint ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-3 opacity-0'
          }`}
        >
          Butuh rekomendasi kopi? Chat kami 👋
        </span>
        <a
          href={`https://wa.me/${wa.wa}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-110 active:scale-95"
          aria-label="Chat WhatsApp"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <Icon name="whatsapp" className="relative h-7 w-7" />
        </a>
      </div>
    </div>
  )
}
