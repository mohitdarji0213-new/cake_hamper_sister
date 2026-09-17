import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="font-display text-3xl font-bold text-warm-900 mb-3">Cart Khali Hai!</h2>
      <p className="text-warm-400 mb-8">Kuch khaas choose karein aur add karein</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2"><FiShoppingBag /> Shopping Karein</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">Mera Cart 🛒</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item._id} layout exit={{ opacity: 0, height: 0 }}
                className="card p-4 flex gap-4 items-center">
                <img src={item.images?.[0] || 'https://via.placeholder.com/80'} alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-900 text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-primary-500 font-bold mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-warm-200 rounded-full overflow-hidden text-sm">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 hover:bg-warm-100">−</button>
                    <span className="px-3 py-1 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 hover:bg-warm-100">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-bold text-lg text-warm-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-warm-600 truncate flex-1">{item.name} × {item.quantity}</span>
                <span className="font-medium ml-2">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-warm-100 pt-4 mb-4">
            <div className="flex justify-between">
              <span className="font-bold text-warm-900">Total</span>
              <span className="font-bold text-primary-600 text-lg">₹{total}</span>
            </div>
            {total >= 500 && <p className="text-green-600 text-xs mt-1">✅ Free delivery!</p>}
            {total < 500 && <p className="text-warm-400 text-xs mt-1">₹{500 - total} aur add karein free delivery ke liye</p>}
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
            Checkout <FiArrowRight />
          </button>
          <button onClick={clearCart} className="w-full mt-2 text-sm text-red-400 hover:text-red-600 transition-colors py-2">Cart Clear Karein</button>
        </div>
      </div>
    </div>
  )
}
