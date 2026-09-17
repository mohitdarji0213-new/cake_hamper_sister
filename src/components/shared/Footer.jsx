import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiTwitter,
} from "react-icons/fi";
import { HiOutlineCake } from "react-icons/hi";

const categories = [
  { name: "Chocolate", slug: "chocolate" },
  { name: "Red Velvet", slug: "red-velvet" },
  { name: "Birthday Cakes", slug: "birthday-cakes" },
  { name: "Wedding Cakes", slug: "wedding-cakes" },
  { name: "Photo Cakes", slug: "photo-cakes" },
  { name: "Cupcakes", slug: "cupcakes" },
  { name: "Pastries", slug: "pastries" },
];

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
                <HiOutlineCake className="text-white text-xl" />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">
                  Cake Hamper
                </div>
                <div className="text-xs text-gold-400 font-semibold">
                  Sisters
                </div>
              </div>
            </div>
            <p className="text-sm text-warm-200 leading-relaxed mb-4">
              Aapke khaas moments ko aur khaas banana hamare kaam hai. Garima
              Bothra ke saath, har cake mein dil ki baat.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <FiInstagram />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  All Cakes
                </Link>
              </li>
              <li>
                <Link
                  to="/contact?type=order"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  Custom Cake Order
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  My Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-warm-200 hover:text-gold-400 transition-colors"
                >
                  Login / Register
                </Link>
              </li>
              <li>
                <Link
                  to="/developer"
                  className="text-sm text-warm-200/50 hover:text-gold-400 transition-colors text-xs"
                >
                  Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">
              Hamare Paas Aayein
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-warm-200">
                <FiMapPin className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Cake Hamper Sisters, Jaipur, Rajasthan</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-warm-200">
                <FiPhone className="text-gold-400 flex-shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="hover:text-gold-400 transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-warm-200">
                <FiMail className="text-gold-400 flex-shrink-0" />
                <a
                  href="mailto:cakehampersisters@gmail.com"
                  className="hover:text-gold-400 transition-colors break-all"
                >
                  cakehampersisters@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl text-xs text-warm-300">
              🕐 Open: Mon–Sun, 9am – 8pm
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-warm-300">
          <p>© 2026 Cake Hamper Sisters. Garima Bothra. All rights reserved.</p>
          <p>
            Made with ❤️ for you |{" "}
            <Link
              to="/developer"
              className="hover:text-gold-400 transition-colors"
            >
              Developer Info
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
