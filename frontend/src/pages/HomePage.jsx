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
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000",
    tagline: "ANTI-TARNISH & WATERPROOF",
    title: "Timeless",
    titleBold: "Elegance",
    cta: "Shop Jewelry",
    align: "center"
  },
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000",
    tagline: "18K GOLD PLATED",
    title: "Bold &",
    titleBold: "Sophisticated",
    cta: "Best Sellers",
    align: "left"
  },
  {
    image: "https://images.unsplash.com/photo-1611085583191-a3b1ae84fd9b?auto=format&fit=crop&q=80&w=2000",
    tagline: "LUXURY ESSENTIALS",
    title: "Adorn",
    titleBold: "Yourself",
    cta: "Summer Collection",
    align: "right"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHeroSlides, setActiveHeroSlides] = useState(heroSlides);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [config, setConfig] = useState({
    expertly_crafted_title: "The Art of Adornment",
    expertly_crafted_subtitle: "Expertly Crafted",
    expertly_crafted_description: "Every piece of Sajhnaa jewellery is a testament to timeless elegance and modern craftsmanship.",
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
        const [featData, bestData, heroData, craftData, catData] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ bestseller: 'true', limit: 4 }),
          settingAPI.get('hero_slides'),
          settingAPI.get('expertly_crafted'),
          categoryAPI.getAll()
        ]);
        
        setFeatured(featData.products || []);
        setBestSellers(bestData.products || []);
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
    <div className="bg-white">
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-12 w-full h-full relative">
            <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cn(
                    "absolute transition-all duration-300 w-full md:w-auto p-4",
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

                  {(activeHeroSlides[currentSlide]?.titlePart1 || activeHeroSlides[currentSlide]?.titlePart2) && (
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
                      {activeHeroSlides[currentSlide]?.titlePart1 && <>{activeHeroSlides[currentSlide]?.titlePart1} <br/></>}
                      <span className={cn(
                        "font-bold not-italic block mt-1 sm:mt-2",
                        activeHeroSlides[currentSlide]?.textColor === 'dark' ? 'text-black' : 'text-white'
                      )}>
                        {activeHeroSlides[currentSlide]?.titlePart2}
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
                      className="flex flex-col gap-8"
                      style={{ alignItems: activeHeroSlides[currentSlide]?.align === 'center' ? 'center' : activeHeroSlides[currentSlide]?.align === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                      <Link to={activeHeroSlides[currentSlide]?.link || "/shop"}>
                        <Button 
                          size="lg" 
                          className={cn(
                            "rounded-none px-6 sm:px-16 h-12 sm:h-16 border-2 transition-all duration-500 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black shadow-2xl",
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
                CODE: SAJHNAA20
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#C41E3A]/40" />
            </div>
          ))}
        </motion.div>
      </div>
      {/* Categories - Elegant Grid */}
      <section className="pt-6 sm:pt-12 pb-4 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-light text-gray-900 mb-2 sm:mb-4 italic tracking-tight">
              Shop by <span className="font-bold not-italic">Category</span>
            </h2>
            <div className="w-20 h-0.5 bg-accent-gold mx-auto" />
          </motion.div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 sm:gap-8 pb-8 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id || cat.slug}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ amount: 0.3, once: false }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="snap-start shrink-0 w-[100px] sm:w-[180px]"
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
        </div>
      </section>

      {/* Expertly Crafted Selection */}
      <section className="pt-0 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative py-6 sm:py-20 mb-10 overflow-hidden"
          >
            {/* Darker reddish background glow - more visible focus */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C41E3A]/10 to-transparent opacity-100 pointer-events-none" />
            
            <div className="relative flex items-center justify-center gap-4 sm:gap-8 px-4">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '4rem' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="hidden xs:block h-px bg-[#C41E3A]/40" 
              />
              <h2 className="text-3xl sm:text-6xl font-light text-gray-900 italic text-center whitespace-nowrap">
                {config.expertly_crafted_title.split(' ').slice(0, -1).join(' ')} <span className="font-bold not-italic">{config.expertly_crafted_title.split(' ').slice(-1)}</span>
              </h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '4rem' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="hidden xs:block h-px bg-[#C41E3A]/40" 
              />
            </div>
          </motion.div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Perks Bar - Professional & Clean */}
      <section className="py-4 sm:py-20 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex sm:grid sm:grid-cols-5 gap-6 sm:gap-8 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2 shrink-0 w-[110px] sm:w-auto"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <perk.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-xs font-black text-gray-900 uppercase tracking-widest mb-0.5 whitespace-nowrap">{perk.title}</p>
                  <p className="hidden xs:block text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-tight">{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="pt-4 sm:pt-16 pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-16"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
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
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
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

