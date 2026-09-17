import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProduct } from '../../utils/api'
import { useCart } from '../../context/CartContext'
import ProductCard from '../../components/shared/ProductCard'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiZap, FiChevronLeft, FiChevronRight, FiShare2, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [showPayment, setShowPayment] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getProduct(slug).then(({ data }) => {
      setProduct(data.product)
      setRelated(data.related)
      setImgIdx(0)
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner size="lg" />
  if (!product) return null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAddToCart = () => {
    addToCart(product, qty)
    toast.success(`${product.name} cart mein add ho gaya! 🛒`)
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    navigate('/checkout')
  }

  const PAYMENT_METHODS = [
    { id: 'gpay', name: 'Google Pay', icon: '🎯', color: 'from-blue-500 to-green-500' },
    { id: 'paytm', name: 'Paytm', icon: '💙', color: 'from-blue-400 to-blue-600' },
    { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'from-orange-500 to-green-600' },
    { id: 'credit_card', name: 'Credit Card', icon: '💳', color: 'from-purple-500 to-indigo-600' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', color: 'from-green-500 to-emerald-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-warm-400 mb-6">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.category?.slug}`} className="hover:text-primary-500">{product.category?.name}</Link>
        <span>/</span>
        <span className="text-warm-700 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-100 mb-3">
            <motion.img key={imgIdx}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              src={product.images?.[imgIdx] || 'https://via.placeholder.com/500'}
              alt={product.name} className="w-full h-full object-cover" />
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <FiChevronLeft />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <FiChevronRight />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-primary-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-primary-500 font-semibold text-sm mb-2">{product.category?.name}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-900 mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-warm-300 text-lg line-through">₹{product.originalPrice}</span>
                <span className="badge-sale text-sm px-3 py-1">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>

          {/* Description */}
          <p className="text-warm-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <FiTag className="text-warm-400 mt-0.5" />
              {product.tags.map(tag => (
                <Link key={tag} to={`/search?tag=${tag}`}
                  className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-warm-700">Quantity:</span>
            <div className="flex items-center border border-warm-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-warm-100 transition-colors font-bold">−</button>
              <span className="px-4 py-2 font-bold text-warm-900 min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-warm-100 transition-colors font-bold">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-4">
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 btn-outline flex items-center justify-center gap-2 disabled:opacity-50">
              <FiShoppingCart /> Add to Cart
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleBuyNow} disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
              <FiZap /> Buy Now
            </motion.button>
          </div>

          {/* Payment Options */}
          <button onClick={() => setShowPayment(!showPayment)} className="text-sm text-warm-400 hover:text-primary-500 transition-colors mb-3 flex items-center gap-1">
            💳 Payment options {showPayment ? '▲' : '▼'}
          </button>
          {showPayment && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {PAYMENT_METHODS.map(m => (
                <Link key={m.id} to="/checkout"
                  className={`flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r ${m.color} text-white text-xs font-semibold shadow-sm hover:shadow-md transition-shadow`}>
                  <span className="text-base">{m.icon}</span>{m.name}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Share */}
          <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); }}
            className="flex items-center gap-2 text-sm text-warm-400 hover:text-primary-500 transition-colors">
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
