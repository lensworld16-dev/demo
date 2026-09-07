import React from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductReviewStats } from '../../data/reviewsData';

export default function ProductMiniCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600';
  const stats = getProductReviewStats(product.id);
  
  // Calculate coupon price (20% OFF with ARNIKA20)
  const couponPrice = Math.round(product.price * 0.8);
  const comparePrice = product.compare_price && product.compare_price > product.price 
    ? product.compare_price 
    : Math.round(product.price * 1.4);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Rating Pill - Compact corner pill (4.8 ★ | 61) */}
        <div className="absolute bottom-1.5 left-1.5 bg-white/95 backdrop-blur-xs text-gray-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10 shadow-xs border border-black/5 select-none pointer-events-none leading-none">
          <span>{stats.averageRating}</span>
          <span className="text-amber-500 text-[8px]">★</span>
          <span className="text-gray-300 font-normal">|</span>
          <span className="text-gray-500 font-medium">{stats.totalReviews}</span>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-grow justify-between gap-1.5">
        <div>
          {/* Price & Wishlist Row */}
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-bold text-sm sm:text-base text-gray-900">
                {formatPrice(product.price)}
              </span>
              {comparePrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <button
              onClick={handleToggleWishlist}
              className="text-pink-400 hover:text-[#DE5D83] transition-colors p-0.5 shrink-0"
              aria-label="Wishlist"
            >
              {isWishlisted ? (
                <HiHeart className="w-5 h-5 text-[#DE5D83]" />
              ) : (
                <HiOutlineHeart className="w-5 h-5 text-pink-400 hover:text-[#DE5D83]" />
              )}
            </button>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h4 className="text-xs sm:text-[13px] font-medium text-gray-700 line-clamp-1 group-hover:text-[#DE5D83] transition-colors leading-snug">
              {product.name}
            </h4>
          </Link>
        </div>

        {/* Add to Cart Soft Pink Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-2 sm:py-2.5 rounded-xl bg-[#FFD1DC] hover:bg-[#FFCAD4] active:scale-[0.98] text-gray-900 font-bold text-xs sm:text-[13px] tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center justify-center cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
