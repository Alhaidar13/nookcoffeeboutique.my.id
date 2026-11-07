import SectionHeading from '../components/SectionHeading.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import { products } from '../data/content.js'

export default function FeaturedCoffee() {
  return (
    <section id="featured-coffee" className="bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Featured Coffee"
            title="Our Signature Selection"
            subtitle="Kopi pilihan dengan harga promo spesial — stok terbatas."
          />
        </Reveal>

        <ul className="mt-10 grid gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal as="li" key={product.id} delay={i * 120} variant="zoom" className={i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-1rem)] lg:col-span-1 lg:mx-0 lg:w-full' : ''}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-14">
          <Button href="#/coffee" variant="outline" withArrow>
            View All Coffee
          </Button>
        </div>
      </div>
    </section>
  )
}
