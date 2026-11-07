import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import PriceTag from '../components/PriceTag.jsx'
import RoastMeter from '../components/RoastMeter.jsx'
import VariantSelector from '../components/VariantSelector.jsx'
import CatalogCard, { variantWeight } from '../components/CatalogCard.jsx'
import { formatRupiah } from '../data/content.js'
import { availableVariants, catalog, comparePrice, defaultVariantFor, getCategory, getProduct, minQtyFor, variants } from '../data/catalog.js'
import { buildHash, replaceHash } from '../hooks/useHashRoute.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductDetailPage({ id, query = {} }) {
  const product = getProduct(id)
  const initialSize = defaultVariantFor(product, variants.some((v) => v.id === query.size) ? query.size : undefined)
  const [variant, setVariant] = useState(initialSize)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setVariant(initialSize)
    setQty(1)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (product) replaceHash(buildHash(`/coffee/${product.id}`, { size: variant }))
  }, [product, variant])

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1800)
    return () => clearTimeout(t)
  }, [added])

  if (!product) {
    return (
      <section id="product-not-found" className="flex min-h-[70vh] flex-col items-center justify-center bg-beige px-5 pt-20 text-center">
        <h1 className="text-3xl font-semibold text-coffee">Product not found</h1>
        <p className="mt-3 text-coffee/65">The coffee you’re looking for may no longer be available.</p>
        <a href="#/coffee" className="mt-8 rounded-full bg-coffee px-6 py-3 text-sm font-medium text-cream hover:bg-coffee-light">
          Back to All Coffee
        </a>
      </section>
    )
  }

  const category = getCategory(product.category)
  const selected = variants.find((v) => v.id === variant)
  const options = availableVariants(product)
  const price = product.prices[variant]
  const minQty = minQtyFor(variant)
  const belowMin = qty < minQty
  const related = catalog.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const specs = [
    { icon: 'pin', label: 'Origin', value: product.origin },
    { icon: 'mountain', label: 'Altitude', value: product.altitude },
    { icon: 'drop', label: 'Process', value: product.process },
    { icon: 'leaf', label: 'Varietal', value: product.varietal },
  ]

  return (
    <div id="product-detail-page" className="bg-beige pt-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 sm:px-8 sm:pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-coffee/55">
          <li><a href="#home" className="hover:text-coffee">Home</a></li>
          <li aria-hidden="true"><Icon name="chevron" className="h-3 w-3" /></li>
          <li><a href="#/coffee" className="hover:text-coffee">All Coffee</a></li>
          <li aria-hidden="true"><Icon name="chevron" className="h-3 w-3" /></li>
          <li><a href={`#/coffee?category=${category.id}`} className="hover:text-coffee">{category.name}</a></li>
          <li aria-hidden="true"><Icon name="chevron" className="h-3 w-3" /></li>
          <li className="font-medium text-coffee" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <section id="product-overview" className="mx-auto grid max-w-7xl gap-8 px-4 pb-28 pt-6 sm:gap-10 sm:pt-8 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:pb-28">
        {/* Visual */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-28">
            <figure className="relative aspect-square overflow-hidden rounded-[2rem] bg-cream">
              <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
              <div key={variant} className="pop-in relative h-full">
                <ProductVisual
                  product={product}
                  variant={variant}
                  weight={variantWeight(variant)}
                  className="bag-float relative mx-auto h-full w-auto py-8 drop-shadow-2xl sm:py-10"
                />
              </div>
              <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-coffee backdrop-blur">
                {category.name}
              </span>
              {product.bestSeller && (
                <span className="absolute right-5 top-5 rounded-full bg-coffee px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cream">
                  Best Seller
                </span>
              )}
            </figure>

            {/* Variant thumbnails */}
            {options.length > 1 && (
            <ul className={`mt-4 grid gap-2 sm:gap-4 ${options.length === 2 ? 'grid-cols-2' : options.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`} aria-label="Size previews">
              {options.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setVariant(v.id)}
                    className={`flex w-full flex-col items-center rounded-2xl bg-white p-3 ring-1 transition-all duration-300 ${
                      variant === v.id ? 'ring-2 ring-coffee' : 'ring-coffee/10 hover:ring-coffee/30'
                    }`}
                    aria-label={`Preview ${v.label}`}
                  >
                    <span className="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl sm:h-24">
                      <ProductVisual product={{ ...product, id: product.id }} variant={v.id} weight={variantWeight(v.id)} className="h-16 w-auto sm:h-24" />
                    </span>
                    <span className="mt-1 text-xs font-medium text-coffee">{v.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-6">
          <a href={`#/coffee?category=${category.id}`} className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-coffee/60 hover:text-coffee">
            <span className="h-px w-8 bg-coffee/40" />
            {category.name}
          </a>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-coffee sm:text-5xl">{product.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-coffee/60">
            <Icon name="pin" className="h-4 w-4" />
            {product.origin}
            <span className="ml-2 rounded-full bg-beige px-2.5 py-0.5 text-xs font-medium text-coffee">{product.bean}</span>
          </p>

          <p className="mt-5 text-base leading-relaxed text-coffee/80 sm:mt-6 sm:text-lg">{product.short}</p>

          {/* Price */}
          <div className="mt-8 border-y border-coffee/10 py-6">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1" aria-live="polite">
              <PriceTag product={product} variant={variant} size="lg" />
            </div>
            <p className="mt-1.5 text-sm text-coffee/55">/ {selected.label} · {selected.detail}</p>
            {comparePrice(product, variant) && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-500" />
                Promo — hemat {formatRupiah(comparePrice(product, variant) - price)}
              </p>
            )}
          </div>

          {/* Variant selector */}
          <VariantSelector size="lg" value={variant} onChange={setVariant} prices={product.prices} compare={product.compare} options={options} label="Choose size" className="mt-8" />

          {/* Qty + CTA */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center justify-between rounded-full border border-coffee/20 bg-white p-1.5 sm:w-40">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-coffee transition-colors hover:bg-beige disabled:opacity-30"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <span className="font-heading text-lg font-semibold text-coffee" aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-coffee transition-colors hover:bg-beige"
                aria-label="Increase quantity"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (belowMin) return
                addItem(product, variant, qty)
                setAdded(true)
              }}
              disabled={belowMin}
              className="group disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-coffee px-8 py-4 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-coffee-light hover:shadow-[0_12px_30px_-10px_rgba(59,36,24,0.55)] active:scale-[0.98]"
            >
              <Icon name={added ? 'check' : 'bag'} className="h-5 w-5" />
              {added ? 'Added to Bag' : belowMin ? `Min. order ${minQty} sachets` : `Add to Bag · ${formatRupiah(price * qty)}`}
            </button>
          </div>

          {added && (
            <a
              href="#/checkout"
              id="go-to-checkout"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-coffee/30 px-8 py-3.5 text-sm font-medium text-coffee transition-colors hover:border-coffee hover:bg-coffee/5"
            >
              Lanjut ke Pembayaran
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          )}

          {minQty > 1 && (
            <p
              id="min-order-note"
              role={belowMin ? 'alert' : undefined}
              className={`mt-3 flex items-center gap-1.5 text-xs ${belowMin ? 'font-medium text-red-600' : 'text-coffee/55'}`}
            >
              <Icon name={belowMin ? 'close' : 'check'} className="h-3.5 w-3.5" />
              {belowMin
                ? `Sachet wajib pesan minimal ${minQty} sachet — tambah ${minQty - qty} lagi.`
                : `Minimal pemesanan sachet ${minQty} pcs terpenuhi.`}
            </p>
          )}

          <p className="mt-4 flex items-center gap-2 text-xs text-coffee/55">
            <Icon name="truck" className="h-4 w-4" />
            Roasted to order & shipped within 2 days across Indonesia.
          </p>

          {/* Tasting */}
          <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-coffee/5 sm:p-8">
            <h2 className="text-lg font-semibold text-coffee">Tasting Profile</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-coffee/60">Roast Level</dt>
                <dd className="flex items-center gap-3 font-medium text-coffee">
                  {product.roast}
                  <RoastMeter level={product.roastLevel} />
                </dd>
              </div>
              <div>
                <dt className="text-coffee/60">Flavor Notes</dt>
                <dd className="mt-2.5 flex flex-wrap gap-2">
                  {product.notes.map((n) => (
                    <span key={n} className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-coffee">{n}</span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-coffee/60">Best Brewed With</dt>
                <dd className="mt-2.5 flex flex-wrap gap-2">
                  {product.brew.map((b) => (
                    <span key={b} className="rounded-full border border-coffee/15 px-3 py-1 text-xs font-medium text-coffee">{b}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Specs */}
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {specs.map((s) => (
              <div key={s.label} className="rounded-2xl border border-coffee/10 p-4">
                <dt className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-coffee/55">
                  <Icon name={s.icon} className="h-4 w-4" />
                  {s.label}
                </dt>
                <dd className="mt-2 text-sm font-medium text-coffee">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Story */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-coffee">About This Coffee</h2>
            <p className="mt-3 leading-relaxed text-coffee/75">{product.description}</p>
          </div>
        </div>
      </section>

      {/* Mobile sticky add-to-bag bar */}
      <div id="mobile-buy-bar" className="fixed inset-x-0 bottom-0 z-40 border-t border-coffee/10 bg-beige/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.7rem] text-coffee/60">{product.name} · {selected.label} × {qty}</p>
            <PriceTag product={product} variant={variant} qty={qty} size="sm" showBadge={false} />
          </div>
          <button
            type="button"
            onClick={() => {
              if (belowMin) return
              addItem(product, variant, qty)
              setAdded(true)
            }}
            disabled={belowMin}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coffee px-5 py-3 text-sm font-medium text-cream shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            <Icon name={added ? 'check' : 'bag'} className="h-4 w-4" />
            {added ? 'Ditambahkan' : belowMin ? `Min. ${minQty}` : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section id="related-products" className="bg-white pb-32 pt-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-coffee/60">
                  <span className="h-px w-8 bg-coffee/40" />
                  More from {category.name}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-coffee">You May Also Like</h2>
              </div>
              <a href={`#/coffee?category=${category.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-coffee underline-offset-4 hover:underline">
                View all {category.name}
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </header>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <CatalogCard product={p} defaultVariant={variant} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
