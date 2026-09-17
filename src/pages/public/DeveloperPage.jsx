import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiMail,
  FiInstagram,
  FiCode,
  FiGlobe,
  FiHeart,
  FiShoppingCart,
  FiSmartphone,
  FiLock,
  FiBarChart2,
  FiSearch,
  FiTag,
  FiCreditCard,
  FiBell,
  FiUploadCloud,
  FiPlay,
  FiMessageSquare,
  FiZap,
  FiCheckCircle,
  FiUser,
  FiMapPin,
  FiPackage,
  FiLayout,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaTelegram,
  FaReact,
  FaNodeJs,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiMongodb,
  SiTailwindcss,
  SiVite,
  SiExpress,
  SiFramer,
  SiJsonwebtokens,
  SiNodedotjs,
} from "react-icons/si";
import { HiOutlineCake, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlinePayment } from "react-icons/md";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "React.js", icon: <FaReact className="text-cyan-400" />, level: 90 },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" />, level: 85 },
  {
    name: "MongoDB",
    icon: <SiMongodb className="text-green-400" />,
    level: 80,
  },
  {
    name: "Express.js",
    icon: <SiExpress className="text-gray-300" />,
    level: 85,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-300" />,
    level: 92,
  },
  {
    name: "Framer Motion",
    icon: <SiFramer className="text-pink-400" />,
    level: 78,
  },
  { name: "GSAP", icon: "✨", level: 75 },
  { name: "Git", icon: <FaGitAlt className="text-orange-400" />, level: 82 },
];

const CONTACTS = [
  {
    icon: <FiMail className="text-xl" />,
    label: "Email",
    value: "mohitdarji0213@gmail.com",
    href: "mailto:mohitdarji0213@gmail.com",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: <FaWhatsapp className="text-xl" />,
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919351940232",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <FiInstagram className="text-xl" />,
    label: "Instagram",
    value: "@MD_Bhai_213",
    href: "https://instagram.com/MD_Bhai_213",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: <FaTelegram className="text-xl" />,
    label: "Telegram",
    value: "@MD_bhai_213",
    href: "https://t.me/MD_bhai_213",
    color: "from-blue-400 to-blue-600",
  },
];

const FEATURES = [
  {
    icon: <HiOutlineShoppingBag className="text-primary-400 text-lg" />,
    text: "Full Cake E-Commerce Store with Cart & Checkout",
  },
  {
    icon: <FiSmartphone className="text-blue-400 text-lg" />,
    text: "Mobile-First Responsive Design",
  },
  {
    icon: <FiLock className="text-yellow-400 text-lg" />,
    text: "Admin Panel with Secure Login",
  },
  {
    icon: <FiBarChart2 className="text-green-400 text-lg" />,
    text: "Analytics Dashboard with Charts",
  },
  {
    icon: <FiSearch className="text-cyan-400 text-lg" />,
    text: "Smart Product Search",
  },
  {
    icon: <FiTag className="text-pink-400 text-lg" />,
    text: "Tag-based Related Products",
  },
  {
    icon: <MdOutlinePayment className="text-purple-400 text-lg" />,
    text: "Multiple Payment Methods (GPay, Paytm, UPI)",
  },
  {
    icon: <FiBell className="text-orange-400 text-lg" />,
    text: "Admin Notification Service — Email + Live Browser Alerts on Orders",
  },
  {
    icon: <FiUploadCloud className="text-teal-400 text-lg" />,
    text: "Cloudinary Image Upload",
  },
  {
    icon: <FiPlay className="text-red-400 text-lg" />,
    text: "Occasion Banner Carousel + Diwali/Holi/Birthday Offers",
  },
  {
    icon: <FiMessageSquare className="text-indigo-400 text-lg" />,
    text: "Custom Cake Order System with Reference Photo Upload",
  },
  {
    icon: <FiZap className="text-gold-400 text-lg" />,
    text: "Smooth Animations (GSAP + Framer Motion)",
  },
];

