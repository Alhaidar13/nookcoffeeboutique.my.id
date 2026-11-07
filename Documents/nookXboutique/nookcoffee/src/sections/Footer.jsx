import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { brand, navLinks, contact } from '../data/content.js'

const waMessage = encodeURIComponent('Halo Nook Coffee Boutique, saya ingin bertanya tentang produk kopi Anda.')
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`

function ContactLink({ href, icon, label, value }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4"
      aria-label={`${label} ${value}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/25 transition-colors duration-300 group-hover:border-cream group-hover:bg-cream group-hover:text-coffee">
        <Icon name={icon} />
      </span>
      <span className="flex flex-col pt-0.5">
        <span className="text-xs text-cream/50">{label}</span>
        <span className="text-sm leading-relaxed text-cream/85 transition-colors group-hover:text-white">{value}</span>
      </span>
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="site-footer" className="bg-coffee text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-28 pt-14 sm:px-8 sm:gap-12 md:grid-cols-2 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">{brand.description}</p>
        </div>

        <nav className="lg:col-span-2" aria-label="Footer quick links">
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

        <address id="customer-center" className="not-italic lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">Customer Center</h3>
          <div className="mt-5">
            <ContactLink href={mapsUrl} icon="pin" label="Lokasi" value={contact.address} />
          </div>
        </address>

        <div id="footer-connect" className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">Connect With Us</h3>
          <ul className="mt-5 space-y-4">
            {contact.phones.map((p) => (
              <li key={p.wa}>
                <ContactLink
                  href={`https://wa.me/${p.wa}?text=${waMessage}`}
                  icon="whatsapp"
                  label="WhatsApp"
                  value={p.display}
                />
              </li>
            ))}
            <li>
              <ContactLink href={contact.instagram.url} icon="instagram" label="Instagram" value={contact.instagram.handle} />
            </li>
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
