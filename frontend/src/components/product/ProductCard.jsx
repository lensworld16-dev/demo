import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const discount = getDiscountPercent(product.price, product.compare_price);
  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success('Added to cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    addItem(product);
    navigate('/cart');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white group border border-gray-100 transition-all duration-500 flex flex-col h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 shrink-0">
        <Link to={`/product/${product.slug}`}>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center z-10 hover:bg-white transition-all"
        >
          {isWishlisted ? (
            <HiHeart className="w-4 h-4 text-[#C41E3A]" />
          ) : (
            <HiOutlineHeart className="w-4 h-4 text-gray-400" />
          )}
        </motion.button>

        {/* Labels */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
           {product.is_featured && (
            <span className="px-2 py-0.5 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-wider">
              Exclusive
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-[#C41E3A] text-white text-[9px] font-bold uppercase tracking-wider">
              SAVE {discount}%
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 text-center flex flex-col flex-1">
        <Link to={`/product/${product.slug}`} className="block flex-1">
          <p className="text-[10px] text-[#C41E3A] font-bold uppercase tracking-widest mb-1.5">{product.category || 'Jewellery'}</p>
          <h3 className="text-xs font-semibold text-gray-900 mb-2 line-clamp-2 uppercase tracking-tight h-8">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-[10px] text-gray-400 line-through font-medium">{formatPrice(product.compare_price)}</span>
            )}
          </div>
        </Link>
        
        {/* Professional Action Buttons */}
        <div className="grid grid-cols-1 gap-2 mt-auto">
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 py-2.5 border border-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
            >
              Add to Cart
            </motion.button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2.5 bg-[#C41E3A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B0000] transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
