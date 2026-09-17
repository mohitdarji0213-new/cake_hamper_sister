import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getStats } from '../../utils/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts'
import { FiPackage, FiShoppingBag, FiMessageSquare, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

const COLORS = ['#ef3d70', '#f4c542', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getStats()
      .then(({ data }) => setStats(data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login')
        } else {
          setError('Stats load nahi ho sake. Backend check karein.')
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-500 gap-2">
      <FiAlertCircle className="text-2xl" />
      <span>{error}</span>
    </div>
  )

  const monthlyData = Object.entries(stats?.monthlyRevenue || {}).map(([month, revenue]) => ({ month, revenue }))
  const orderStatusData = Object.entries(stats?.orderStatusCounts || {}).map(([name, value]) => ({ name, value }))
  const topProductsData = (stats?.topProducts || []).map(p => ({ name: p.name.slice(0, 15), sold: p.sold }))
  const tagSalesData = Object.entries(stats?.tagSales || {}).slice(0, 8).map(([tag, count]) => ({ tag, count }))

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts, icon: <FiPackage />, color: 'from-primary-400 to-primary-600', link: '/admin/products' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: <FiShoppingBag />, color: 'from-blue-400 to-blue-600', link: '/admin/orders' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: <FiTrendingUp />, color: 'from-green-400 to-green-600', link: '/admin/stats' },
    { label: 'Unread Messages', value: stats?.unreadContacts, icon: <FiMessageSquare />, color: 'from-gold-400 to-orange-500', link: '/admin/contacts' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={s.link} className={`block p-5 rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
              <div className="text-white/70 text-2xl mb-2">{s.icon}</div>
              <div className="font-bold text-2xl">{s.value}</div>
              <div className="text-white/80 text-sm mt-0.5">{s.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#ef3d70" strokeWidth={2.5} dot={{ fill: '#ef3d70', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProductsData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="sold" fill="#ef3d70" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">Sales by Tags</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tagSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
              <XAxis dataKey="tag" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {tagSalesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/admin/products', label: '+ New Cake', color: 'bg-primary-500 text-white' },
          { to: '/admin/categories', label: '+ New Category', color: 'bg-gold-500 text-white' },
          { to: '/admin/orders', label: 'View Orders', color: 'bg-blue-500 text-white' },
          { to: '/admin/offers', label: '+ New Offer', color: 'bg-purple-500 text-white' },
          { to: '/admin/issues', label: 'View Issues', color: 'bg-red-500 text-white' },
        ].map(l => (
          <Link key={l.to} to={l.to} className={`${l.color} text-center py-3 px-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-md`}>{l.label}</Link>
        ))}
      </div>
    </div>
  )
}