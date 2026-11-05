import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'

const pillars = [
  { title: 'Origin', text: 'Highland farms across the Indonesian archipelago.' },
  { title: 'Roast', text: 'Small-batch profiles tuned for each bean.' },
  { title: 'Ritual', text: 'Fresh beans for your daily brewing moment.' },
]

export default function BrandIntro() {
  return (
    <section id="brand-intro" className="relative overflow-hidden bg-beige py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Images */}
        <Reveal variant="left" className="relative order-2 lg:order-1">
          <div className="grid grid-cols-5 gap-4 sm:gap-5">
            <figure className="col-span-3 aspect-[3/4] overflow-hidden rounded-3xl">
              <img
                src="/static/images/sack-beans.jpg"
                alt="Roasted coffee beans spilling from a burlap pouch"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
              />
            </figure>
            <div className="col-span-2 flex flex-col gap-4 sm:gap-5">
              <figure className="aspect-square overflow-hidden rounded-3xl">
                <img
                  src="/static/images/espresso.jpg"
                  alt="Freshly brewed espresso beside roasted beans"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
              </figure>
              <div className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-3xl bg-coffee p-5 text-cream sm:p-6">
                <span className="blob absolute -right-6 -top-6 h-24 w-24 bg-cream/10" aria-hidden="true" />
                <span className="font-heading text-3xl font-semibold sm:text-4xl">12+</span>
                <span className="mt-1 text-xs leading-snug text-cream/70 sm:text-sm">Partner farms across Indonesia</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal variant="right" delay={120} className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-coffee/70">
            <span className="h-px w-8 bg-coffee/40" />
            Our Philosophy
          </span>
          <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-coffee sm:text-5xl">
            More Than Just Coffee.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-coffee/75 sm:mt-6 sm:text-lg">
            We believe every coffee bean has a story. From carefully selected origins to thoughtful roasting, we bring
            exceptional coffee experiences closer to you.
          </p>

          <ul className="mt-10 grid gap-6 border-t border-coffee/15 pt-8 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <li key={p.title} className="group rounded-2xl p-3 -m-3 transition-colors duration-300 hover:bg-white/70">
                <span className="font-heading text-xs font-medium text-coffee/40">0{i + 1}</span>
                <h3 className="mt-1 text-base font-semibold text-coffee">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-coffee/65">{p.text}</p>
              </li>
            ))}
          </ul>

          <Button href="#why-choose-us" variant="text" withArrow className="mt-10">
            Learn how we work
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
