import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProducts, getCategories } from '../../utils/api'
import ProductCard from '../../components/shared/ProductCard'
import ProductSkeleton from '../../components/shared/ProductSkeleton'
import { FiFilter, FiGrid, FiChevronRight } from 'react-icons/fi'
import {
  MdOutlineCelebration, MdOutlineCake, MdOutlineFavorite,
  MdOutlineCardGiftcard, MdOutlineDiamond,
} from 'react-icons/md'
import { HiOutlineCake } from 'react-icons/hi'

// Category slug se icon mapping (react-icons) — cake flavors & designs
const CAT_ICONS = {
  'chocolate':      <span className="text-3xl">🍫</span>,
  'vanilla':        <span className="text-3xl">🍦</span>,
  'red-velvet':     <MdOutlineFavorite className="text-3xl text-pink-500" />,
  'black-forest':   <span className="text-3xl">🍒</span>,
  'butterscotch':   <span className="text-3xl">🧈</span>,
  'birthday-cakes': <MdOutlineCake className="text-3xl text-orange-400" />,
  'wedding-cakes':  <MdOutlineDiamond className="text-3xl text-gold-500" />,
  'photo-cakes':    <MdOutlineCelebration className="text-3xl text-rose-500" />,
  'cupcakes':       <span className="text-3xl">🧁</span>,
  'pastries':       <MdOutlineCardGiftcard className="text-3xl text-purple-500" />,
}

const DEFAULT_ICON = <HiOutlineCake className="text-3xl text-primary-500" />

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    setProducts([])

    // Pehle sabhi categories fetch karo slug se ID nikalne ke liye
    getCategories().then(({ data: categories }) => {
      // Slug match karke category dhundho
      const matched = categories.find(c => c.slug === slug)
      setCategoryInfo(matched || null)

      if (matched) {
        // Category ID se products filter karo — ye sahi tarika hai
        return getProducts({ category: matched._id, sort, limit: 20, page: 1 })
          .then(({ data }) => {
            setProducts(data.products)
            setTotal(data.total)
            setTotalPages(data.pages)
          })
      } else {
        // Agar DB mein category nahi mili toh naam se search karo
        const catName = slug.replace(/-/g, ' ')
        return getProducts({ search: catName, sort, limit: 20, page: 1 })
          .then(({ data }) => {
            setProducts(data.products)
            setTotal(data.total)
            setTotalPages(data.pages)
          })
      }
    }).finally(() => setLoading(false))
  }, [slug, sort])

  // Load more / pagination
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    getCategories().then(({ data: categories }) => {
      const matched = categories.find(c => c.slug === slug)
      const params = matched
        ? { category: matched._id, sort, limit: 20, page: nextPage }
        : { search: slug.replace(/-/g, ' '), sort, limit: 20, page: nextPage }
      return getProducts(params)
    }).then(({ data }) => {
      setProducts(prev => [...prev, ...data.products])
    })
  }

  // Display name — DB se mili info use karo, warna slug ko readable banao
  const displayName = categoryInfo?.name ||
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const icon = CAT_ICONS[slug] || DEFAULT_ICON

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-warm-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
        <FiChevronRight className="text-warm-300" />
        <Link to="/search" className="hover:text-primary-500 transition-colors">Categories</Link>
        <FiChevronRight className="text-warm-300" />
        <span className="text-warm-700 font-medium">{displayName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <div>
            <h1 className="section-title text-2xl md:text-3xl">{displayName}</h1>
            {categoryInfo?.description && (
              <p className="text-warm-400 text-sm mt-0.5">{categoryInfo.description}</p>
            )}
            <p className="text-warm-400 text-sm mt-0.5 flex items-center gap-1">
              <FiGrid className="text-primary-400" />
              {loading ? 'Loading...' : `${total} products`}
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-warm-400" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field py-2 w-44 text-sm"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-sold">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {loading
          ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
        }
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-display font-bold text-warm-700 mb-2">
            Koi product nahi mila
          </h3>
          <p className="text-warm-400 mb-6">
            "{displayName}" category mein abhi koi product nahi hai
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Home Par Jaayein
          </Link>
        </div>
      )}

      {/* Load More */}
      {!loading && products.length > 0 && page < totalPages && (
        <div className="text-center mt-10">
          <button onClick={loadMore} className="btn-outline inline-flex items-center gap-2">
            Aur Products Load Karein
          </button>
        </div>
      )}
    </div>
  )
}