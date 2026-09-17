import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiZap } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success(`${product.name} cart mein add ho gaya! 🛒`)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product.slug}`} className="card block overflow-hidden group">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-warm-100">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="badge-new">NEW</span>}
            {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
          </div>
          {/* Quick Add */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-2 right-2 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary-500 hover:text-white text-primary-500"
          >
            <FiShoppingCart className="text-lg" />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-primary-500 font-semibold mb-0.5">{product.category?.name}</p>
          <h3 className="font-semibold text-warm-900 text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary-600 font-bold text-base">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-warm-300 text-xs line-through ml-1">₹{product.originalPrice}</span>
              )}
            </div>
            {product.stock === 0 && <span className="text-xs text-red-400 font-medium">Out of Stock</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
