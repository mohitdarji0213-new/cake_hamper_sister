import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiX } from 'react-icons/fi'

// Admin login/panel open hote hi ye check karta hai ki browser notifications
// enable hai ya nahi. Agar disable hai toh popup dikhata hai enable karne ke liye.
export default function NotificationPermissionModal({ onEnable, onDismiss }) {
  const [requesting, setRequesting] = useState(false)

  const handleEnable = async () => {
    setRequesting(true)
    try {
      const result = await Notification.requestPermission()
      onEnable(result === 'granted')
    } finally {
      setRequesting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center relative"
        >
          <button onClick={onDismiss} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-warm-100 text-warm-400">
            <FiX />
          </button>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBell className="text-white text-2xl" />
          </div>
          <h3 className="font-display font-bold text-lg text-warm-900 mb-2">
            Order Notifications Enable Karein
          </h3>
          <p className="text-sm text-warm-500 mb-6">
            Jab bhi koi naya order ya custom cake request aaye, aapko turant browser
            notification mil jayegi. Miss nahi hoga koi bhi order! 🎂
          </p>
          <button
            onClick={handleEnable}
            disabled={requesting}
            className="btn-primary w-full mb-2"
          >
            {requesting ? 'Requesting...' : 'Notifications Enable Karein'}
          </button>
          <button onClick={onDismiss} className="text-sm text-warm-400 hover:text-warm-600">
            Baad mein karunga
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
