import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../utils/api";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "gpay", name: "Google Pay", icon: "🎯", desc: "UPI se pay karein" },
  { id: "paytm", name: "Paytm", icon: "💙", desc: "Paytm wallet ya UPI" },
  { id: "bhim", name: "BHIM UPI", icon: "🇮🇳", desc: "Direct bank transfer" },
  {
    id: "credit_card",
    name: "Credit / Debit Card",
    icon: "💳",
    desc: "Visa, Mastercard, RuPay",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: "💵",
    desc: "Delivery pe payment",
  },
];

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address)
      return toast.error("Sabhi details bharen");
    if (!paymentMethod) return toast.error("Payment method select karein");
    setLoading(true);
    try {
      const items = cart.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.images?.[0],
        price: i.price,
        quantity: i.quantity,
      }));
      const { data } = await createOrder({
        customer: form,
        items,
        totalAmount: total,
        paymentMethod,
      });
      clearCart();
      toast.success(`Order placed! Order # ${data.orderNumber} 🎉`);
      navigate("/");
    } catch {
      toast.error("Order mein kuch problem aayi. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-title mb-6">Checkout 🛍️</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Info */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4">
              Delivery Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  field: "name",
                  label: "Pura Naam *",
                  placeholder: "Riya Sharma",
                },
                {
                  field: "email",
                  label: "Email *",
                  placeholder: "email@gmail.com",
                  type: "email",
                },
                {
                  field: "phone",
                  label: "Phone *",
                  placeholder: "+91 99999 99999",
                },
                { field: "city", label: "Shehar", placeholder: "Jaipur" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-sm font-medium text-warm-700 mb-1 block">
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={form[f.field]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.field]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-warm-700 mb-1 block">
                  Pura Address *
                </label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Ghar no., gali, mohalla, shehar, pin code..."
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <motion.label
                  key={m.id}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === m.id ? "border-primary-500 bg-primary-50" : "border-warm-100 hover:border-warm-200"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="hidden"
                  />
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-warm-900 text-sm">
                      {m.name}
                    </div>
                    <div className="text-xs text-warm-400">{m.desc}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.id ? "border-primary-500" : "border-warm-300"}`}
                  >
                    {paymentMethod === m.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex gap-3 mb-3">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-warm-700 line-clamp-2">
                  {item.name}
                </p>
                <p className="text-xs text-warm-400">x{item.quantity}</p>
              </div>
              <span className="text-sm font-bold">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
          <div className="border-t border-warm-100 pt-4 mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-warm-500">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-warm-500">Delivery</span>
              <span
                className={total >= 500 ? "text-green-600 font-medium" : ""}
              >
                {total >= 500 ? "FREE" : "₹50"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">
                ₹{total >= 500 ? total : total + 50}
              </span>
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "🎉"
            )}
            {loading ? "Processing..." : "Order Place Karein"}
          </button>
          <p className="text-xs text-warm-300 text-center mt-3">
            Aapka order confirm hone par email aayega
          </p>
        </div>
      </div>
    </div>
  );
}
