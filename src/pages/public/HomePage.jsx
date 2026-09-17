import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getNewProducts, getFeaturedProducts, getProducts, getEvents, getCategories } from '../../utils/api'
import ProductCard from '../../components/shared/ProductCard'
import ProductSkeleton from '../../components/shared/ProductSkeleton'
import OffersSection from '../../components/shared/OffersSection'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

// Agar DB mein categories nahi mili toh ye fallback dikhaya jaata hai
const FALLBACK_CATEGORIES = [
  { name: 'Chocolate', slug: 'chocolate', icon: '🍫', color: 'from-rose-100 to-pink-200', type: 'flavor', order: 1 },
  { name: 'Vanilla', slug: 'vanilla', icon: '🍦', color: 'from-yellow-100 to-orange-200', type: 'flavor', order: 2 },
  { name: 'Red Velvet', slug: 'red-velvet', icon: '❤️', color: 'from-pink-100 to-red-200', type: 'flavor', order: 3 },
  { name: 'Black Forest', slug: 'black-forest', icon: '🍒', color: 'from-purple-100 to-violet-200', type: 'flavor', order: 4 },
  { name: 'Birthday Cakes', slug: 'birthday-cakes', icon: '🎂', color: 'from-gold-100 to-yellow-200', type: 'design', order: 1 },
  { name: 'Wedding Cakes', slug: 'wedding-cakes', icon: '💍', color: 'from-rose-100 to-pink-200', type: 'design', order: 2 },
  { name: 'Photo Cakes', slug: 'photo-cakes', icon: '🖼️', color: 'from-sky-100 to-blue-200', type: 'design', order: 3 },
  { name: 'Cupcakes', slug: 'cupcakes', icon: '🧁', color: 'from-pink-100 to-rose-200', type: 'design', order: 4 },
]

