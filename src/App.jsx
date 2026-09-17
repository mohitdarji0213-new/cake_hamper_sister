import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useAuth } from './context/AuthContext'

// Public Pages
import HomePage from './pages/public/HomePage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CategoryPage from './pages/public/CategoryPage'
import SearchPage from './pages/public/SearchPage'
import ContactPage from './pages/public/ContactPage'
import CheckoutPage from './pages/public/CheckoutPage'
import CartPage from './pages/public/CartPage'
import LoginPage from './pages/public/LoginPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminContacts from './pages/admin/AdminContacts'
import AdminStats from './pages/admin/AdminStats'
import AdminIssues from './pages/admin/AdminIssues'
import AdminOffers from './pages/admin/AdminOffers'
import DeveloperPage from './pages/public/DeveloperPage'

// Layout
import PublicLayout from './components/shared/PublicLayout'
import AdminLayout from './components/admin/AdminLayout'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>
  return user?.role === 'admin' ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="developer" element={<DeveloperPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="issues" element={<AdminIssues />} />
        <Route path="stats" element={<AdminStats />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}
