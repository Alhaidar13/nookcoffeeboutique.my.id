import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import CatalogCard from '../components/CatalogCard.jsx'
import VariantSelector from '../components/VariantSelector.jsx'
import Reveal from '../components/Reveal.jsx'
import { catalog, categories, variants } from '../data/catalog.js'
import { buildHash, replaceHash } from '../hooks/useHashRoute.js'

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const SIZE_OPTIONS = [{ id: 'all', label: 'All' }, ...variants]
const hasSize = (product, size) => size === 'all' || product.prices[size] != null

const matches = (product, q) => {
  if (!q) return true
  const hay = normalize(
    [product.name, product.origin, product.bean, product.short, product.roast, product.process, ...product.notes, ...product.brew].join(' ')
  )
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

export default function CatalogPage({ query = {} }) {
  const validCat = categories.some((c) => c.id === query.category) ? query.category : 'all'
  const validSize = variants.some((v) => v.id === query.size) ? query.size : 'all'

  const [activeCategory, setActiveCategory] = useState(validCat)
  const [size, setSize] = useState(validSize)
  const [search, setSearch] = useState(query.q || '')
  const searchRef = useRef(null)

  // keep URL in sync (shareable filter state) without polluting history
  useEffect(() => {
    replaceHash(
      buildHash('/coffee', {
        category: activeCategory !== 'all' ? activeCategory : undefined,
        size: size !== 'all' ? size : undefined,
        q: search.trim() || undefined,
      })
    )
  }, [activeCategory, size, search])

  // keyboard shortcut "/" focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Group results by category — products are never shown as one flat list
  const groups = useMemo(() => {
    return categories
      .filter((c) => activeCategory === 'all' || c.id === activeCategory)
      .map((c) => ({ ...c, items: catalog.filter((p) => p.category === c.id && hasSize(p, size) && matches(p, search)) }))
  }, [activeCategory, search, size])

  const counts = useMemo(() => {
    const map = { all: 0 }
    categories.forEach((c) => {
      map[c.id] = catalog.filter((p) => p.category === c.id && hasSize(p, size) && matches(p, search)).length
      map.all += map[c.id]
    })
    return map
  }, [search, size])

  const totalVisible = groups.reduce((n, g) => n + g.items.length, 0)
  const tabs = [{ id: 'all', name: 'All Coffee' }, ...categories]

  return (
    <div id="catalog-page" className="bg-beige pt-20">
      {/* Page header */}
      <section id="catalog-hero" className="relative overflow-hidden bg-coffee text-cream">
        <img src="/static/images/hero-beans.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee via-coffee/90 to-coffee/50" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-cream/60">
            <ol className="flex items-center gap-2">
              <li>
                <a href="#home" className="hover:text-cream">Home</a>
              </li>
              <li aria-hidden="true"><Icon name="chevron" className="h-3 w-3" /></li>
              <li className="text-cream" aria-current="page">All Coffee</li>
            </ol>
          </nav>
          <span className="mt-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cream/70">
            <span className="h-px w-8 bg-cream/50" />
            Product Catalog
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Explore Our Coffee Collection.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            From single-origin Nusantara arabica to rare Kopi Luwak and bold Indonesian robusta — find the bag that fits your ritual.
          </p>

          {/* Search */}
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex max-w-2xl items-center gap-3 rounded-full bg-cream p-2 pl-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)]"
          >
            <Icon name="search" className="h-5 w-5 shrink-0 text-coffee/60" />
            <label htmlFor="product-search" className="sr-only">Search product</label>
            <input
              ref={searchRef}
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coffee, origin, or flavor notes…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-coffee placeholder:text-coffee/45 focus:outline-none sm:text-base [&::-webkit-search-cancel-button]:hidden"
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-coffee/60 hover:bg-coffee/10 hover:text-coffee"
                aria-label="Clear search"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden rounded-full border border-coffee/15 px-3 py-1.5 text-xs text-coffee/50 sm:block">/</kbd>
          </form>
        </div>
      </section>

      {/* Sticky toolbar: category filter + variant selector */}
      <div id="catalog-toolbar" className="sticky top-20 z-30 border-b border-coffee/10 bg-beige/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Product categories" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:pb-0">
            {tabs.map((t) => {
              const active = activeCategory === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(t.id)}
                  className={`category-tab inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee ${
                    active
                      ? 'border-coffee bg-coffee text-cream'
                      : 'border-coffee/15 bg-white text-coffee/75 hover:border-coffee/40 hover:text-coffee'
                  }`}
                >
                  {t.name}
                  <span className={`rounded-full px-2 py-0.5 text-[0.65rem] ${active ? 'bg-cream/20 text-cream' : 'bg-beige text-coffee/60'}`}>
                    {counts[t.id]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-coffee/55">Size</span>
            <VariantSelector value={size} onChange={setSize} options={SIZE_OPTIONS} label="Filter by size" className="bg-white ring-1 ring-coffee/10" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32">
        <p className="text-sm text-coffee/60" aria-live="polite">
          {search ? (
            <>
              Showing <strong className="text-coffee">{totalVisible}</strong> result{totalVisible !== 1 && 's'} for “
              <strong className="text-coffee">{search}</strong>”
            </>
          ) : (
            <>
              <strong className="text-coffee">{totalVisible}</strong> coffees across{' '}
              <strong className="text-coffee">{groups.length}</strong> {groups.length > 1 ? 'categories' : 'category'}
            </>
          )}
        </p>

        {totalVisible === 0 ? (
          <div id="catalog-empty" className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-coffee/20 bg-white/60 px-6 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-coffee">
              <Icon name="search" className="h-7 w-7" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-coffee">No coffee found</h2>
            <p className="mt-2 max-w-sm text-coffee/65">
              {search ? <>We couldn’t find a match for “{search}”. Try another name, origin, or flavor note.</> : <>No coffee is available in this size for the selected category.</>}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActiveCategory('all')
                setSize('all')
              }}
              className="mt-8 rounded-full bg-coffee px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-coffee-light"
            >
              Reset filters
            </button>
          </div>
        ) : (
          groups
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <section key={group.id} id={`category-${group.id}`} className="catalog-group mt-14 first-of-type:mt-10" aria-labelledby={`heading-${group.id}`}>
                <Reveal>
                  <header className="flex flex-col gap-5 border-b border-coffee/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-5">
                      <figure className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block">
                        <img src={group.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </figure>
                      <div>
                        <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-coffee/55">{group.eyebrow}</span>
                        <h2 id={`heading-${group.id}`} className="mt-1 text-2xl font-semibold tracking-tight text-coffee sm:text-3xl">
                          {group.name}
                        </h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-coffee/65">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-coffee/55">
                        {group.items.length} product{group.items.length > 1 && 's'}
                      </span>
                      {activeCategory === 'all' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory(group.id)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-coffee underline-offset-4 hover:underline"
                        >
                          See only {group.name}
                          <Icon name="arrow" className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </header>
                </Reveal>

                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((p, i) => (
                    <Reveal as="li" key={p.id} delay={(i % 4) * 70}>
                      <CatalogCard product={p} defaultVariant={size === 'all' ? undefined : size} />
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))
        )}
      </div>
    </div>
  )
}
