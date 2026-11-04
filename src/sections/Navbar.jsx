import { useEffect, useState } from 'react'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { navLinks } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar({ route = { page: 'home' } }) {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  // Shop link is active on catalog/detail pages
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
      className={`fixed inset-x-0 top-0 z-50 bg-cream transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_8px_30px_-18px_rgba(59,36,24,0.45)]' : ''
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
        <Logo />

        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => handleClick(link.href)}
                className={`relative py-2 text-sm font-medium tracking-wide text-coffee transition-opacity duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-coffee after:transition-transform after:duration-300 hover:opacity-100 ${
                  active === link.href ? 'opacity-100 after:scale-x-100' : 'opacity-70 after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#/checkout"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-coffee transition-colors duration-300 hover:bg-coffee hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee"
            aria-label={`Shopping bag & checkout, ${count} items`}
            title="Bag & Checkout"
          >
            <Icon name="bag" className="h-[22px] w-[22px]" />
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee px-1 text-[0.6rem] font-semibold text-cream ring-2 ring-cream">
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

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-coffee/10 bg-cream transition-[max-height,opacity] duration-500 ease-out md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-5 py-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => handleClick(link.href)}
                className="flex items-center justify-between border-b border-coffee/10 py-4 font-heading text-lg font-medium text-coffee last:border-0"
              >
                {link.label}
                <Icon name="arrow" className="h-4 w-4 opacity-50" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
