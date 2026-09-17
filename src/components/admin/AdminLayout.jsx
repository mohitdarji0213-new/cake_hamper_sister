import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiPackage, FiGrid, FiShoppingBag, FiMessageSquare,
  FiAlertCircle, FiBarChart2, FiMenu, FiX, FiLogOut, FiTag
} from 'react-icons/fi'
import { HiOutlineCake } from 'react-icons/hi'
import NotificationBell from './NotificationBell'
import NotificationPermissionModal from './NotificationPermissionModal'
import { setNotificationPref } from '../../utils/api'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome /> },
  { to: '/admin/products', label: 'Cakes', icon: <FiPackage /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiGrid /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/admin/contacts', label: 'Custom Cake Orders', icon: <FiMessageSquare /> },
  { to: '/admin/offers', label: 'Offers', icon: <FiTag /> },
  { to: '/admin/issues', label: 'Issues', icon: <FiAlertCircle /> },
  { to: '/admin/stats', label: 'Statistics', icon: <FiBarChart2 /> },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifPopup, setShowNotifPopup] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Admin panel mein aate hi har baar check karo ki browser notifications
  // enable hain ya nahi. Agar hai toh kuch nahi, nahi toh popup dikhao.
  useEffect(() => {
    if (typeof Notification === 'undefined') return // browser support nahi karta
    if (Notification.permission === 'granted') {
      setNotificationPref({ notificationsEnabled: true }).catch(() => {})
      return
    }
    // 'default' (kabhi puchha nahi) ya 'denied' — dono cases mein popup dikhao
    setShowNotifPopup(true)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <HiOutlineCake className="text-white text-xl" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">Cake Hamper Sisters</div>
            <div className="text-xs text-white/60">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              (item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to))
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}>
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="text-white/50 text-xs">Administrator</div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-warm-50 overflow-hidden">
      {showNotifPopup && (
        <NotificationPermissionModal
          onEnable={(granted) => {
            setNotificationPref({ notificationsEnabled: granted }).catch(() => {})
            setShowNotifPopup(false)
          }}
          onDismiss={() => setShowNotifPopup(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-gradient-to-b from-primary-600 to-primary-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-gradient-to-b from-primary-600 to-primary-800 lg:hidden">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm flex items-center justify-between px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-warm-100 text-warm-700">
              <FiMenu className="text-xl" />
            </button>
            <div>
              <div className="font-display font-bold text-warm-900 text-sm">
                {navItems.find(n => n.to === location.pathname || (n.to !== '/admin' && location.pathname.startsWith(n.to)))?.label || 'Dashboard'}
              </div>
              <div className="text-xs text-warm-400">Cake Hamper Sisters</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link to="/" className="text-xs text-primary-500 hover:underline">View Site</Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
