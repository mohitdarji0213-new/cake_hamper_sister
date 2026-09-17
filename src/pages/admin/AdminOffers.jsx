import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllOffers, createOffer, updateOffer, deleteOffer } from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiX, FiTag, FiUpload } from 'react-icons/fi'

const OCCASIONS = [
  { value: 'diwali', label: '🪔 Diwali' },
  { value: 'holi', label: '🎨 Holi' },
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'new_year', label: '🎉 New Year' },
  { value: 'christmas', label: '🎄 Christmas' },
  { value: 'valentine', label: '❤️ Valentine' },
  { value: 'other', label: '✨ Other' },
]

const emptyForm = () => ({
  title: '',
  description: '',
  occasion: 'diwali',
  discountPercent: '',
  code: '',
  validFrom: '',
  validTill: '',
})

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export default function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const load = () => {
    getAllOffers().then(({ data }) => setOffers(data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      await createOffer(fd)
      toast.success('Offer add ho gaya! 🎉')
      setShowForm(false)
      setForm(emptyForm())
      setImage(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding offer')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (offer) => {
    try {
      await updateOffer(offer._id, { isActive: !offer.isActive })
      toast.success(offer.isActive ? 'Offer disable ho gaya 🚫' : 'Offer activate ho gaya ✅')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status change fail ho gaya')
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" offer delete karein?`)) return
    await deleteOffer(id)
    toast.success('Offer delete ho gaya')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">Special Offers</h1>
          <p className="text-warm-400 text-sm">Diwali, Holi, Birthday, New Year jaise occasions par chhut dein</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><FiPlus /> New Offer</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-warm-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Naya Offer Banayein</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-warm-100"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Offer Title *</label>
                  <input className="input-field" placeholder="Diwali Dhamaka - Cakes par Chhut" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Occasion *</label>
                  <select className="input-field" value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))} required>
                    {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Discount (%) *</label>
                  <input className="input-field" type="number" min="1" max="90" placeholder="20" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Coupon Code (optional)</label>
                  <input className="input-field" placeholder="DIWALI20" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Start Date (Shuruaat)</label>
                  <input className="input-field" type="date" value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} />
                  <p className="text-xs text-warm-400 mt-1">Khali chhodein = aaj se shuru. Kal/parso se shuru karne ke liye woh date daalein.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Last Date (Valid Till)</label>
                  <input className="input-field" type="date" value={form.validTill} onChange={e => setForm(f => ({ ...f, validTill: e.target.value }))} />
                  <p className="text-xs text-warm-400 mt-1">Khali chhodein = koi aakhri tarikh nahi.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-1 block">Description</label>
                  <textarea rows={3} className="input-field resize-none" placeholder="Is Diwali apne pyaaro ko banaye cake ka tohfa, sabhi cakes par 20% chhut!" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-warm-700 mb-2 block">Offer Image (optional)</label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-warm-200 rounded-xl p-4 cursor-pointer hover:border-primary-400">
                    <FiUpload className="text-warm-400" />
                    <span className="text-sm text-warm-400">{image ? image.name : 'Image select karein — home page par half-side / background dikhegi'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  </label>
                  {image && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={URL.createObjectURL(image)} alt="preview" className="w-14 h-14 rounded-lg object-cover" />
                      <span className="text-xs text-green-600">Preview ready ✓</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiTag />}
                  {submitting ? 'Adding...' : 'Offer Add Karein'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(o => (
          <div key={o._id} className={`bg-white rounded-2xl p-5 shadow-sm border ${o.isActive ? 'border-primary-200' : 'border-warm-100 opacity-60'}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                {OCCASIONS.find(x => x.value === o.occasion)?.label || o.occasion}
              </span>
              <button onClick={() => handleDelete(o._id, o.title)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
            </div>
            {o.image && <img src={o.image} alt={o.title} className="w-full h-36 object-cover rounded-xl mb-3" />}
            <h3 className="font-display font-bold text-warm-900 mb-1">{o.title}</h3>
            <p className="text-sm text-warm-400 mb-2 line-clamp-2">{o.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-2xl text-primary-600">{o.discountPercent}% OFF</span>
              {o.code && <span className="font-mono text-xs bg-warm-100 px-2 py-1 rounded-lg">{o.code}</span>}
            </div>
            <p className="text-xs text-warm-400 mt-2">
              🗓️ {o.validFrom || o.validTill
                ? `${o.validFrom ? `${fmtDate(o.validFrom)} se` : 'Abhi se'}${o.validTill ? ` ${fmtDate(o.validTill)} tak` : ' — koi limit nahi'}`
                : 'Koi time limit nahi'}
            </p>
            <button onClick={() => toggleActive(o)} className={`mt-3 w-full text-xs font-semibold py-2 rounded-lg ${o.isActive ? 'bg-green-50 text-green-600' : 'bg-warm-100 text-warm-500'}`}>
              {o.isActive ? 'Active — click to disable' : 'Inactive — click to enable'}
            </button>
          </div>
        ))}
        {!loading && offers.length === 0 && (
          <div className="col-span-full text-center py-12 text-warm-400">Koi offer nahi hai. Pehla offer add karein!</div>
        )}
      </div>
    </div>
  )
}
