import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'nook-cart-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const addItem = useCallback((product, variant, qty = 1) => {
    setItems((prev) => {
      const key = `${product.id}:${variant}`
      const found = prev.find((i) => i.key === key)
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { key, id: product.id, variant, qty }]
    })
    setToast({ name: product.name, variant, qty, at: Date.now() })
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)))
  }, [])

  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => setItems([]), [])

  const count = items.reduce((n, i) => n + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, addItem, updateQty, removeItem, clearCart, toast }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