export default function DeveloperPage() {
  const heroRef = useRef();
  const skillsRef = useRef();

  useEffect(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });
    gsap.from(".skill-bar", {
      width: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: skillsRef.current,
        start: "top 75%",
        once: true,
      },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-900 via-[#1a1200] to-warm-900 text-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-16 pb-20 px-4"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-gold-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-400 via-gold-400 to-primary-600 p-1 shadow-2xl shadow-primary-500/40"
          >
            <div className="w-full h-full rounded-full bg-warm-900 flex items-center justify-center">
              <FiUser
                className="text-4xl text-transparent"
                style={{ stroke: "url(#grad)" }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef3d70" />
                    <stop offset="100%" stopColor="#f4c542" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-gold-400">
                MD
              </span>
            </div>
          </motion.div>

          {/* Developer Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm mb-4"
          >
            <FiCode className="text-gold-400" />
            <span className="text-white/80">Web Developer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-6xl font-bold mb-2"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-gold-400 to-primary-300">
              Mohit Darji
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gold-400 font-semibold text-lg mb-2 tracking-wide flex items-center justify-center gap-2"
          >
            <FiStar className="text-gold-400" /> Full Stack Developer{" "}
            <FiStar className="text-gold-400" />
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 text-base mb-1 flex items-center justify-center gap-2"
          >
            <FiCode className="text-primary-400" />
            MERN Stack Developer — Turning ideas into reality
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/40 text-sm flex items-center justify-center gap-1.5 mb-8"
          >
            <FiMapPin className="text-primary-400" /> Rajasthan, India
          </motion.p>

          {/* Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {CONTACTS.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-gradient-to-r ${c.color} px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all`}
              >
                {c.icon} {c.label}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Project */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
              <HiOutlineCake className="text-white text-xl" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Is Website ke Baare Mein
              </h2>
              <p className="text-white/40 text-sm">Project Details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="text-gold-400" />
                <span className="text-gold-400 font-bold text-sm uppercase tracking-wider">
                  Client
                </span>
              </div>
              <p className="text-white text-lg font-semibold">Garima Bothra</p>
              <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                <FiMapPin className="text-primary-400 flex-shrink-0" /> Cake
                Hamper Sisters, Jaipur, Rajasthan
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineCake className="text-gold-400" />
                <span className="text-gold-400 font-bold text-sm uppercase tracking-wider">
                  Website
                </span>
              </div>
              <p className="text-white text-lg font-semibold">
                Cake Hamper Sisters
              </p>
              <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                <FiShoppingCart className="text-primary-400 flex-shrink-0" />{" "}
                Cake E-Commerce — Custom Cakes, Pastries, Cupcakes
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiSettings className="text-gold-400" />
              <span className="text-gold-400 font-bold text-sm uppercase tracking-wider">
                Website Mein Kya Kya Bana Hai
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-sm text-white/70 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5"
                >
                  <span className="flex-shrink-0">{f.icon}</span>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section ref={skillsRef} className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiCode className="text-primary-400 text-2xl" />
            <h2 className="font-display text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">
                Skills & Technologies
              </span>
            </h2>
          </div>
          <p className="text-white/40 text-center text-sm mb-8 flex items-center justify-center gap-1">
            <FiZap className="text-gold-400" /> Jinse ye website banayi gayi
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS.map((skill, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-sm font-semibold text-white/90">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs text-gold-400 font-bold">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="skill-bar h-full bg-gradient-to-r from-primary-500 to-gold-400 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiMessageSquare className="text-primary-400 text-2xl" />
            <h2 className="font-display text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">
                Contact Karein
              </span>
            </h2>
          </div>
          <p className="text-white/40 text-center text-sm mb-8">
            Website se related koi bhi kaam ho — reach out karein
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${c.color} shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                    {c.label}
                  </div>
                  <div className="text-white font-bold text-sm mt-0.5">
                    {c.value}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bottom */}
      <section className="max-w-4xl mx-auto px-4 py-10 pb-16 text-center">
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/40 text-sm flex items-center justify-center gap-1.5 flex-wrap">
            Made with <FiHeart className="text-red-400 animate-pulse" /> by
            <span className="text-gold-400 font-bold">Mohit Darji</span>
            for
            <span className="text-primary-400 font-bold flex items-center gap-1">
              <HiOutlineCake /> Cake Hamper Sisters
            </span>
          </p>
          <p className="text-white/20 text-xs mt-2 flex items-center justify-center gap-1">
            <FiMapPin className="text-white/20" /> Rajasthan, India
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <HiOutlineCake /> Cake Hamper Sisters Home Par Jaayein
          </Link>
        </div>
      </section>
    </div>
  );
}
