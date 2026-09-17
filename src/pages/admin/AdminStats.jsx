import { useState, useEffect } from 'react'
import { getStats } from '../../utils/api'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#ef3d70', '#f4c542', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']

export default function AdminStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(({ data }) => setStats(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const monthlyData = Object.entries(stats?.monthlyRevenue || {}).map(([month, revenue]) => ({ month, revenue }))
  const orderStatusData = Object.entries(stats?.orderStatusCounts || {}).map(([name, value]) => ({ name, value }))
  const topProductsData = (stats?.topProducts || []).map(p => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name, sold: p.sold }))
  const tagSalesData = Object.entries(stats?.tagSales || {}).sort(([,a],[,b]) => b-a).slice(0, 10).map(([tag, count]) => ({ tag, count }))
  const categorySalesData = Object.entries(stats?.categorySales || {}).map(([id, count]) => ({ id: id.slice(-4), count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-warm-900">Statistics & Analytics</h1>
        <p className="text-warm-400 text-sm">Cake Hamper Sisters ka performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'bg-green-500' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-blue-500' },
          { label: 'Total Products', value: stats?.totalProducts || 0, color: 'bg-primary-500' },
          { label: 'Categories', value: stats?.totalCategories || 0, color: 'bg-purple-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className={`${s.color} text-white rounded-2xl p-5 shadow-md`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-white/80 text-sm mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Area Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-warm-900 mb-4">📈 Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef3d70" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef3d70" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#ef3d70" strokeWidth={2.5} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">🥧 Order Status (Pie)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">📦 Top Selling Products (Bar)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={topProductsData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="sold" radius={[0, 6, 6, 0]}>
                {topProductsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Frequency Histogram */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">🏷️ Tag Sales Frequency (Histogram)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={tagSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
              <XAxis dataKey="tag" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {tagSalesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-warm-900 mb-4">📊 Category Sales Comparison (Bar)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={categorySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f4c542" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Line Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-warm-900 mb-4">📉 Order Status Count (Line Graph)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={orderStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8ede4" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
