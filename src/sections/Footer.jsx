import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { brand, navLinks } from '../data/content.js'

const socials = [
  { label: 'Instagram', handle: '@arunika.coffee', href: 'https://instagram.com/', icon: 'instagram' },
  { label: 'WhatsApp', handle: '+62 812 0000 0000', href: 'https://wa.me/6281200000000', icon: 'whatsapp' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="site-footer" className="bg-coffee text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">{brand.description}</p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer quick links">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-cream/80 transition-colors duration-300 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">Connect With Us</h3>
          <ul className="mt-5 space-y-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                  aria-label={`${s.label} ${s.handle}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 transition-colors duration-300 group-hover:border-cream group-hover:bg-cream group-hover:text-coffee">
                    <Icon name={s.icon} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-cream/50">{s.label}</span>
                    <span className="text-sm text-cream/85 transition-colors group-hover:text-white">{s.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {year} {brand.name} Coffee Boutique. All rights reserved.</p>
          <p>Specialty coffee, roasted in Indonesia.</p>
        </div>
      </div>
    </footer>
  )
}
