import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const api = axios.create({ baseURL: `${API_URL}/api` })

// Har request se pehle localStorage se token uthao aur header mein lagao
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('chs_user')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

// Products
export const getProducts = (params) => api.get('/products', { params })
export const getProduct = (slug) => api.get(`/products/${slug}`)
export const getNewProducts = () => api.get('/products/new')
export const getFeaturedProducts = () => api.get('/products/featured')
export const searchProducts = (q) => api.get('/products/search', { params: { q } })
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// Categories
export const getCategories = (params) => api.get('/categories', { params })
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Orders
export const createOrder = (data) => api.post('/orders', data)
export const getOrders = (params) => api.get('/orders', { params })
export const getOrder = (id) => api.get(`/orders/${id}`)
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data)

// Contact
export const submitContact = (data) => api.post('/contact', data)
export const getContacts = (params) => api.get('/contact', { params })
export const markContactRead = (id) => api.put(`/contact/${id}/read`)
export const resolveContact = (id) => api.put(`/contact/${id}/resolve`)

// Events
export const getEvents = () => api.get('/events')
export const createEvent = (data) => api.post('/events', data)
export const deleteEvent = (id) => api.delete(`/events/${id}`)

// Auth
export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)

// Stats
export const getStats = () => api.get('/stats')

// Offers (Diwali, Holi, Birthday, New Year discounts)
export const getOffers = () => api.get('/offers')
export const getAllOffers = () => api.get('/offers/all')
export const createOffer = (data) => api.post('/offers', data)
export const updateOffer = (id, data) => api.put(`/offers/${id}`, data)
export const deleteOffer = (id) => api.delete(`/offers/${id}`)

// Admin Notification Service
export const getNotificationSummary = () => api.get('/notifications/summary')
export const markOrderSeen = (id) => api.put(`/notifications/orders/${id}/seen`)
export const markAllOrdersSeen = () => api.put('/notifications/orders/seen-all')
export const getNotificationPref = () => api.get('/notifications/preference')
export const setNotificationPref = (data) => api.put('/notifications/preference', data)

export default api
