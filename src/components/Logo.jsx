import { brand } from '../data/content.js'

export default function Logo({ tone = 'dark', className = '' }) {
  const color = tone === 'dark' ? 'text-coffee' : 'text-cream'
  return (
    <a href="#home" className={`group inline-flex items-center gap-3 ${color} ${className}`} aria-label={`${brand.name} home`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <ellipse cx="20" cy="20" rx="7.5" ry="11" transform="rotate(25 20 20)" />
          <path d="M16.4 11.6c3.6 4.6 2.4 9.6 7.2 16.8" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-semibold uppercase tracking-[0.28em]">{brand.name}</span>
        <span className="mt-1 font-body text-[0.6rem] uppercase tracking-[0.42em] opacity-70">{brand.tagline}</span>
      </span>
    </a>
  )
}
