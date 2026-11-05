import { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { navLinks } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'

// Layout: grid 3 kolom [1fr | auto | 1fr]
// -> kolom kiri (logo) & kanan (ikon) selalu sama lebar,
//    sehingga menu di kolom tengah PASTI berada tepat di tengah layar.
export default function Navbar({ route = { page: 'home' } }) {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('#home')
  const [bump, setBump] = useState(false)
  const prevCount = useRef(count)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // animasi badge keranjang saat jumlah item bertambah
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 600)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  // tutup menu mobile saat pindah halaman
  useEffect(() => setOpen(false), [route.page, route.anchor])

  useEffect(() => {
    if (route.page === 'checkout') setActive('#/checkout')
    else if (route.page !== 'home') setActive('#/coffee')
    else setActive(route.anchor ? `#${route.anchor}` : '#home')
  }, [route.page, route.anchor])

  const handleClick = (href) => {
    setActive(href)
    setOpen(false)
  }

  return (
    <header
      id="site-navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream/90 shadow-[0_8px_30px_-18px_rgba(59,36,24,0.45)] backdrop-blur-md' : 'bg-cream'
      }`}
    >
      <nav
        className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-4 transition-[height] duration-500 sm:px-8 md:grid-cols-[1fr_auto_1fr] ${
          scrolled ? 'h-16' : 'h-[4.5rem] sm:h-20'
        }`}
        aria-label="Main navigation"
      >
        {/* Kiri: logo */}
        <div className="flex min-w-0 justify-start">
          <Logo />
        </div>

        {/* Tengah: menu (desktop) */}
        <ul id="nav-links" className="hidden items-center justify-center gap-1 rounded-full bg-white/50 p-1 ring-1 ring-coffee/5 md:flex lg:gap-2">
          {navLinks.map((link) => {
            const isActive = active === link.href
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`nav-link relative block rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 lg:px-5 ${
                    isActive ? 'bg-coffee text-cream shadow-sm' : 'text-coffee/70 hover:bg-coffee/5 hover:text-coffee'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Kanan: keranjang + hamburger */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <a
            href="#/checkout"
            className={`relative flex h-11 w-11 items-center justify-center rounded-full text-coffee transition-colors duration-300 hover:bg-coffee hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee ${
              bump ? 'cart-bump' : ''
            }`}
            aria-label={`Shopping bag & checkout, ${count} items`}
            title="Bag & Checkout"
          >
            <Icon name="bag" className="h-[22px] w-[22px]" />
            <span
              className={`absolute right-1 top-1 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 text-[0.6rem] font-semibold ring-2 ring-cream transition-colors ${
                count > 0 ? 'bg-red-600 text-white' : 'bg-coffee text-cream'
              }`}
            >
              {count}
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-coffee transition-colors hover:bg-coffee/10 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Scroll progress bar */}
      <span
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-coffee via-amber-700 to-coffee transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* Mobile menu (full-screen overlay) */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] bg-cream transition-all duration-500 ease-out md:hidden ${
          scrolled ? '!top-16' : ''
        } ${open ? 'visible opacity-100' : 'invisible -translate-y-3 opacity-0'}`}
      >
        <ul className="flex flex-col px-5 pt-4">
          {navLinks.map((link, i) => (
            <li
              key={link.label}
              className={`transition-all duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}`}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
            >
              <a
                href={link.href}
                onClick={() => handleClick(link.href)}
                className={`flex items-center justify-between border-b border-coffee/10 py-5 font-heading text-2xl font-semibold ${
                  active === link.href ? 'text-coffee' : 'text-coffee/60'
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className="text-xs font-medium text-coffee/35">0{i + 1}</span>
                  {link.label}
                </span>
                <Icon name="arrow" className="h-5 w-5 opacity-50" />
              </a>
            </li>
          ))}
        </ul>
        <div
          className={`mx-5 mt-8 rounded-3xl bg-coffee p-6 text-cream transition-all delay-300 duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cream/60">Promo Spesial</p>
          <p className="mt-2 font-heading text-lg font-semibold">Hemat hingga 20% untuk semua kopi</p>
          <a href="#/coffee" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-coffee">
            Belanja Sekarang <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
