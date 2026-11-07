import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'

export default function BrandCta() {
  return (
    <section id="brand-cta" className="bg-beige px-4 pb-20 sm:px-8 sm:pb-32">
      <Reveal variant="zoom" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-coffee sm:rounded-[2.5rem]">
        <img
          src="/static/images/beans-macro.jpg"
          alt=""
          loading="lazy"
          className="ken-burns absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee via-coffee/90 to-coffee/40" />

        <div className="relative grid items-center gap-8 px-6 py-14 sm:px-14 sm:py-20 lg:grid-cols-12 lg:px-20 lg:py-24">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cream/70">
              <span className="h-px w-8 bg-cream/50" />
              Start Brewing
            </span>
            <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl">
              Your Perfect Brew Starts Here.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/75 sm:mt-6 sm:text-lg">
              Find the coffee beans that match your taste and elevate your daily coffee experience.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button href="#/coffee" variant="light" withArrow className="w-full !px-9 !py-4 text-base sm:w-auto">
              Shop Coffee Beans
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
