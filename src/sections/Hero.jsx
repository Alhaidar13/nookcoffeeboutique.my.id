import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import Icon from '../components/Icon.jsx'
import { products, formatRupiah } from '../data/content.js'
import { catalog, maxDiscount } from '../data/catalog.js'

const stats = [
  { value: catalog.length, suffix: '+', label: 'Varian Kopi' },
  { value: 84, suffix: '+', label: 'Cupping Score' },
  { value: 7, suffix: ' Hari', label: 'Roast ke Rumahmu' },
]

const TITLE = 'Discover the Art of Exceptional Coffee.'
const bestDeal = Math.max(...catalog.map(maxDiscount))

// Angka yang menghitung naik saat terlihat
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - start) / 1400)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

function Bean({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 32" className={`bean-drift absolute ${className}`} style={style} aria-hidden="true">
      <ellipse cx="12" cy="16" rx="10" ry="14" fill="currentColor" />
      <path d="M8 4c5 6 2 14 8 24" stroke="#E8DCC8" strokeOpacity="0.45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Pita promo berjalan
const TICKER = [
  `Promo hemat hingga ${bestDeal}%`,
  'Roasted fresh setiap pesanan',
  'Single origin Nusantara',
  'Kopi Luwak Liar Gayo — Limited',
  'Kirim ke seluruh Indonesia',
  'Bayar via QRIS & BSI',
]

export function PromoTicker() {
  const items = [...TICKER, ...TICKER]
  return (
    <div id="promo-ticker" className="ticker relative overflow-hidden bg-coffee py-3 text-cream">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 px-5 text-xs font-medium uppercase tracking-[0.22em] sm:text-sm">
            <Icon name="sparkle" className="h-3.5 w-3.5 text-amber-300" />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const featured = products[0]
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // efek parallax ringan mengikuti mouse (desktop)
  const onMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 })
  }

  return (
    <>
      <section id="home" onMouseMove={onMove} className="relative overflow-hidden bg-cream pt-[4.5rem] sm:pt-20">
        {/* dekorasi latar */}
        <div className="blob pointer-events-none absolute -left-32 top-24 h-[22rem] w-[22rem] bg-coffee/[0.06] sm:h-[28rem] sm:w-[28rem]" aria-hidden="true" />
        <div className="blob pointer-events-none absolute -right-24 bottom-10 h-72 w-72 bg-amber-900/[0.07]" style={{ animationDelay: '-6s' }} aria-hidden="true" />
        <Bean className="left-[6%] top-[22%] h-6 w-6 text-coffee/20" style={{ animationDelay: '-2s' }} />
        <Bean className="left-[44%] top-[14%] hidden h-4 w-4 text-coffee/15 lg:block" style={{ animationDelay: '-7s' }} />
        <Bean className="bottom-[12%] left-[38%] h-5 w-5 text-coffee/20" style={{ animationDelay: '-4s' }} />
        <Bean className="right-[4%] top-[18%] h-7 w-7 text-coffee/15 lg:hidden" style={{ animationDelay: '-9s' }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-16">
          {/* Text */}
          <div className="relative z-10 text-center lg:col-span-6 lg:text-left">
            <span className="fade-up inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-coffee/80 ring-1 ring-coffee/10 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Promo hemat s/d {bestDeal}%
            </span>

            <h1 className="mt-6 text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-coffee sm:mt-7 sm:text-6xl lg:text-[4.25rem]">
              {TITLE.split(' ').map((w, i) => (
                <span key={i} className="word-in mr-[0.25em]" style={{ animationDelay: `${150 + i * 90}ms` }}>
                  {w === 'Exceptional' ? <span className="text-shimmer">{w}</span> : w}
                </span>
              ))}
            </h1>

            <p className="fade-up mx-auto mt-6 max-w-lg text-[0.95rem] leading-relaxed text-coffee/75 sm:mt-7 sm:text-lg lg:mx-0" style={{ animationDelay: '0.7s' }}>
              Carefully selected specialty coffee beans, crafted for those who appreciate every detail of a perfect brew.
            </p>

            <div className="fade-up mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start" style={{ animationDelay: '0.85s' }}>
              <Button href="#/coffee" withArrow className="w-full sm:w-auto">
                Belanja Sekarang
              </Button>
              <Button href="#featured-coffee" variant="outline" className="w-full sm:w-auto">
                Lihat Kopi Unggulan
              </Button>
            </div>

            <dl className="fade-up mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-coffee/15 pt-7 sm:mt-14 sm:gap-6 sm:pt-8 lg:mx-0" style={{ animationDelay: '1s' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-heading text-2xl font-semibold text-coffee sm:text-3xl">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                  <dd className="mt-1 text-[0.7rem] leading-snug text-coffee/60 sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none">
            <figure
              className="pop-in relative ml-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[2rem] bg-coffee shadow-[0_40px_80px_-40px_rgba(59,36,24,0.7)] transition-transform duration-300 ease-out sm:rounded-[2.5rem]"
              style={{ transform: `perspective(1200px) rotateY(${tilt.x * 3}deg) rotateX(${-tilt.y * 3}deg)` }}
            >
              <img
                src="/static/images/hero-beans.jpg"
                alt="Freshly roasted specialty coffee beans in warm studio light"
                className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out"
                style={{ transform: `scale(1.1) translate(${tilt.x * -8}px, ${tilt.y * -8}px)` }}
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee/70 via-transparent to-transparent" />
              {/* uap kopi */}
              <div className="steam absolute bottom-24 left-10 h-12 w-10" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <figcaption className="absolute bottom-6 right-6 text-right text-cream sm:bottom-8 sm:right-8">
                <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-cream/70">Small Batch</span>
                <span className="mt-1 block font-heading text-lg font-medium">Roasted Weekly</span>
                <span className="mt-1 block text-xs text-cream/70">Gayo · Toraja · Kintamani</span>
              </figcaption>
            </figure>

            {/* Floating packaging card */}
            {featured && (
              <a
                href={`#/coffee/${featured.id}?size=${featured.variant}`}
                className="bag-float absolute -bottom-8 -left-2 w-36 rounded-3xl bg-beige p-3 shadow-[0_30px_60px_-30px_rgba(59,36,24,0.6)] ring-1 ring-coffee/5 transition-transform hover:scale-105 sm:-bottom-10 sm:left-0 sm:w-48 sm:p-4 lg:-left-10 lg:w-56"
              >
                <ProductVisual product={featured} variant={featured.variant} weight={featured.weight} className="mx-auto h-32 w-auto sm:h-44 lg:h-52" />
                <p className="mt-2 text-center">
                  <span className="block text-[0.55rem] uppercase tracking-[0.25em] text-coffee/60 sm:text-[0.6rem]">Best Seller</span>
                  <span className="block font-heading text-xs font-semibold text-coffee sm:text-sm">{featured.name}</span>
                  <span className="text-[0.7rem] font-medium text-red-600 sm:text-xs">{formatRupiah(featured.price)}</span>
                </p>
              </a>
            )}

            {/* Floating rating chip */}
            <div className="fade-up absolute -right-1 top-6 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-lg backdrop-blur sm:right-4 sm:top-8 sm:px-4 sm:py-3" style={{ animationDelay: '1.2s' }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 sm:h-9 sm:w-9">
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.8Z" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block font-heading text-sm font-semibold text-coffee">4.9/5</span>
                <span className="block text-[0.6rem] text-coffee/60 sm:text-[0.65rem]">500+ pelanggan</span>
              </span>
            </div>
          </div>
        </div>
      </section>
      <PromoTicker />
    </>
  )
}
