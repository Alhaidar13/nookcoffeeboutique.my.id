import { useEffect, useRef } from 'react'
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
    <article className="testimonial-card flex w-[16.5rem] shrink-0 flex-col justify-between rounded-3xl bg-white/70 p-6 sm:p-7 shadow-[0_20px_50px_-30px_rgba(59,36,24,0.45)] ring-1 ring-coffee/5 sm:w-[23rem]">
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

// Auto-scrolling row driven by requestAnimationFrame.
// direction="right" -> cards move left-to-right, direction="left" -> right-to-left.
function MarqueeRow({ items, direction, speed = 40 }) {
  const trackRef = useRef(null)
  const paused = useRef(false)
  // Repeat list so the track is always wider than the screen and loops seamlessly
  const loop = [...items, ...items, ...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf
    let last = performance.now()
    let offset = 0
    const step = (now) => {
      const dt = Math.min(now - last, 64) / 1000
      last = now
      const half = track.scrollWidth / 2 // one full set (items x2) = half the track
      if (half > 0 && !paused.current) {
        offset += (direction === 'right' ? 1 : -1) * speed * dt
        if (offset <= -half) offset += half
        if (offset > 0) offset -= half
        track.style.transform = `translate3d(${offset}px,0,0)`
      }
      raf = requestAnimationFrame(step)
    }
    // start right-moving rows already shifted so there is no empty gap on the left
    if (direction === 'right') offset = -track.scrollWidth / 2
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [direction, speed])

  return (
    <div
      className="marquee overflow-hidden py-3"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div ref={trackRef} className="marquee-track" data-direction={direction}>
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
    <section id="testimonials" className="overflow-hidden bg-cream/60 py-20 sm:py-32">
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
        {/* Top row slides automatically to the right, bottom row to the left */}
        <MarqueeRow items={rowA} direction="right" />
        <MarqueeRow items={rowB} direction="left" />
      </div>
    </section>
  )
}
