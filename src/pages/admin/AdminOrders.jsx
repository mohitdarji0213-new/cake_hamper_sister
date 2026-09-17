import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, markOrderSeen } from '../../utils/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    getOrders({ status: statusFilter, limit: 50 }).then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const handleStatusUpdate = async (orderId, status, paymentStatus) => {
    await updateOrderStatus(orderId, { status, paymentStatus })
    toast.success('Status update ho gaya!')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">Orders</h1>
          <p className="text-warm-400 text-sm">{orders.length} orders</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field py-2 w-44">
          <option value="">All Orders</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex flex-wrap items-start gap-4">
              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-bold text-warm-900">#{order.orderNumber}</span>
                  {!order.isSeenByAdmin && <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_COLORS[order.paymentStatus]}`}>{order.paymentStatus}</span>
                </div>
                <div className="text-sm text-warm-700 mb-1">
                  <strong>{order.customer.name}</strong> — {order.customer.phone}
                </div>
                <div className="text-xs text-warm-400 mb-2">{order.customer.address}</div>
                <div className="text-xs text-warm-500">
                  {order.items.length} items | {order.paymentMethod} | {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>

              {/* Amount + Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="text-xl font-bold text-primary-600">₹{order.totalAmount}</div>
                <button onClick={() => {
                    const opening = selected?._id !== order._id
                    setSelected(opening ? order : null)
                    // Admin jab order khol kar dekhta hai toh use "seen" mark kar do
                    if (opening && !order.isSeenByAdmin) {
                      markOrderSeen(order._id).then(load)
                    }
                  }}
                  className="text-xs text-primary-500 hover:underline">
                  {selected?._id === order._id ? 'Close' : 'Details / Update'}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {selected?._id === order._id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                className="border-t border-warm-100 p-4 bg-warm-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-bold text-warm-500 uppercase mb-2">Items Ordered</div>
                    {order.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 mb-2">
                        {item.image && <img src={item.image} className="w-8 h-8 rounded object-cover" />}
                        <div className="text-sm text-warm-700">{item.name} × {item.quantity}</div>
                        <div className="ml-auto font-bold text-sm">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-warm-500 uppercase mb-2">Update Status</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-warm-600 mb-1 block">Order Status</label>
                        <select defaultValue={order.orderStatus}
                          onChange={e => handleStatusUpdate(order._id, e.target.value, order.paymentStatus)}
                          className="input-field py-1.5 text-sm">
                          {['placed','processing','shipped','delivered','cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-warm-600 mb-1 block">Payment Status</label>
                        <select defaultValue={order.paymentStatus}
                          onChange={e => handleStatusUpdate(order._id, order.orderStatus, e.target.value)}
                          className="input-field py-1.5 text-sm">
                          {['pending','paid','failed'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-warm-400">Koi order nahi hai abhi</div>
        )}
      </div>
    </div>
  )
}
