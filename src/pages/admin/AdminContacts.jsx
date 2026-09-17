import { useState, useEffect } from 'react'
import { getContacts, markContactRead, resolveContact } from '../../utils/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiCheck, FiCheckCircle, FiMail, FiPhone } from 'react-icons/fi'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => getContacts({ type: 'order_inquiry' }).then(({ data }) => setContacts(data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleRead = async (id) => {
    await markContactRead(id)
    toast.success('Marked as read')
    load()
  }

  const handleResolve = async (id) => {
    await resolveContact(id)
    toast.success('Resolved!')
    load()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-warm-900">🎂 Custom Cake Orders</h1>
        <p className="text-warm-400 text-sm">{contacts.filter(c => !c.isRead).length} unread</p>
      </div>

      <div className="space-y-4">
        {contacts.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${c.isRead ? 'border-warm-200' : 'border-primary-500'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-warm-900">{c.name}</span>
                  {!c.isRead && <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">New</span>}
                  {c.isResolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Resolved</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-warm-400 mb-2">
                  <span className="flex items-center gap-1"><FiMail /> {c.email}</span>
                  {c.phone && <span className="flex items-center gap-1"><FiPhone /> {c.phone}</span>}
                </div>
                {c.subject && <div className="text-sm font-medium text-warm-700 mb-1">📋 {c.subject}</div>}
                <p className="text-sm text-warm-600 leading-relaxed">{c.message}</p>
                {c.image && (
                  <a href={c.image} target="_blank" rel="noreferrer" className="inline-block mt-2">
                    <img src={c.image} alt="Reference cake" className="w-24 h-24 rounded-xl object-cover border-2 border-primary-200 hover:opacity-80 transition-opacity" />
                  </a>
                )}
                <div className="text-xs text-warm-300 mt-2">{new Date(c.createdAt).toLocaleString('en-IN')}</div>
              </div>
              <div className="flex flex-col gap-2">
                {!c.isRead && (
                  <button onClick={() => handleRead(c._id)} className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                    <FiCheck /> Mark Read
                  </button>
                )}
                {!c.isResolved && (
                  <button onClick={() => handleResolve(c._id)} className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
                    <FiCheckCircle /> Resolve
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {!loading && contacts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-warm-400">Koi order inquiry nahi hai</div>
        )}
      </div>
    </div>
  )
}
