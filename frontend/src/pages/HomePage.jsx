import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI, settingAPI, categoryAPI } from '../services/api';
import Skeleton from '../components/ui/Skeleton';
import { Button } from '..';
import { cn } from '../lib/utils';
import { LinkCard } from '../components/ui/link-card';

const perks = [
  { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'On all orders in India' },
  { icon: HiOutlineShieldCheck, title: 'Anti-Tarnish', desc: 'Waterproof & durable' },
  { icon: HiOutlineRefresh, title: 'Easy Exchange', desc: '7-day hassle-free process' },
  { icon: HiOutlineSparkles, title: 'Fine Finish', desc: '14K-18K Gold plating' },
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
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section - Luxury Animated Slider */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-screen w-full overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
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

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "max-w-3xl",
                  activeHeroSlides[currentSlide]?.align === 'center' ? 'mx-auto text-center' : 
                  activeHeroSlides[currentSlide]?.align === 'right' ? 'ml-auto text-right' : 'text-left'
                )}
              >
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
                  <div className="h-px w-6 sm:w-8 bg-white/40" />
                  <span className="text-[10px] sm:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] text-white/80 uppercase">
                    {activeHeroSlides[currentSlide]?.tagline}
                  </span>
                  <div className="h-px w-6 sm:w-8 bg-white/40" />
                </motion.div>

                <motion.h1
                  variants={{
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -30 }
                  }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl xs:text-5xl sm:text-8xl lg:text-9xl font-light text-white tracking-tighter mb-6 sm:mb-8 italic leading-[1.1] sm:leading-none"
                >
                  {activeHeroSlides[currentSlide]?.title || activeHeroSlides[currentSlide]?.titlePart1} <br/> 
                  <span className="font-bold not-italic block mt-1 sm:mt-2 text-white drop-shadow-2xl">
                    {activeHeroSlides[currentSlide]?.titleBold || activeHeroSlides[currentSlide]?.titlePart2}
                  </span>
                </motion.h1>

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
                    <Button size="lg" className="rounded-none px-6 sm:px-16 h-12 sm:h-16 border-2 border-white/20 bg-white text-black hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black shadow-2xl">
                      {activeHeroSlides[currentSlide]?.cta || "Discovery Pool"}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-50">
          {activeHeroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="group flex flex-col items-center gap-1 sm:gap-2"
            >
              <div className={cn(
                "h-0.5 sm:h-1 transition-all duration-500 rounded-full",
                currentSlide === i ? "w-8 sm:w-12 bg-white" : "w-4 sm:w-6 bg-white/30 group-hover:bg-white/50"
              )} />
              <span className={cn(
                "text-[8px] sm:text-[10px] font-bold tracking-widest transition-opacity duration-500",
                currentSlide === i ? "opacity-100 text-white" : "opacity-0"
              )}>0{i + 1}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Perks Bar - Professional & Clean */}
      <section className="py-8 sm:py-12 bg-[#F9F9FB] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="col-span-1"
              >
                <LinkCard
                  title={cat.name}
                  description={cat.description || "Explore our exclusive collection of premium crafted jewellery."}
                  imageUrl={cat.image}
                  href={`/shop?category=${cat.slug}`}
                />
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

