import { useEffect, useState } from 'react'
import CoffeeBag from './CoffeeBag.jsx'
import Icon from './Icon.jsx'
import VariantSelector from './VariantSelector.jsx'
import { formatRupiah } from '../data/content.js'
import { availableVariants, defaultVariantFor, getCategory, minQtyFor, variants } from '../data/catalog.js'

export const variantWeight = (id) => variants.find((v) => v.id === id)?.label || id

export default function CatalogCard({ product, defaultVariant }) {
  const [variant, setVariant] = useState(() => defaultVariantFor(product, defaultVariant))
  useEffect(() => setVariant(defaultVariantFor(product, defaultVariant)), [product, defaultVariant])

  const category = getCategory(product.category)
  const options = availableVariants(product)
  const href = `#/coffee/${product.id}?size=${variant}`
  const minQty = minQtyFor(variant)

  return (
    <article className="catalog-card group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-coffee/5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(59,36,24,0.45)]">
      <a href={href} className="relative block aspect-[4/3.6] overflow-hidden bg-cream" aria-label={`View ${product.name}`}>
        <img
          src={category.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        <CoffeeBag
          product={{ ...product, weight: variantWeight(variant) }}
          className="relative mx-auto h-full w-auto py-5 drop-shadow-xl transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-coffee backdrop-blur">
          {product.bean}
        </span>
        {product.bestSeller && (
          <span className="absolute right-4 top-4 rounded-full bg-coffee px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-cream">
            Best Seller
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-coffee/55">
          <Icon name="pin" className="h-3.5 w-3.5" />
          {product.origin}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-coffee">
          <a href={href} className="hover:underline hover:underline-offset-4">
            {product.name}
          </a>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-coffee/65">{product.short}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Flavor notes">
          {product.notes.map((n) => (
            <li key={n} className="rounded-full bg-beige px-2.5 py-1 text-[0.68rem] font-medium text-coffee/80">
              {n}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-coffee/10 pt-4">
          {options.length > 1 ? (
            <VariantSelector
              value={variant}
              onChange={setVariant}
              options={options}
              label={`Size for ${product.name}`}
              className="w-full justify-between [&>button]:flex-1"
            />
          ) : (
            <p className="flex items-center justify-between rounded-full bg-beige px-4 py-1.5 text-xs font-medium text-coffee">
              <span className="text-coffee/60">Size</span>
              {options[0]?.label}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex min-w-0 flex-col">
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-coffee/50">Price</span>
            <span className="whitespace-nowrap font-heading text-base font-semibold text-coffee sm:text-lg">
              {formatRupiah(product.prices[variant])}
              {variant === 'sachet' && <span className="text-xs font-normal text-coffee/55"> /sachet</span>}
            </span>
            {minQty > 1 && <span className="mt-0.5 text-[0.68rem] text-amber-700">Min. order {minQty} sachets</span>}
          </p>
          <a
            href={href}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-coffee px-4 py-2.5 text-[0.8rem] font-medium text-cream transition-all duration-300 hover:bg-coffee-light hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee focus-visible:ring-offset-2"
          >
            View Detail
            <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
