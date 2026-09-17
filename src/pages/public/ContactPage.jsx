import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { submitContact } from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiShoppingBag,
  FiUpload,
  FiX,
} from "react-icons/fi";

// Custom cake order ke liye backend enum 'order_inquiry' expect karta hai
const TYPE_ORDER = "order_inquiry";
const TYPE_ISSUE = "issue";

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [activeType, setActiveType] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navbar/Footer/Home se "?type=order" ke saath aaye toh seedha custom cake form khol do
  useEffect(() => {
    if (searchParams.get("type") === "order") setActiveType(TYPE_ORDER);
  }, [searchParams]);

  const handleSubmit = async (type) => {
    if (!form.name || !form.email || !form.message)
      return toast.error("Sabhi fields bharen");
    setLoading(true);
    try {
      if (referenceImage) {
        // Custom cake ki reference photo ke saath bhejna hai toh FormData use karo
        const fd = new FormData();
        Object.entries({ ...form, type }).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", referenceImage);
        await submitContact(fd);
      } else {
        await submitContact({ ...form, type });
      }
      toast.success("Aapka message send ho gaya! Hum jald contact karenge 🙏");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setReferenceImage(null);
      setActiveType(null);
    } catch {
      toast.error("Kuch galat hua. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-16">
      <div className="text-center mb-10">
        <h1 className="section-title text-4xl mb-3">Humse Milein 👋</h1>
        <p className="text-warm-500 text-lg">
          Koi bhi sawaal ho ya custom cake order karna ho — hum yahan hain
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: <FiPhone />,
            title: "Phone",
            value: "+91 99999 99999",
            sub: "Mon–Sun, 9am–8pm",
          },
          {
            icon: <FiMail />,
            title: "Email",
            value: "cakehampersisters@gmail.com",
            sub: "24 ghante mein reply",
          },
          {
            icon: <FiMapPin />,
            title: "Address",
            value: "Cake Hamper Sisters",
            sub: "Jaipur, Rajasthan",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5 text-center"
          >
            <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              {item.icon}
            </div>
            <div className="font-bold text-warm-900 mb-1">{item.title}</div>
            <div className="text-sm text-warm-700">{item.value}</div>
            <div className="text-xs text-warm-400 mt-1">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Two Options */}
      {!activeType && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveType(TYPE_ORDER)}
            className="p-8 rounded-3xl bg-gradient-to-br from-primary-500 to-gold-500 text-white text-left shadow-xl"
          >
            <FiShoppingBag className="text-4xl mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              🎂 Custom Cake Order
            </h3>
            <p className="text-white/80 text-sm">
              Apni pasand ka cake banwana ho? Reference photo bhejein aur
              request send karein
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold bg-white/20 px-4 py-2 rounded-full">
              Custom Cake Request Bhejo →
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveType(TYPE_ISSUE)}
            className="p-8 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white text-left shadow-xl"
          >
            <FiMessageSquare className="text-4xl mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              Koi Issue Hai?
            </h3>
            <p className="text-white/80 text-sm">
              Delivery, quality ya kisi bhi cheez mein problem ho toh humse
              batayein
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold bg-white/20 px-4 py-2 rounded-full">
              Issue Report Karein →
            </div>
          </motion.button>
        </div>
      )}

      {/* Form */}
      {activeType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-warm-900">
                {activeType === TYPE_ORDER
                  ? "🎂 Custom Cake Order"
                  : "🆘 Issue Report"}
              </h2>
              <p className="text-warm-400 text-sm mt-1">
                Apni details fill karein
              </p>
            </div>
            <button
              onClick={() => {
                setActiveType(null);
                setReferenceImage(null);
              }}
              className="text-sm text-warm-400 hover:text-red-500 transition-colors"
            >
              ← Wapas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Aapka Naam *
              </label>
              <input
                className="input-field"
                placeholder="Riya Sharma"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Email *
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="email@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Phone Number
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
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1 block">
                Subject
              </label>
              <input
                className="input-field"
                placeholder={
                  activeType === TYPE_ORDER
                    ? "1kg Chocolate Birthday Cake"
                    : "Delivery problem"
                }
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-warm-700 mb-1 block">
              Message *
            </label>
            <textarea
              rows={5}
              className="input-field resize-none"
              placeholder={
                activeType === TYPE_ORDER
                  ? "Cake kaisa chahiye? Flavor, weight, design, delivery date batayein..."
                  : "Aapki problem kya hai? Detail mein batayein..."
              }
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
            />
          </div>

          {/* Custom cake ke liye reference photo upload */}
          {activeType === TYPE_ORDER && (
            <div className="mb-6">
              <label className="text-sm font-medium text-warm-700 mb-2 block">
                Cake ki Reference Photo (optional)
              </label>
              <p className="text-xs text-warm-400 mb-2">
                Jaisa cake chahiye uski photo add karein — hum bilkul waisa hi
                banane ki koshish karenge
              </p>
              {referenceImage ? (
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(referenceImage)}
                    alt="Reference"
                    className="w-32 h-32 rounded-xl object-cover border-2 border-primary-200"
                  />
                  <button
                    type="button"
                    onClick={() => setReferenceImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-warm-200 rounded-xl p-6 cursor-pointer hover:border-primary-400 transition-colors w-full sm:w-64">
                  <FiUpload className="text-2xl text-warm-400" />
                  <span className="text-sm text-warm-500">
                    Cake ki photo choose karein
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setReferenceImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(activeType)}
              disabled={loading}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 ${loading ? "opacity-70" : ""}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {loading
                ? "Sending..."
                : activeType === TYPE_ORDER
                  ? "Custom Cake Request Bhejo 🎂"
                  : "Issue Report Karo 🆘"}
            </button>
            <button
              onClick={() => {
                setActiveType(null);
                setReferenceImage(null);
              }}
              className="btn-outline px-6"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
