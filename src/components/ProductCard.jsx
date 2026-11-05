import ProductVisual from './ProductVisual.jsx'
import PriceTag from './PriceTag.jsx'
import RoastMeter from './RoastMeter.jsx'
import Icon from './Icon.jsx'
import { discountPercent } from '../data/catalog.js'

export default function ProductCard({ product }) {
  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-coffee/5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(59,36,24,0.45)]">
      {/* Product visual */}
      <figure className="relative aspect-[4/4.2] overflow-hidden bg-cream">
        <img
          src="/static/images/beans-macro.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        <ProductVisual
          product={product}
          variant={product.variant}
          weight={product.weight}
          className="bag-float relative mx-auto h-full w-auto py-6 drop-shadow-xl transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:-rotate-2"
        />
        <span className="shine pointer-events-none absolute inset-0" aria-hidden="true" />
        {discountPercent(product, product.variant) > 0 && (
          <span className="badge-pulse absolute right-5 top-5 rounded-full bg-red-600 px-2.5 py-1 text-[0.65rem] font-semibold text-white">
            Hemat {discountPercent(product, product.variant)}%
          </span>
        )}
        <span className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-coffee backdrop-blur">
          {product.weight}
        </span>
      </figure>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-coffee/60">
          <Icon name="pin" className="h-3.5 w-3.5" />
          {product.origin}
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-coffee">{product.name}</h3>

        <dl className="mt-5 space-y-4 border-t border-coffee/10 pt-5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-coffee/60">Roast</dt>
            <dd className="flex items-center gap-3 font-medium text-coffee">
              {product.roast}
              <RoastMeter level={product.roastLevel} />
            </dd>
          </div>
          <div>
            <dt className="text-coffee/60">Flavor Notes</dt>
            <dd className="mt-2.5 flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span key={note} className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-coffee">
                  {note}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <p className="flex flex-col">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-coffee/50">Price</span>
            <PriceTag product={product} variant={product.variant} size="md" showBadge={false} className="flex-col !items-start !gap-0" />
          </p>
          <a
            href={`#/coffee/${product.id}?size=${product.variant}`}
            className="inline-flex items-center gap-2 rounded-full bg-coffee px-5 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-coffee-light hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee focus-visible:ring-offset-2"
            aria-label={`View ${product.name}`}
          >
            View Coffee
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
