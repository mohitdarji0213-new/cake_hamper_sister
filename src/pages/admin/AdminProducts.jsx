import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct, deleteProduct } from '../../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUpload } from 'react-icons/fi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: '', tags: '', stock: '', isNew: false, isFeatured: false })
  const [images, setImages] = useState([])

  const load = () => {
    Promise.all([getProducts({ limit: 100 }), getCategories()])
      .then(([p, c]) => { setProducts(p.data.products); setCategories(c.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img))
      await createProduct(fd)
      toast.success('Product upload ho gaya! ✅')
      setShowForm(false)
      setForm({ name: '', description: '', price: '', originalPrice: '', category: '', tags: '', stock: '', isNew: false, isFeatured: false })
      setImages([])
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" delete karein?`)) return
    await deleteProduct(id)
    toast.success('Product delete ho gaya')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">Products</h1>
          <p className="text-warm-400 text-sm">{products.length} total products</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><FiPlus /> New Product</button>
      </div>

      {/* Product Upload Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-warm-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Naya Product Upload</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-warm-100"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Product Name *</label>
                  <input className="input-field" placeholder="Chocolate Truffle Birthday Cake" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Price (₹) *</label>
                  <input className="input-field" type="number" placeholder="499" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Original Price (₹)</label>
                  <input className="input-field" type="number" placeholder="699 (for showing discount)" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Category *</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Stock</label>
                  <input className="input-field" type="number" placeholder="10" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Tags (comma separated)</label>
                  <input className="input-field" placeholder="chocolate, birthday, eggless, photo-cake" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Description *</label>
                  <textarea rows={4} className="input-field resize-none" placeholder="Product description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-2 block">Images (max 5)</label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-warm-200 rounded-xl p-6 cursor-pointer hover:border-primary-400 transition-colors">
                    <FiUpload className="text-2xl text-warm-400" />
                    <span className="text-sm text-warm-500">Images choose karein</span>
                    <input type="file" multiple accept="image/*" className="hidden"
                      onChange={e => setImages(Array.from(e.target.files).slice(0, 5))} />
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {images.map((img, i) => (
                        <img key={i} src={URL.createObjectURL(img)} className="w-14 h-14 rounded-lg object-cover border-2 border-primary-200" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-warm-700">Mark as New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-warm-700">Featured</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiUpload />}
                  {submitting ? 'Uploading...' : 'Product Upload Karein'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50 border-b border-warm-100">
              <tr>
                <th className="text-left p-4 font-semibold text-warm-700">Product</th>
                <th className="text-left p-4 font-semibold text-warm-700 hidden md:table-cell">Category</th>
                <th className="text-left p-4 font-semibold text-warm-700">Price</th>
                <th className="text-left p-4 font-semibold text-warm-700 hidden sm:table-cell">Stock</th>
                <th className="text-left p-4 font-semibold text-warm-700 hidden lg:table-cell">Sold</th>
                <th className="text-left p-4 font-semibold text-warm-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-warm-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <div className="font-medium text-warm-900 line-clamp-1">{p.name}</div>
                        <div className="flex gap-1 mt-0.5">
                          {p.isNew && <span className="badge-new text-xs">NEW</span>}
                          {p.isFeatured && <span className="text-xs bg-gold-100 text-gold-700 px-1.5 rounded-full font-medium">FEATURED</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-warm-500 hidden md:table-cell">{p.category?.name}</td>
                  <td className="p-4 font-bold text-primary-600">₹{p.price}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`text-xs font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.stock}</span>
                  </td>
                  <td className="p-4 text-warm-500 hidden lg:table-cell">{p.sold}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-warm-400">Koi product nahi hai. Pehla product add karein!</div>
          )}
        </div>
      </div>
    </div>
  )
}
