import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../../utils/api'
import ProductCard from '../../components/shared/ProductCard'
import ProductSkeleton from '../../components/shared/ProductSkeleton'
import { FiSearch } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    getProducts({ search: q, tag, sort, limit: 20, page: 1 }).then(({ data }) => {
      setProducts(data.products)
      setTotal(data.total)
    }).finally(() => setLoading(false))
  }, [q, tag, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-2 sm:p-4 mb-8">
        <form onSubmit={e => { e.preventDefault(); const f = new FormData(e.target); setSearchParams({ q: f.get('q') }); }}>
          <div className="flex gap-3 w-full">
            <div className="flex-1 shrink min-w-0 flex items-center gap-2 bg-warm-50 rounded-xl px-4 py-2">
              <FiSearch className="text-warm-400" />
              <input name="q" defaultValue={q} placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-warm-900 placeholder-warm-300" />
            </div>
            <button type="submit" className="btn-primary rounded-xl px-3 py-2 lg:px-6">Search</button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-2xl">
            {q ? `Results for "${q}"` : tag ? `#${tag}` : 'All Products'}
          </h1>
          {!loading && <p className="text-warm-400 text-sm mt-1">{total} products found</p>}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-2 w-44">
          <option value="-createdAt">Newest</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="-sold">Popular</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {loading ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />) :
          products.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <FiSearch className="text-6xl text-warm-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-warm-700">Koi result nahi mila</h3>
          <p className="text-warm-400 mt-2">Koi aur keyword try karein</p>
        </div>
      )}
    </div>
  )
}
