import { useState, useEffect } from 'react'
import { getContacts, markContactRead, resolveContact } from '../../utils/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiCheck, FiCheckCircle, FiAlertCircle, FiMail, FiPhone } from 'react-icons/fi'

export default function AdminIssues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => getContacts({ type: 'issue' }).then(({ data }) => setIssues(data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = issues.filter(i => filter === 'all' ? true : filter === 'unread' ? !i.isRead : filter === 'resolved' ? i.isResolved : !i.isResolved)

  const handleRead = async (id) => { await markContactRead(id); toast.success('Marked as read'); load() }
  const handleResolve = async (id) => { await resolveContact(id); toast.success('Issue resolved!'); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900 flex items-center gap-2"><FiAlertCircle className="text-red-500" /> Customer Issues</h1>
          <p className="text-warm-400 text-sm">{issues.filter(i => !i.isRead).length} unread, {issues.filter(i => !i.isResolved).length} pending</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field py-2 w-36">
          <option value="all">All Issues</option>
          <option value="unread">Unread</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((issue, i) => (
          <motion.div key={issue._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${issue.isResolved ? 'border-green-400' : issue.isRead ? 'border-yellow-400' : 'border-red-500'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-warm-900">{issue.name}</span>
                  {!issue.isRead && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">🔴 New Issue</span>}
                  {issue.isResolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Resolved</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-warm-400 mb-2">
                  <span className="flex items-center gap-1"><FiMail /> {issue.email}</span>
                  {issue.phone && <span className="flex items-center gap-1"><FiPhone /> {issue.phone}</span>}
                </div>
                {issue.subject && <div className="text-sm font-semibold text-red-600 mb-1">⚠️ {issue.subject}</div>}
                <p className="text-sm text-warm-600 leading-relaxed">{issue.message}</p>
                <div className="text-xs text-warm-300 mt-2">{new Date(issue.createdAt).toLocaleString('en-IN')}</div>
              </div>
              <div className="flex flex-col gap-2">
                {!issue.isRead && (
                  <button onClick={() => handleRead(issue._id)} className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap">
                    <FiCheck /> Mark Read
                  </button>
                )}
                {!issue.isResolved && (
                  <button onClick={() => handleResolve(issue._id)} className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors whitespace-nowrap">
                    <FiCheckCircle /> Resolve
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-warm-400">
            <FiAlertCircle className="text-4xl mx-auto mb-3 text-warm-200" />
            Koi issue nahi hai — sab theek hai! 🎉
          </div>
        )}
      </div>
    </div>
  )
}
