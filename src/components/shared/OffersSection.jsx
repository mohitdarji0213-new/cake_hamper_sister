import { useState, useEffect, useRef } from 'react'
import { getOffers } from '../../utils/api'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const OCCASION_STYLE = {
  diwali:    { emoji: '🪔', label: 'Diwali',    gradient: 'from-amber-500 to-primary-600' },
  holi:      { emoji: '🎨', label: 'Holi',      gradient: 'from-primary-500 to-purple-500' },
  birthday:  { emoji: '🎂', label: 'Birthday',  gradient: 'from-primary-500 to-gold-500' },
  new_year:  { emoji: '🎉', label: 'New Year',  gradient: 'from-gold-500 to-primary-600' },
  christmas: { emoji: '🎄', label: 'Christmas', gradient: 'from-green-600 to-primary-600' },
  valentine: { emoji: '❤️', label: 'Valentine', gradient: 'from-primary-400 to-primary-700' },
  other:     { emoji: '✨', label: 'Special',   gradient: 'from-primary-500 to-gold-500' },
}

const AUTOPLAY_MS = 4500

const fmtDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.toLocaleString('en-IN', { day: 'numeric' })} ${dt.toLocaleString('en-IN', { month: 'short' })}`
}

const dateLine = (o) => {
  if (o.validFrom && o.validTill) return `${fmtDate(o.validFrom)}  →  ${fmtDate(o.validTill)}`
  if (o.validFrom) return `${fmtDate(o.validFrom)} se`
  if (o.validTill) return `${fmtDate(o.validTill)} tak`
  return ''
}

// Homepage par offers ek automatic + manual carousel mein dikhte hain
// - har 4.5 sec mein khud slide hota hai
// - left/right buttons ya dots se bhi change hota hai
// - hover karne par autoplay ruk jaata hai, mobile par swipe bhi chalta hai
export default function OffersSection() {
  const [offers, setOffers] = useState([])
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const swipeStart = useRef(null)

  useEffect(() => {
    getOffers().then(({ data }) => setOffers(data)).catch(() => {})
  }, [])

  const count = offers.length
  const prev = () => { if (count > 1) setIdx((idx - 1 + count) % count) }
  const next = () => { if (count > 1) setIdx((idx + 1) % count) }

  // Automatic slide
  useEffect(() => {
    if (count <= 1 || paused) return
    const t = setInterval(() => setIdx(i => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [count, paused])

  if (count === 0) return null

  const renderContent = (o, style) => (
    <>
      <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start">
        {style.emoji} {style.label}
      </span>
      <h3 className="font-display font-bold text-2xl leading-snug mt-2">{o.title}</h3>
      {o.description && <p className="text-white/90 text-sm md:text-base leading-relaxed mt-2 line-clamp-3">{o.description}</p>}
      {dateLine(o) && <p className="text-white/75 text-xs font-medium mt-2">🗓️ {dateLine(o)}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <span className="text-3xl md:text-4xl font-black">{o.discountPercent}% <span className="text-white/85 text-base font-bold">OFF</span></span>
        {o.code && (
          <span className="font-mono text-xs md:text-sm bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/30">
            Code: {o.code}
          </span>
        )}
      </div>
    </>
  )

  const renderCard = (o) => {
    const style = OCCASION_STYLE[o.occasion] || OCCASION_STYLE.other
    if (o.image && o.description) {
      return (
        <div className="rounded-3xl border border-warm-100 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row h-80 md:h-96">
          <div className="md:w-1/2 h-44 sm:h-56 md:h-full overflow-hidden flex-shrink-0">
            <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
          </div>
          <div className={`flex flex-col px-6 py-5 md:px-8 text-white bg-gradient-to-br ${style.gradient}`}>
            {renderContent(o, style)}
          </div>
        </div>
      )
    }
    if (o.image) {
      return (
        <div className="rounded-3xl shadow-2xl overflow-hidden relative h-80 md:h-96">
          <img src={o.image} alt={o.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-75`} />
          <div className="relative z-10 flex flex-col px-6 py-5 md:px-8 text-white">
            {renderContent(o, style)}
          </div>
        </div>
      )
    }
    return (
      <div className={`rounded-3xl shadow-2xl px-6 py-5 md:px-8 text-white bg-gradient-to-br ${style.gradient} relative overflow-hidden h-80 md:h-96`}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-16 pointer-events-none" />
        {renderContent(o, style)}
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-title text-2xl md:text-3xl">🎁 Special Offers</h2>
        {count > 1 && (
          <span className="text-xs md:text-sm font-bold text-warm-500 bg-warm-100 px-3 py-1 rounded-full">
            {idx + 1} / {count}
          </span>
        )}
      </div>
      <p className="text-warm-400 text-sm mt-1 mb-6">Diwali, Holi, Birthday, New Year jaise occasions par khaas chhut</p>

      <div
        className="relative group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {count > 1 && (
          <button
            onClick={prev}
            aria-label="Previous offer"
            className="absolute left-2 md:-left-4 z-10 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-white/90 text-primary-600 shadow-lg hover:scale-110 hover:bg-white border border-primary-100 transition-all"
          >
            <FiChevronLeft size={20} />
          </button>
        )}

        <div
          className="overflow-hidden rounded-3xl shadow-xl border border-warm-100"
          onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (swipeStart.current === null) return
            const dx = e.changedTouches[0].clientX - swipeStart.current
            if (dx > 45) prev()
            if (dx < -45) next()
            swipeStart.current = null
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {offers.map((o) => (
              <div key={o._id} className="w-full flex-shrink-0 flex items-stretch justify-center px-1">
                {renderCard(o)}
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <button
            onClick={next}
            aria-label="Next offer"
            className="absolute right-2 md:-right-4 z-10 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-white/90 text-primary-600 shadow-lg hover:scale-110 hover:bg-white border border-primary-100 transition-all"
          >
            <FiChevronRight size={20} />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {offers.map((o, i) => (
            <button
              key={o._id}
              onClick={() => setIdx(i)}
              aria-label={`Go to offer ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'bg-primary-600 w-8' : 'bg-primary-200 w-2 hover:bg-primary-400'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
