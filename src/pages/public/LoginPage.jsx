import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineCake } from "react-icons/hi";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);
      login(data);
      toast.success(`Namaste, ${data.name}! 🙏`);
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Kuch galat hua");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <HiOutlineCake className="text-white text-3xl" />
          </div>
          <h1 className="font-display text-3xl font-bold text-warm-900">
            Cake Hamper Sisters
          </h1>
          <p className="text-warm-400 mt-1">
            {isLogin
              ? "Apne account mein login karein"
              : "Naya account banayein"}
          </p>
        </div>

        <div className="card p-8">
          <div className="flex bg-warm-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isLogin ? "bg-white shadow text-primary-600" : "text-warm-500"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isLogin ? "bg-white shadow text-primary-600" : "text-warm-500"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-warm-700 mb-1 block">
                  Pura Naam
                </label>
                <input
                  className="input-field"
                  placeholder="Riya Sharma"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="email@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-warm-700 mb-1 block">
                  Phone
                </label>
                <input
                  className="input-field"
                  placeholder="+91 99999 99999"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Login Karein"
                  : "Account Banayein"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-warm-400 mt-4">
          <Link to="/" className="hover:text-primary-500 transition-colors">
            ← Home par wapas jaayein
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
