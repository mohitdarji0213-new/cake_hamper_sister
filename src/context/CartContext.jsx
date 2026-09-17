import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('chs_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('chs_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id))

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
