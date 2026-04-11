import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI, settingAPI, categoryAPI } from '../services/api';
import Skeleton from '../components/ui/Skeleton';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};



const perks = [
  { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'On all orders in India' },
  { icon: HiOutlineShieldCheck, title: 'Anti-Tarnish', desc: 'Waterproof & durable' },
  { icon: HiOutlineRefresh, title: 'Easy Exchange', desc: '7-day hassle-free process' },
  { icon: HiOutlineSparkles, title: 'Fine Finish', desc: '14K-18K Gold plating' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [config, setConfig] = useState({
    hero_tagline: "ANTI-TARNISH & DEMI FINE JEWELLERY",
    hero_title: "The Art of",
    hero_title_bold: "Adornment",
    hero_image: "/images/hero_banner.png",
    hero_cta: "Shop Now",
    expertly_crafted_title: "The Art of Adornment",
    expertly_crafted_subtitle: "Expertly Crafted",
    expertly_crafted_description: "Every piece of Sajhnaa jewellery is a testament to timeless elegance and modern craftsmanship.",
    best_sellers_title: "Our Best Sellers"
  });
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  useEffect(() => {
    async function load() {
      try {
        const [featData, bestData, settingsData, catData] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ bestseller: 'true', limit: 4 }),
          settingAPI.get('homepage'),
          categoryAPI.getAll()
        ]);
        
        setFeatured(featData.products || []);
        setBestSellers(bestData.products || []);
        setCategories(catData.categories || []);
        if (settingsData.settings) {
          setConfig(prev => ({ ...prev, ...settingsData.settings }));
        }
      } catch (err) {
        console.error("Home load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section - Giva Style */}
      <section ref={heroRef} className="relative h-[550px] sm:h-[90vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src={config.hero_image}
            alt="Jewellery Collection"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay to keep contrast high if needed, but keeping it clean for Giva vibe */}
          <div className="absolute inset-0 bg-black/5" />
        </motion.div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
           <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="max-w-4xl"
            >
              <motion.div variants={fadeUp} className="mb-4">
                <span className="text-sm font-bold tracking-[0.3em] text-gray-800 uppercase">
                  Sajhnaa Essentials
                </span>
              </motion.div>
              
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-7xl lg:text-8xl font-light text-gray-900 tracking-tighter mb-6 italic"
              >
                {config.hero_title} <span className="font-bold not-italic">{config.hero_title_bold}</span>
              </motion.h1>

              <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
                <p className="text-sm font-semibold text-gray-600 tracking-[0.2em] uppercase">
                  {config.hero_tagline}
                </p>
                <div className="flex gap-4">
                  <Link to="/shop">
                    <Button size="lg" className="rounded-none px-12 uppercase tracking-widest text-xs font-bold bg-gray-900 hover:bg-gray-800">
                      {config.hero_cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
           </motion.div>
        </div>
      </section>

      {/* Perks Bar - Professional & Clean */}
      <section className="py-12 bg-[#F9F9FB] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-4 gap-2 md:gap-8">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                  <perk.icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#C41E3A]" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-xs font-bold text-gray-900 uppercase tracking-wider mb-0.5">{perk.title}</p>
                  <p className="hidden xs:block text-[7px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-medium leading-tight">{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Elegant Grid */}
      <section className="pt-4 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 italic">
              Shop by <span className="font-bold not-italic">Category</span>
            </h2>
            <div className="w-20 h-0.5 bg-accent-gold mx-auto" />
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-square overflow-hidden cursor-pointer"
              >
                <Link to={`/shop?category=${cat.slug}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-6 border-[3px] sm:border-[12px] border-transparent group-hover:border-white/20 transition-all duration-500">
                    <span className="text-white text-[8px] sm:text-xs font-bold tracking-widest uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-500">
                      View
                    </span>
                    <h3 className="text-white text-[10px] sm:text-3xl font-bold tracking-tight uppercase text-center leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertly Crafted Selection */}
      <section className="pt-0 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-[0.3em] text-[#C41E3A] uppercase block mb-4">
              {config.expertly_crafted_subtitle || "Expertly Crafted"}
            </span>
            <h2 className="text-4xl sm:text-6xl font-light text-gray-900 italic mb-4">
              {config.expertly_crafted_title.split(' ').slice(0, -1).join(' ')} <span className="font-bold not-italic">{config.expertly_crafted_title.split(' ').slice(-1)}</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-sm leading-relaxed uppercase tracking-widest">
              {config.expertly_crafted_description}
            </p>
          </motion.div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="pt-16 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
          >
            <div className="text-center md:text-left">
              <span className="text-xs font-bold tracking-widest text-[#C41E3A] uppercase block mb-3">
                {config.best_sellers_subtitle || "Most Loved Pieces"}
              </span>
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 italic">
                {config.best_sellers_title.split(' ').slice(0, -2).join(' ')} <span className="font-bold not-italic">{config.best_sellers_title.split(' ').slice(-2).join(' ')}</span>
              </h2>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="rounded-none border-gray-900 uppercase tracking-widest text-[10px] font-bold py-4 px-10">
                View All Products
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-0 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
             <HiOutlineSparkles className="w-12 h-12 text-[#C41E3A] mx-auto mb-8" />
             <h2 className="text-4xl font-light text-gray-900 mb-8 italic">
                Jewellery that stays <span className="font-bold not-italic">Gold forever.</span>
             </h2>
             <p className="text-gray-500 text-lg leading-relaxed mb-12">
                Our demi-fine jewellery is crafted with 18K gold plating on surgical-grade stainless steel, ensuring it's 100% waterproof, sweatproof, and anti-tarnish. Luxury made accessible for your everyday moments.
             </p>
             <div className="grid grid-cols-3 gap-8">
                <div>
                   <p className="text-2xl font-bold text-gray-900 mb-1">100%</p>
                   <p className="text-[10px] uppercase tracking-widest text-gray-500">Waterproof</p>
                </div>
                <div>
                   <p className="text-2xl font-bold text-gray-900 mb-1">Lifetime</p>
                   <p className="text-[10px] uppercase tracking-widest text-gray-500">Anti-Tarnish</p>
                </div>
                <div>
                   <p className="text-2xl font-bold text-gray-900 mb-1">Nickel-Free</p>
                   <p className="text-[10px] uppercase tracking-widest text-gray-500">Skin Friendly</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Internal helper for clean code
function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
  const base = "inline-flex items-center justify-center transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-sm",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
