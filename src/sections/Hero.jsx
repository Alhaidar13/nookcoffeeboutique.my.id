import Button from '../components/Button.jsx'
import CoffeeBag from '../components/CoffeeBag.jsx'
import { products } from '../data/content.js'

const stats = [
  { value: '100%', label: 'Arabica Specialty' },
  { value: '84+', label: 'Cupping Score' },
  { value: '7 Days', label: 'From Roast to You' },
]

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-cream pt-20">
      {/* soft decorative circle */}
      <div className="pointer-events-none absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full border border-coffee/10" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-16">
        {/* Text */}
        <div className="relative z-10 lg:col-span-6">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-coffee/70">
            <span className="h-px w-10 bg-coffee/40" />
            Indonesian Specialty Coffee
          </span>

          <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-coffee sm:text-6xl lg:text-[4.25rem]">
            Discover the Art of{' '}
            <span className="font-normal italic text-coffee/80">Exceptional</span> Coffee.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-coffee/75 sm:text-lg">
            Carefully selected specialty coffee beans, crafted for those who appreciate every detail of a perfect brew.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="#featured-coffee" withArrow>
              Explore Our Coffee
            </Button>
            <Button href="#brand-intro" variant="outline">
              Discover Our Story
            </Button>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-coffee/15 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-2xl font-semibold text-coffee sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-coffee/60 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-6">
          <figure className="relative ml-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[2rem] bg-coffee shadow-[0_40px_80px_-40px_rgba(59,36,24,0.7)] sm:rounded-[2.5rem]">
            <img
              src="/static/images/hero-beans.jpg"
              alt="Freshly roasted specialty coffee beans in warm studio light"
              className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out hover:scale-105"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee/60 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 right-6 text-right text-cream sm:bottom-8 sm:right-8">
              <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-cream/70">Small Batch</span>
              <span className="mt-1 block font-heading text-lg font-medium">Roasted Weekly</span>
              <span className="mt-1 block text-xs text-cream/70">Gayo · Toraja · Kintamani</span>
            </figcaption>
          </figure>

          {/* Floating packaging card */}
          <div className="absolute -bottom-10 left-0 hidden w-48 rounded-3xl bg-beige p-4 shadow-[0_30px_60px_-30px_rgba(59,36,24,0.6)] ring-1 ring-coffee/5 sm:block lg:-left-10 lg:w-56">
            <CoffeeBag product={products[0]} className="mx-auto h-44 w-auto lg:h-52" />
            <p className="mt-2 text-center">
              <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-coffee/60">Best Seller</span>
              <span className="font-heading text-sm font-semibold text-coffee">Aceh Gayo</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
