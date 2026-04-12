import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiMinus, HiPlus, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiChevronLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import { formatPrice, getDiscountPercent } from '../utils/helpers';
import Skeleton from '../components/ui/Skeleton';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await productAPI.getBySlug(slug);
        setProduct(data.product);
      } catch {
        // Demo product fallback
        setProduct({
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
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
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
            <p className="text-[10px] text-[#C41E3A] font-bold uppercase tracking-[0.2em] mb-4">{product.category}</p>
            <h1 className="text-3xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight uppercase font-heading">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-gray-400 line-through tracking-wider font-medium">{formatPrice(product.compare_price)}</span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 leading-relaxed mb-10 text-justify">
              <p>{product.description}</p>
            </div>

            {/* Stock */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">✓ In Stock</span>
              ) : (
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">✗ Out of Stock / Waitlist</span>
              )}
            </div>

            {/* Actions Form */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full lg:w-4/5 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between border border-gray-900 w-full sm:w-32 h-[50px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex gap-2 h-[50px]">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Added
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Add to Bag
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`w-[50px] border flex items-center justify-center transition-colors ${
                    wishlisted ? 'border-[#C41E3A] bg-red-50 text-[#C41E3A]' : 'border-gray-900 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {wishlisted ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Perks */}
            <div className="space-y-4 pt-8 border-t border-gray-100">
              {[
                { icon: HiOutlineTruck, text: 'Complimentary delivery across India' },
                { icon: HiOutlineShieldCheck, text: 'Certified authenticity & secure checkout' },
                { icon: HiOutlineRefresh, text: '7-day seamless exchange policy' },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-4 text-xs font-medium text-gray-600 uppercase tracking-widest">
                  <perk.icon className="w-5 h-5 text-gray-400 shrink-0" />
                  {perk.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