export default function HomePage() {
  const [newProducts, setNewProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [eventIdx, setEventIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const heroRef = useRef()
  const sectionsRef = useRef([])

  useEffect(() => {
    Promise.all([getNewProducts(), getFeaturedProducts(), getProducts({ limit: 24 }), getEvents(), getCategories()])
      .then(([n, f, a, e, c]) => {
        setNewProducts(n.data || [])
        setFeatured(f.data || [])
        setAllProducts(a.data?.products || [])
        setEvents(e.data || [])
        setCategories(c.data || [])
      })
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false))
  }, [])

  // GSAP scroll animations
  useEffect(() => {
    if (loading) return;

    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )

    sectionsRef.current.forEach(el => {
      if (!el) return
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [loading])

  // Auto-slide events
  useEffect(() => {
    if (!events.length) return
    const t = setInterval(() => setEventIdx(i => (i + 1) % events.length), 5000)
    return () => clearInterval(t)
  }, [events.length])

  // Categories ko flavor/design mein group karke number (1,2,3...) ke sath dikhate hain
  const activeCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES
  const flavorCategories = activeCategories.filter(c => c.type === 'flavor').sort((a, b) => (a.order || 0) - (b.order || 0))
  const designCategories = activeCategories.filter(c => c.type !== 'flavor').sort((a, b) => (a.order || 0) - (b.order || 0))

  const renderCategoryGrid = (list) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {list.map((cat, i) => (
        <motion.div key={cat._id || cat.slug} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="relative">
          <Link to={`/category/${cat.slug}`}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl bg-gradient-to-br ${cat.color || 'from-primary-50 to-gold-100'} shadow-sm hover:shadow-md transition-all text-center border border-white`}>
            <span className="absolute top-2 left-3 text-xs font-bold text-primary-500/70">{i + 1}</span>
            <span className="text-4xl">{cat.icon || '🎂'}</span>
            <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">{cat.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Events Banner */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-gold-600 text-white overflow-hidden min-h-[400px] flex items-center">
        {/* Background Decorative Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-gold-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
          {events.length > 0 ? (
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={eventIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col md:flex-row items-center gap-10"
                >
                  {events[eventIdx]?.image && (
                    <div className="w-full md:w-1/2">
                      <img src={events[eventIdx].image} alt={events[eventIdx].title}
                        className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-2xl border-4 border-white/20" />
                    </div>
                  )}
                  <div className="w-full md:w-1/2 text-left">
                    <span className="bg-gold-400 text-warm-900 text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider">Special Occasion</span>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight">
                      {events[eventIdx]?.title}
                    </h1>
                    <p className="text-white/90 text-lg mb-8 max-w-lg leading-relaxed">
                      {events[eventIdx]?.description}
                    </p>
                    <Link to="/search" className="bg-white text-primary-600 font-bold px-10 py-4 rounded-full hover:scale-105 transition-all shadow-xl inline-flex items-center gap-3">
                      Shop Now <FiArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {events.length > 1 && (
                <div className="flex items-center gap-3 mt-10">
                  <button onClick={() => setEventIdx(i => (i - 1 + events.length) % events.length)} className="p-3 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-md transition-colors"><FiChevronLeft /></button>
                  <div className="flex gap-2">
                    {events.map((_, i) => (
                      <button key={i} onClick={() => setEventIdx(i)} className={`h-2 rounded-full transition-all duration-300 ${i === eventIdx ? 'bg-white w-8' : 'bg-white/40 w-2'}`} />
                    ))}
                  </div>
                  <button onClick={() => setEventIdx(i => (i + 1) % events.length)} className="p-3 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-md transition-colors"><FiChevronRight /></button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <h1 className="font-display text-5xl md:text-7xl font-black mb-6">Cake Hamper Sisters 🎂</h1>
              <p className="text-white/90 text-xl mb-10">Aapke khaas pal, hamare khaas cakes</p>
              <Link to="/search" className="bg-white text-primary-600 font-bold px-10 py-4 rounded-full hover:bg-gold-400 hover:text-white transition-all shadow-2xl inline-flex items-center gap-3">
                Sabhi Cakes Dekhein <FiArrowRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Offers - Diwali, Holi, Birthday, New Year discounts */}
      <OffersSection />

      {/* Flavors */}
      <section ref={el => sectionsRef.current[0] = el} className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Flavors Chunein</h2>
          <Link to="/search" className="text-primary-600 font-semibold flex items-center gap-2 hover:underline">View All <FiArrowRight /></Link>
        </div>
        {renderCategoryGrid(flavorCategories.length ? flavorCategories : FALLBACK_CATEGORIES.filter(c => c.type === 'flavor'))}
      </section>

      {/* Designs / Occasions */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Design & Occasion</h2>
        </div>
        {renderCategoryGrid(designCategories.length ? designCategories : FALLBACK_CATEGORIES.filter(c => c.type !== 'flavor'))}
      </section>

      {/* New Products */}
      {(newProducts.length > 0 || loading) && (
        <section ref={el => sectionsRef.current[1] = el} className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Naye Cakes ✨</h2>
            <p className="text-gray-500 mt-2">Hamari latest collection dekhiye</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />) :
              newProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Custom Cake Order Banner */}
      <section ref={el => sectionsRef.current[2] = el} className="mx-4 my-16 md:mx-auto max-w-7xl bg-gradient-to-br from-primary-600 to-gold-600 rounded-[2rem] overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 transform translate-x-20" />
        <div className="px-8 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="text-center md:text-left">
            <div className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4">Custom Cake</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Apni Pasand Ka Cake Banwayein</h2>
            <p className="text-white/90 text-lg mb-10 max-w-md">Apne pasandida cake ki reference photo bhejein — hum bilkul waisa hi khoobsurat cake bana denge!</p>
            <Link to="/contact?type=order" className="bg-white text-primary-600 font-bold px-10 py-4 rounded-full hover:bg-warm-50 transition-colors inline-flex items-center gap-3">
              Custom Cake Order Karo <FiArrowRight />
            </Link>
          </div>
          <div className="text-9xl animate-bounce duration-[3000ms] hidden md:block">🎂</div>
        </div>
      </section>

      {/* All Products */}
      <section ref={el => sectionsRef.current[3] = el} className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Hamare Cakes</h2>
            <p className="text-gray-500 mt-2">Sabhi behtareen cakes ek jagah</p>
          </div>
          <Link to="/search" className="text-primary-600 font-semibold flex items-center gap-2 hover:underline">Sab Dekhein <FiArrowRight /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {loading ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />) :
            allProducts.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
        {!loading && (
          <div className="text-center mt-16">
            <Link to="/search" className="border-2 border-primary-600 text-primary-600 font-bold px-10 py-3 rounded-full hover:bg-primary-600 hover:text-white transition-all inline-flex items-center gap-3">
              Aur Cakes Dekhein <FiArrowRight />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
