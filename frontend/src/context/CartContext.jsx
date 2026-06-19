import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], restaurantId: null, total: 0 })
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((item, restaurantId) => {
    setCart(prev => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId) {
        return { items: [{ ...item, qty: 1 }], restaurantId, total: item.price }
      }
      const existing = prev.items.find(i => i.itemId === item.itemId)
      const items = existing
        ? prev.items.map(i => i.itemId === item.itemId ? { ...i, qty: i.qty + 1 } : i)
        : [...prev.items, { ...item, qty: 1 }]
      return {
        restaurantId,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
      }
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((itemId) => {
    setCart(prev => {
      const items = prev.items
        .map(i => i.itemId === itemId ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
      return {
        ...prev,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
        restaurantId: items.length ? prev.restaurantId : null,
      }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({ items: [], restaurantId: null, total: 0 })
  }, [])

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
