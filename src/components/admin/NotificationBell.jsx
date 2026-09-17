import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiBell, FiShoppingBag, FiImage } from 'react-icons/fi'
import { getNotificationSummary, markAllOrdersSeen } from '../../utils/api'

const POLL_INTERVAL = 20000 // 20 second — order aane par admin ko pata chal jaye

// Admin ke liye notification service: har 20 second mein naye orders/custom
// cake requests check karta hai. Naya order aane par badge + toast +
// browser notification (agar permission enabled hai) dikhata hai.
export default function NotificationBell() {
  const [summary, setSummary] = useState({ unseenOrders: 0, unreadCustomOrders: 0, unreadIssues: 0, total: 0, latestOrder: null })
  const [open, setOpen] = useState(false)
  const lastTotalRef = useRef(null)
  const dropdownRef = useRef()

  const fetchSummary = async () => {
    try {
      const { data } = await getNotificationSummary()
      // Pehli baar total set karo, warna compare karke naye order ka pata lagao
      if (lastTotalRef.current !== null && data.total > lastTotalRef.current) {
        const newCount = data.total - lastTotalRef.current
        toast.success(`🎂 ${newCount} naya order/request aaya hai!`)
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Cake Hamper Sisters - Naya Order! 🎂', {
            body: data.latestOrder
              ? `${data.latestOrder.customer?.name || 'Customer'} ne ₹${data.latestOrder.totalAmount} ka order diya hai.`
              : 'Ek naya order ya custom cake request aaya hai.',
            icon: '/favicon.svg',
          })
        }
      }
      lastTotalRef.current = data.total
      setSummary(data)
    } catch {
      // notification fetch fail ho toh chup-chaap ignore karo
    }
  }

  useEffect(() => {
    fetchSummary()
    const interval = setInterval(fetchSummary, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClearOrders = async () => {
    await markAllOrdersSeen()
    fetchSummary()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-warm-100 text-warm-600 transition-colors"
      >
        <FiBell className="text-xl" />
        {summary.total > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
          >
            {summary.total > 9 ? '9+' : summary.total}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-warm-100 overflow-hidden z-50"
          >
            <div className="p-3 border-b border-warm-100 flex items-center justify-between">
              <span className="font-semibold text-sm text-warm-900">Notifications</span>
              {summary.unseenOrders > 0 && (
                <button onClick={handleClearOrders} className="text-xs text-primary-500 hover:underline">
                  Clear orders
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {summary.unseenOrders > 0 && (
                <Link to="/admin/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 p-3 hover:bg-warm-50 border-b border-warm-50">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600"><FiShoppingBag /></div>
                  <div className="text-sm text-warm-800">{summary.unseenOrders} naya order aaya hai</div>
                </Link>
              )}
              {summary.unreadCustomOrders > 0 && (
                <Link to="/admin/contacts" onClick={() => setOpen(false)} className="flex items-center gap-3 p-3 hover:bg-warm-50 border-b border-warm-50">
                  <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center text-gold-600"><FiImage /></div>
                  <div className="text-sm text-warm-800">{summary.unreadCustomOrders} custom cake request</div>
                </Link>
              )}
              {summary.unreadIssues > 0 && (
                <Link to="/admin/issues" onClick={() => setOpen(false)} className="flex items-center gap-3 p-3 hover:bg-warm-50">
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-500">!</div>
                  <div className="text-sm text-warm-800">{summary.unreadIssues} customer issue</div>
                </Link>
              )}
              {summary.total === 0 && (
                <div className="p-6 text-center text-sm text-warm-400">Koi naya notification nahi hai 🎉</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
