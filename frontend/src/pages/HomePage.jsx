import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineStar } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI, settingAPI, categoryAPI } from '../services/api';
import Skeleton from '../components/ui/Skeleton';
/*  */import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { LinkCard } from '../components/ui/link-card';

const perks = [
  { icon: HiOutlineShieldCheck, title: '100% Waterproof', desc: 'No-worry wear' },
  { icon: HiOutlineStar, title: 'Lifetime Plating', desc: 'Resiliant luxury' },
  { icon: HiOutlineShieldCheck, title: 'Anti-Tarnish', desc: 'Stay shining' },
  { icon: HiOutlineSparkles, title: 'Nickel-Free', desc: 'Zero irritation' },
  { icon: HiOutlineSparkles, title: 'Skin Friendly', desc: 'Hypoallergenic' },
];

const heroSlides = [
  {
    image: "/images/products/img_3404.webp",
    tagline: "AUTHENTIC TEMPLE HERITAGE",
    titlePart1: "Timeless",
    titlePart2: "Elegance",
    cta: "Shop Necklaces",
    align: "center",
    link: "/shop?category=necklaces"
  },
  {
    image: "/images/products/img_3441.webp",
    tagline: "ANTIQUE GOLD & EMERALD",
    titlePart1: "Royal &",
    titlePart2: "Auspicious",
    cta: "Best Sellers",
    align: "left",
    link: "/shop?bestseller=true"
  },
  {
    image: "/images/products/img_3453.webp",
    tagline: "HANDCRAFTED LUXURY",
    titlePart1: "Adorn",
    titlePart2: "Yourself",
    cta: "Explore Hasli Sets",
    align: "right",
    link: "/shop?category=necklaces"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHeroSlides, setActiveHeroSlides] = useState(heroSlides);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [config, setConfig] = useState({
    expertly_crafted_title: "The Art of Adornment",
    expertly_crafted_subtitle: "Expertly Crafted",
    expertly_crafted_description: "Every piece of Arnika jewellery is a testament to timeless elegance and modern craftsmanship.",
    best_sellers_title: "Our Best Sellers",
    best_sellers_subtitle: "Most Loved Pieces"
  });
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const heroRef = useRef(null);
  
  useEffect(() => {
    if (activeHeroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % activeHeroSlides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [activeHeroSlides.length]);

  useEffect(() => {
    async function load() {
      try {
        const [featData, bestData, allData, heroData, craftData, catData] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ bestseller: 'true', limit: 8 }),
          productAPI.getAll({ limit: 50 }),
          settingAPI.get('hero_slides'),
          settingAPI.get('expertly_crafted'),
          categoryAPI.getAll()
        ]);
        
        setFeatured(featData.products || []);
        setBestSellers(bestData.products || []);
        setAllProducts(allData.products || []);
        setCategories(catData.categories || []);
        
        const ensureArray = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            return Array.isArray(parsed) ? parsed : (parsed.value || []);
          } catch { return []; }
        };

        if (heroData?.settings) {
          const slides = ensureArray(heroData.settings);
          if (slides.length > 0) setActiveHeroSlides(slides);
        }
        
        if (craftData?.settings) {
          const rawCraft = craftData.settings;
          try {
            const parsedCraft = typeof rawCraft === 'string' ? JSON.parse(rawCraft) : rawCraft;
            setConfig(prev => ({ ...prev, ...(parsedCraft.value || parsedCraft) }));
          } catch {
            setConfig(prev => ({ ...prev, ...(rawCraft.value || rawCraft) }));
          }
        }
      } catch (err) {
        console.error("Home load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
       <div className="w-16 h-16 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Luxury...</p>
    </div>
  );

  return (
    <div className="bg-[#FFF9FA] text-gray-900 selection:bg-pink-100 selection:text-pink-900">
      {/* Hero Section - Luxury Animated Slider */}
      <section ref={heroRef} className="relative aspect-video w-full overflow-hidden bg-gray-900">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeHeroSlides[currentSlide]?.image}
              alt="Luxury Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Content */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-12 w-full h-full relative pointer-events-none">
            <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cn(
                    "absolute transition-all duration-300 w-full md:w-auto p-4 pointer-events-auto z-30",
                    activeHeroSlides[currentSlide]?.align === 'center' ? 'text-center' : 
                    activeHeroSlides[currentSlide]?.align === 'right' ? 'text-right' : 'text-left'
                  )}
                  style={{
                    top: `${activeHeroSlides[currentSlide]?.top ?? 50}%`,
                    left: `${activeHeroSlides[currentSlide]?.left ?? 50}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '100vw'
                  }}
                >
                  {activeHeroSlides[currentSlide]?.tagline && (
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 }
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-4"
                      style={{ justifyContent: activeHeroSlides[currentSlide]?.align === 'center' ? 'center' : activeHeroSlides[currentSlide]?.align === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                      <div className={cn("h-px w-6 sm:w-8", activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'bg-black/20' : 'bg-white/40')} />
                      <span 
                        className={cn(
                          "text-[10px] sm:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase",
                          activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'text-gray-900' : 'text-white/80'
                        )}
                        style={{ 
                          fontSize: activeHeroSlides[currentSlide]?.taglineSize ? `${activeHeroSlides[currentSlide]?.taglineSize}px` : undefined,
                          color: activeHeroSlides[currentSlide]?.textColor === 'custom' ? activeHeroSlides[currentSlide]?.customTextColor : undefined
                        }}
                      >
                        {activeHeroSlides[currentSlide]?.tagline}
                      </span>
                      <div className={cn("h-px w-6 sm:w-8", activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'bg-black/20' : 'bg-white/40')} />
                    </motion.div>
                  )}

                  {(activeHeroSlides[currentSlide]?.titlePart1 || activeHeroSlides[currentSlide]?.title || activeHeroSlides[currentSlide]?.titlePart2 || activeHeroSlides[currentSlide]?.titleBold) && (
                    <motion.h1
                      variants={{
                        initial: { opacity: 0, y: 30 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -30 }
                      }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={cn(
                        "text-4xl xs:text-5xl sm:text-8xl lg:text-9xl font-light tracking-tighter mb-6 sm:mb-8 italic leading-[1.1] sm:leading-none",
                        activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'text-gray-900' : 'text-white'
                      )}
                      style={{ 
                        fontSize: activeHeroSlides[currentSlide]?.titleSize ? `${activeHeroSlides[currentSlide]?.titleSize}px` : undefined,
                        color: activeHeroSlides[currentSlide]?.textColor === 'custom' ? activeHeroSlides[currentSlide]?.customTextColor : undefined
                      }}
                    >
                      {(activeHeroSlides[currentSlide]?.titlePart1 || activeHeroSlides[currentSlide]?.title) && (
                        <>{activeHeroSlides[currentSlide]?.titlePart1 || activeHeroSlides[currentSlide]?.title} <br/></>
                      )}
                      <span className={cn(
                        "font-bold not-italic block mt-1 sm:mt-2",
                        activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'text-black' : 'text-white'
                      )}>
                        {activeHeroSlides[currentSlide]?.titlePart2 || activeHeroSlides[currentSlide]?.titleBold}
                      </span>
                    </motion.h1>
                  )}

                  {activeHeroSlides[currentSlide]?.cta && (
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 }
                      }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col gap-8 pointer-events-auto"
                      style={{ alignItems: activeHeroSlides[currentSlide]?.align === 'center' ? 'center' : activeHeroSlides[currentSlide]?.align === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                      <Link 
                        to={activeHeroSlides[currentSlide]?.link || "/shop"} 
                        className="inline-block pointer-events-auto cursor-pointer"
                      >
                        <Button 
                          size="lg" 
                          className={cn(
                            "rounded-none px-6 sm:px-16 h-12 sm:h-16 border-2 transition-all duration-500 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black shadow-2xl cursor-pointer pointer-events-auto select-none",
                            activeHeroSlides[currentSlide]?.textColor === 'dark' 
                              ? "bg-gray-900 text-white border-gray-900 hover:bg-transparent hover:text-gray-900" 
                              : (activeHeroSlides[currentSlide]?.textColor === 'custom' ? "" : "bg-white text-black border-white/20 hover:bg-transparent hover:text-white hover:border-white")
                          )}
                          style={activeHeroSlides[currentSlide]?.textColor === 'custom' ? {
                            backgroundColor: activeHeroSlides[currentSlide]?.buttonBg,
                            color: activeHeroSlides[currentSlide]?.buttonText,
                            borderColor: activeHeroSlides[currentSlide]?.buttonBg
                          } : {}}
                        >
                          {activeHeroSlides[currentSlide]?.cta}
                        </Button>
                      </Link>
                    </motion.div>
                  )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>      {/* Scrolling Coupon Strip */}
      <div className="bg-gray-950 overflow-hidden py-3 sm:py-4 border-y border-white/5 relative">
        <motion.div 
          animate={{ x: [-1500, 0] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap gap-12 sm:gap-24 items-center"
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-12">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white flex items-center gap-4">
                <span className="bg-[#C41E3A] text-white px-2 py-0.5 rounded-sm">20% OFF</span>
                ON ORDERS OVER ₹1599
              </span>
              <span className="text-[10px] sm:text-xs font-light tracking-[0.4em] text-white/50 uppercase">
                CODE: ARNIKA20
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]/40" />
            </div>
          ))}
        </motion.div>
      </div>      {/* Categories - Elegant Grid */}
      {/* Categories - Elegant Grid */}
      <section className="pt-8 pb-6 sm:pt-12 sm:pb-8 relative overflow-hidden">
        {/* Soft romantic blush gradient background with ambient pink glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0F4]/90 via-[#FFF7F9] to-[#FFF0F4]/70 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 sm:mb-8"
          >
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#DE5D83] uppercase block mb-1.5">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-gray-900 mb-2 italic tracking-tight">
              Shop by <span className="font-bold not-italic">Category</span>
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#DE5D83] to-transparent mx-auto" />
          </motion.div>

          {/* Categories Grid - 4 Curated Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-full"
              >
                <LinkCard
                  title={cat.name}
                  imageUrl={cat.image}
                  href={`/shop?category=${cat.slug}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Bar - Luxury Rose Gold & Blush */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-[#FFF5F7] via-[#FFEBF0] to-[#FFF5F7] border-y border-pink-200/60 overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex sm:grid sm:grid-cols-5 gap-6 sm:gap-8 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2.5 shrink-0 w-[110px] sm:w-auto"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-pink-200/70 hover:scale-110 transition-transform duration-300">
                  <perk.icon className="w-5 h-5 text-[#DE5D83]" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-xs font-black text-gray-900 uppercase tracking-widest mb-0.5 whitespace-nowrap">{perk.title}</p>
                  <p className="hidden xs:block text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold leading-tight">{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 sm:py-14 bg-gradient-to-b from-[#FFF5F7]/80 via-white to-[#FFF0F4]/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-10"
          >
            <div className="text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#DE5D83] uppercase block mb-1.5">
                {config.best_sellers_subtitle || "Most Loved Pieces"}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 italic">
                {config.best_sellers_title.split(' ').slice(0, -2).join(' ')} <span className="font-bold not-italic">{config.best_sellers_title.split(' ').slice(-2).join(' ')}</span>
              </h2>
            </div>
            <Link to="/shop?bestseller=true">
              <Button variant="outline" className="rounded-full border-pink-300 bg-white hover:bg-pink-50 text-gray-900 uppercase tracking-widest text-[10px] font-bold py-3.5 px-8 shadow-xs">
                View All Best Sellers
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-3xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
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

      {/* Featured Collection / New Arrivals */}
      <section className="py-10 sm:py-16 bg-[#FFF9FA] overflow-hidden relative border-t border-pink-100">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-10"
          >
            <div className="text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#DE5D83] uppercase block mb-1.5">
                {config.expertly_crafted_subtitle || "Exclusive Creations"}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 italic">
                {config.expertly_crafted_title.split(' ').slice(0, -1).join(' ')} <span className="font-bold not-italic">{config.expertly_crafted_title.split(' ').slice(-1)}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl">
                {config.expertly_crafted_description || "Handcrafted antique gold jewellery finished with authentic temple motifs and uncut stones."}
              </p>
            </div>
            <Link to="/shop?featured=true">
              <Button variant="outline" className="rounded-full border-pink-300 bg-white hover:bg-pink-50 text-gray-900 uppercase tracking-widest text-[10px] font-bold py-3.5 px-8 shadow-xs">
                Explore Featured
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-3xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore All Products - Interactive Category Tabs */}
      <section className="py-12 sm:py-20 bg-white overflow-hidden relative border-t border-pink-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#DE5D83] uppercase block mb-2">
              Timeless Treasures
            </span>
            <h2 className="text-3xl sm:text-5xl font-light text-gray-900 italic tracking-tight mb-3">
              Explore Our <span className="font-bold not-italic">Complete Collection</span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#DE5D83] to-transparent mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-gray-500">
              Browse authentic handcrafted jewellery curated for weddings, festive occasions, and daily elegance.
            </p>
          </motion.div>

          {/* Interactive Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {[
              { id: 'all', label: 'All Designs' },
              ...categories.map(c => ({ id: c.slug, label: c.name }))
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-gray-900 text-white shadow-md shadow-black/10 scale-105"
                      : "bg-[#FFF5F7] text-gray-600 hover:bg-pink-100/70 hover:text-gray-900 border border-pink-100"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Products Grid based on selected tab */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-3xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
              >
                {(activeTab === 'all'
                  ? allProducts.slice(0, 8)
                  : allProducts.filter(p => (p.category || '').toLowerCase() === activeTab.toLowerCase()).slice(0, 8)
                ).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* View Entire Shop CTA */}
          <div className="mt-10 sm:mt-14 text-center">
            <Link to={activeTab === 'all' ? '/shop' : `/shop?category=${activeTab}`}>
              <Button
                size="lg"
                className="rounded-full px-8 sm:px-12 py-4 bg-gray-900 text-white hover:bg-black uppercase tracking-[0.2em] text-[11px] font-black shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                View Complete Shop ({allProducts.length} Items)
                <HiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Trust & Luxury Assurance Banner */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#FFF5F7] border-t border-pink-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HiOutlineSparkles className="w-10 h-10 text-[#DE5D83] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 italic">
              Jewellery that stays <span className="font-bold not-italic">Gold forever.</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10">
              Our demi-fine jewellery is crafted with 18K antique gold plating on premium hypoallergenic brass and surgical steel, ensuring it is 100% waterproof, sweatproof, and anti-tarnish.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-[#DE5D83] font-bold">Waterproof</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Lifetime</p>
                <p className="text-[10px] uppercase tracking-widest text-[#DE5D83] font-bold">Anti-Tarnish</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Skin-Safe</p>
                <p className="text-[10px] uppercase tracking-widest text-[#DE5D83] font-bold">Nickel-Free</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Velvet Box</p>
                <p className="text-[10px] uppercase tracking-widest text-[#DE5D83] font-bold">Luxury Packaging</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
