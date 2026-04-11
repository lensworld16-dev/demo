import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiMinus, HiPlus, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiChevronLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import { formatPrice, getDiscountPercent } from '../utils/helpers';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

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
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <HiChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === i ? 'border-gray-900' : 'border-transparent'
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  Save {formatPrice(product.compare_price - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <HiMinus className="w-4 h-4" />
                </motion.button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                size="lg"
                className="flex-1"
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      ✓ Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <HiOutlineShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                {wishlisted ? (
                  <HiHeart className="w-6 h-6 text-red-500" />
                ) : (
                  <HiOutlineHeart className="w-6 h-6 text-gray-600" />
                )}
              </motion.button>
            </div>

            {/* Perks */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              {[
                { icon: HiOutlineTruck, text: 'Free shipping on orders above ₹999' },
                { icon: HiOutlineShieldCheck, text: '100% secure payment' },
                { icon: HiOutlineRefresh, text: '7-day easy returns' },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 text-sm text-gray-500">
                  <perk.icon className="w-5 h-5 text-gray-400 shrink-0" />
                  {perk.text}
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex items-center gap-2 mt-6 flex-wrap">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
