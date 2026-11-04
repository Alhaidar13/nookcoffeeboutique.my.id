import { useEffect, useState } from 'react'

// Tiny hash router.
//   #/coffee                       -> { page: 'catalog' }
//   #/coffee?category=espresso     -> { page: 'catalog', query: { category } }
//   #/coffee/aceh-gayo?size=150g   -> { page: 'detail', id: 'aceh-gayo', query: { size } }
//   anything else (#home, #brand-intro, '') -> { page: 'home', anchor }
export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith('/')) return { page: 'home', anchor: raw || null, query: {} }

  const [path, qs = ''] = raw.split('?')
  const query = Object.fromEntries(new URLSearchParams(qs))
  const parts = path.split('/').filter(Boolean)

  if (parts[0] === 'coffee' && parts[1]) return { page: 'detail', id: decodeURIComponent(parts[1]), query }
  if (parts[0] === 'coffee') return { page: 'catalog', query }
  return { page: 'home', anchor: null, query: {} }
}

export function buildHash(path, query = {}) {
  const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  const s = qs.toString()
  return `#${path}${s ? `?${s}` : ''}`
}

export default function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash())

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

// Replace the hash without adding a history entry (used for filter/search state)
export function replaceHash(hash) {
  const url = `${window.location.pathname}${window.location.search}${hash}`
  window.history.replaceState(null, '', url)
}
