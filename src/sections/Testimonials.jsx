import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/Reveal.jsx'
import { testimonials } from '../data/content.js'

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5 text-coffee" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < count ? 'fill-current' : 'fill-coffee/20'}`} aria-hidden="true">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.8Z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }) {
  const initials = t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
  return (
    <article className="testimonial-card flex w-[19rem] shrink-0 flex-col justify-between rounded-3xl bg-white/70 p-7 shadow-[0_20px_50px_-30px_rgba(59,36,24,0.45)] ring-1 ring-coffee/5 sm:w-[23rem]">
      <div>
        <Stars count={t.rating} />
        <blockquote className="mt-5 text-[0.95rem] leading-relaxed text-coffee/80">“{t.quote}”</blockquote>
      </div>
      <footer className="mt-7 flex items-center gap-3 border-t border-coffee/10 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee font-heading text-sm font-semibold text-cream">
          {initials}
        </span>
        <span className="flex flex-col">
          <span className="font-heading text-sm font-semibold text-coffee">{t.name}</span>
          <span className="text-xs text-coffee/60">{t.role}</span>
        </span>
      </footer>
    </article>
  )
}

function MarqueeRow({ items, direction }) {
  // Duplicate list so the -50% translate loops seamlessly
  const loop = [...items, ...items]
  return (
    <div className="marquee overflow-hidden py-3">
      <div className={`marquee-track marquee-track--${direction}`}>
        {loop.map((t, i) => (
          <div key={`${t.name}-${i}`} aria-hidden={i >= items.length ? 'true' : undefined}>
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const half = Math.ceil(testimonials.length / 2)
  const rowA = testimonials.slice(0, half)
  const rowB = testimonials.slice(half)

  return (
    <section id="testimonials" className="overflow-hidden bg-cream/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by Coffee Enthusiasts"
            subtitle="What our customers say about every cup brewed with Nook coffee."
          />
        </Reveal>
      </div>

      <div className="mt-14 space-y-4">
        <MarqueeRow items={rowA} direction="left" />
        <MarqueeRow items={rowB} direction="right" />
      </div>
    </section>
  )
}
