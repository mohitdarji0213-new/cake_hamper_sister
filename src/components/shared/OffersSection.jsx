import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getOffers } from '../../utils/api'

const OCCASION_STYLE = {
  diwali:    { emoji: '🪔', gradient: 'from-amber-500 to-primary-600' },
  holi:      { emoji: '🎨', gradient: 'from-primary-500 to-purple-500' },
  birthday:  { emoji: '🎂', gradient: 'from-primary-500 to-gold-500' },
  new_year:  { emoji: '🎉', gradient: 'from-gold-500 to-primary-600' },
  christmas: { emoji: '🎄', gradient: 'from-green-600 to-primary-600' },
  valentine: { emoji: '❤️', gradient: 'from-primary-400 to-primary-700' },
  other:     { emoji: '✨', gradient: 'from-primary-500 to-gold-500' },
}

// Diwali, Holi, Birthday, New Year jaise occasions par chalne wale offers
// homepage par yahan dikhte hain — agar admin ne koi active offer banaya hai
export default function OffersSection() {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    getOffers().then(({ data }) => setOffers(data)).catch(() => {})
  }, [])

  if (offers.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">🎁 Special Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((o, i) => {
          const style = OCCASION_STYLE[o.occasion] || OCCASION_STYLE.other
          return (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${style.gradient} relative overflow-hidden`}
            >
              <div className="text-4xl mb-3">{style.emoji}</div>
              <h3 className="font-display font-bold text-xl mb-1">{o.title}</h3>
              {o.description && <p className="text-white/90 text-sm mb-3">{o.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black">{o.discountPercent}% OFF</span>
                {o.code && (
                  <span className="font-mono text-xs bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {o.code}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
