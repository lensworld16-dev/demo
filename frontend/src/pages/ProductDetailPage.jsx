import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiMinus, HiPlus, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiChevronLeft, HiStar } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import { formatPrice, getDiscountPercent } from '../utils/helpers';
import Skeleton from '../components/ui/Skeleton';
import ProductMiniCard from '../components/product/ProductMiniCard';
import CustomerReviews from '../components/product/CustomerReviews';
import { getProductReviewStats } from '../data/reviewsData';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 341, averageRating: 4.9 });
  const { addItem } = useCart();

  const scrollToReviews = () => {
    document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await productAPI.getBySlug(slug);
        const currentProd = data.product;
        setProduct(currentProd);

        // Load dynamic reviews stats for this piece
        const stats = getProductReviewStats(currentProd.id);
        setReviewStats(stats);

        // Fetch all products to populate recently viewed & related
        const allRes = await productAPI.getAll({ limit: 30 });
        const allProds = allRes.products || [];

        // Update recently viewed in localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('arnika_recently_viewed') || '[]');
          const filtered = stored.filter(p => p.id !== currentProd.id && p.slug !== currentProd.slug);
          const updated = [currentProd, ...filtered].slice(0, 10);
          localStorage.setItem('arnika_recently_viewed', JSON.stringify(updated));
          
          let recents = filtered.filter(p => p.id !== currentProd.id);
          if (recents.length < 4) {
            const fillers = allProds.filter(p => p.id !== currentProd.id && !recents.some(r => r.id === p.id));
            recents = [...recents, ...fillers];
          }
          setRecentlyViewed(recents.slice(0, 4));
        } catch {
          const recents = allProds.filter(p => p.id !== currentProd.id).slice(0, 4);
          setRecentlyViewed(recents);
        }

        // Populate related products (matching category or popular items)
        let related = allProds.filter(p => p.id !== currentProd.id && p.category?.toLowerCase() === currentProd.category?.toLowerCase());
        if (related.length < 4) {
          const extra = allProds.filter(p => p.id !== currentProd.id && !related.some(r => r.id === p.id));
          related = [...related, ...extra];
        }
        setRelatedProducts(related.slice(0, 4));
      } catch {
        // Demo product fallback
        const fallback = {
          id: '1',
          name: 'Minimal Watch',
          slug: 'minimal-watch',
          description: 'A beautifully crafted minimal watch with premium materials. Features a Japanese quartz movement, sapphire crystal glass, and genuine leather strap. Water resistant to 50 meters. Perfect for everyday elegance.',
          price: 4999,
          compare_price: 7999,
          category: 'Accessories',
          tags: ['watch', 'minimal', 'premium'],
          images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800',
          ],
          stock: 25,
          is_featured: true,
        };
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, { isGift, giftWrapPrice: isGift ? 50 : 0 });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity, { isGift, giftWrapPrice: isGift ? 50 : 0 });
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.compare_price);
  const images = product.images?.length ? product.images : [product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors group">
          <HiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/5] bg-gray-50 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute top-6 left-6 px-3 py-1.5 bg-[#C41E3A] text-white text-[10px] font-bold uppercase tracking-widest">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ opacity: 1 }}
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-32 overflow-hidden shrink-0 transition-all duration-300 ${
                      selectedImage === i ? 'opacity-100 ring-1 ring-gray-900 ring-offset-2' : 'opacity-50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col pt-4 sm:pt-10"
          >
            <p className="text-[11px] text-[#DE5D83] font-bold uppercase tracking-[0.25em] mb-2">{product.category}</p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-2.5 tracking-tight leading-tight uppercase font-heading">
              {product.name}
            </h1>

            {/* Price & Rating Header - Clean, Simple, Unified */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.compare_price && product.compare_price > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-gray-400 line-through font-normal">
                      {formatPrice(product.compare_price)}
                    </span>
                    <span className="text-xs font-bold text-[#DE5D83] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200/80">
                      {getDiscountPercent(product.price, product.compare_price)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Subtitle: Rating, Stock, Taxes in one clean, minimal line */}
              <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 mt-2 text-xs text-gray-500">
                <button
                  onClick={scrollToReviews}
                  className="flex items-center gap-1 text-amber-500 hover:text-amber-600 font-semibold cursor-pointer transition-colors"
                  title="Click to view customer reviews"
                >
                  <HiStar className="w-3.5 h-3.5 fill-current" />
                  <span className="text-gray-800">{reviewStats.averageRating}</span>
                  <span className="text-gray-500 font-normal">({reviewStats.totalReviews})</span>
                </button>
                <span className="text-gray-300">•</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium">Out of Stock</span>
                )}
                <span className="text-gray-300">•</span>
                <span>Free shipping & taxes included</span>
              </div>
            </div>

            {/* Actions Form - Clean, Intuitive & Zero Clutter */}
            <div className="w-full lg:w-4/5 mb-6">
              {/* Subtle Gift Wrap Option */}
              <label className="flex items-center gap-2 mb-4 cursor-pointer select-none text-xs sm:text-sm text-gray-700 w-fit">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 rounded border-pink-300 text-[#DE5D83] accent-[#DE5D83] cursor-pointer"
                />
                <span>🎁 Add Gift Packaging <span className="font-semibold text-gray-900">(+₹50)</span></span>
              </label>

              {/* Row 1: Quantity + Add To Cart + Wishlist Heart Icon */}
              <div className="flex items-center gap-2.5 mb-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-pink-200 rounded-xl bg-pink-50/30 w-28 h-12 px-2 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <HiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <HiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 h-12 rounded-xl bg-[#DE5D83] hover:bg-[#c94d71] text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-pink-200/70 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-1.5"
                      >
                        ✓ Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        Add To Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Wishlist Heart Icon Button */}
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                    wishlisted 
                      ? 'border-[#DE5D83] bg-pink-50 text-[#DE5D83]' 
                      : 'border-pink-200 text-gray-600 hover:text-[#DE5D83] hover:bg-pink-50/40'
                  }`}
                  title={wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist"
                >
                  {wishlisted ? <HiHeart className="w-5 h-5 text-[#DE5D83]" /> : <HiOutlineHeart className="w-5 h-5" />}
                </button>
              </div>

              {/* Row 2: Buy Now - Full Width Instant Checkout */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full h-12 rounded-xl border-2 border-[#DE5D83] text-[#DE5D83] bg-white hover:bg-pink-50/70 font-bold text-sm sm:text-base tracking-wide transition-all shadow-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="space-y-3 pt-6 border-t border-pink-100/70 mb-6">
              {[
                { icon: HiOutlineTruck, text: 'Complimentary delivery across India' },
                { icon: HiOutlineShieldCheck, text: 'Certified authenticity & secure checkout' },
                { icon: HiOutlineRefresh, text: '7-day seamless exchange policy' },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 text-xs font-medium text-gray-600 uppercase tracking-widest">
                  <perk.icon className="w-4 h-4 text-[#DE5D83] shrink-0" />
                  {perk.text}
                </div>
              ))}
            </div>

            {/* Description Section */}
            {product.description && (
              <div className="pt-6 border-t border-pink-100/70">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-3">
                  About This Piece
                </h3>
                <div className="prose prose-sm text-gray-600 leading-relaxed text-justify">
                  <p>{product.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-pink-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-medium text-gray-900 tracking-tight">
                Recently Viewed
              </h2>
              <span className="text-[11px] text-[#DE5D83] font-semibold sm:hidden flex items-center gap-1">
                Swipe &rarr;
              </span>
            </div>

            {/* Mobile Swipe Container / Desktop 4-Col Grid */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
              {recentlyViewed.map((item) => (
                <div key={item.id} className="w-[170px] xs:w-[185px] sm:w-auto shrink-0 snap-start">
                  <ProductMiniCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-pink-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-medium text-gray-900 tracking-tight">
                You May Also Like
              </h2>
              <span className="text-[11px] text-[#DE5D83] font-semibold sm:hidden flex items-center gap-1">
                Swipe &rarr;
              </span>
            </div>

            {/* Mobile Swipe Container / Desktop 4-Col Grid */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-6 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
              {relatedProducts.map((item) => (
                <div key={item.id} className="w-[170px] xs:w-[185px] sm:w-auto shrink-0 snap-start">
                  <ProductMiniCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews - Placed at the very bottom */}
        <CustomerReviews 
          product={product} 
          onStatsUpdate={setReviewStats} 
        />
      </div>
    </motion.div>
  );
}
