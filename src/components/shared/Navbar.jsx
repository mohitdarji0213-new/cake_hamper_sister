import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { searchProducts } from "../../utils/api";
import {
  FiShoppingCart,
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineCake } from "react-icons/hi";

const categories = [
  { name: "Chocolate", slug: "chocolate", icon: "🍫" },
  { name: "Vanilla", slug: "vanilla", icon: "🍦" },
  { name: "Red Velvet", slug: "red-velvet", icon: "❤️" },
  { name: "Black Forest", slug: "black-forest", icon: "🍒" },
  { name: "Butterscotch", slug: "butterscotch", icon: "🧈" },
  { name: "Birthday Cakes", slug: "birthday-cakes", icon: "🎂" },
  { name: "Wedding Cakes", slug: "wedding-cakes", icon: "💍" },
  { name: "Photo Cakes", slug: "photo-cakes", icon: "🖼️" },
  { name: "Cupcakes", slug: "cupcakes", icon: "🧁" },
  { name: "Pastries", slug: "pastries", icon: "🍰" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await searchProducts(q);
        setSearchResults(data.slice(0, 6));
      } catch {}
      setSearching(false);
    }, 350);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchResults([]);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm shadow-sm"}`}
      >
        {/* Top bar */}
        <div className="bg-primary-500 text-white text-xs text-center py-1 px-4">
          📞 Garima Bothra — ₹500+ order par FREE delivery | Bidasar, Churu &
          nearby areas
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center shadow-md">
                <HiOutlineCake className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-lg text-warm-900 leading-tight">
                  Cake Hamper
                </div>
                <div className="text-xs text-primary-500 font-semibold tracking-wide">
                  Sisters
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-warm-900 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50"
              >
                Home
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-warm-900 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50 flex items-center gap-1">
                  Categories <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 bg-white shadow-2xl rounded-2xl p-4 w-72 grid grid-cols-2 gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-warm-100">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary-50 text-sm text-warm-800 hover:text-primary-600 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/contact"
                className="px-3 py-2 text-sm font-medium text-warm-900 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50"
              >
                Contact
              </Link>
              <Link
                to="/contact?type=order"
                className="px-3 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50"
              >
                🎂 Custom Cake
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-primary-50 text-warm-700 hover:text-primary-500 transition-colors"
              >
                <FiSearch className="text-xl" />
              </button>

              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-primary-50 text-warm-700 hover:text-primary-500 transition-colors"
              >
                <FiShoppingCart className="text-xl" />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {count}
                  </motion.span>
                )}
              </Link>

              {user ? (
                <div className="relative group hidden md:block">
                  <button className="p-2 rounded-full hover:bg-primary-50 text-warm-700 flex items-center gap-1">
                    <FiUser className="text-xl" />
                  </button>
                  <div className="absolute right-0 top-full bg-white shadow-xl rounded-xl overflow-hidden w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-warm-100">
                    <div className="px-4 py-2 border-b border-warm-100 text-sm font-medium text-warm-900">
                      {user.name}
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-50 text-warm-700"
                      >
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-500 w-full"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex btn-primary text-sm py-2 px-4"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-primary-50 text-warm-700"
              >
                <FiMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-warm-100">
              <div className="font-display font-bold text-xl text-warm-900">
                Cake Hamper Sisters
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full bg-warm-100"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 font-medium text-warm-900"
              >
                🏠 Home
              </Link>
              <div className="pt-2 pb-1 px-3 text-xs font-bold text-warm-400 uppercase tracking-wider">
                Categories
              </div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-warm-800"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 font-medium text-warm-900"
              >
                📞 Contact
              </Link>
              <Link
                to="/contact?type=order"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 font-bold text-primary-600"
              >
                🎂 Custom Cake Order
              </Link>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 font-medium text-primary-600"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 font-medium text-red-500 w-full"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-center btn-primary mt-4"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSearchOpen(false)
            }
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 p-4 border-b border-warm-100"
              >
                <FiSearch className="text-xl text-warm-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search cakes, flavors, designs..."
                  className="flex-1 text-lg outline-none text-warm-900 placeholder-warm-300 font-body"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full hover:bg-warm-100"
                >
                  <FiX />
                </button>
              </form>
              {searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto divide-y divide-warm-50">
                  {searchResults.map((p) => (
                    <Link
                      key={p._id}
                      to={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-warm-50 transition-colors"
                    >
                      <img
                        src={p.images?.[0] || "/placeholder.jpg"}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="font-medium text-warm-900 text-sm">
                          {p.name}
                        </div>
                        <div className="text-primary-500 font-bold text-sm">
                          ₹{p.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-3 text-center text-primary-500 font-medium hover:bg-primary-50 text-sm"
                  >
                    See all results for "{searchQuery}" →
                  </button>
                </div>
              )}
              {searching && (
                <div className="p-4 text-center text-warm-400 text-sm">
                  Searching...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-[calc(4rem+1.5rem)]" />{" "}
      {/* Spacer for top bar + navbar */}
    </>
  );
}
