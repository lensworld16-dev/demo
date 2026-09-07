import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiLightningBolt } from 'react-icons/hi';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { getProductReviewStats } from '../../data/reviewsData';

export default function ProductCard({ product, aspect = "square", glowEffect = true, className }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef(null);

  const discount = getDiscountPercent(product.price, product.compare_price);
  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
  const reviewStats = getProductReviewStats(product?.id);

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

  const handleMouseMove = (e) => {
    if (cardRef.current && isHovered) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Make rotation much smoother and more subtle (divide by 30 instead of 20)
      const rotationX = (y - centerY) / 30;
      const rotationY = -(x - centerX) / 30;
      
      setRotation({ x: rotationX, y: rotationY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const aspectClasses = {
    portrait: "aspect-square",
    landscape: "aspect-square",
    square: "aspect-square",
  };

  return (
    <div className={cn("fashion-card-container group w-full h-full", className)}>
      <div
        ref={cardRef}
        className={cn(
          "fashion-card relative overflow-hidden rounded-xl bg-white flex flex-col h-full",
          glowEffect && "hover:shadow-xl hover:shadow-pink-200/50",
          "border border-pink-100/80 hover:border-pink-200 transition-all duration-[400ms] ease-out"
        )}
        style={{ 
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* The glass effect overlay */}
        <div className="fashion-card-glass absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Card main content */}
        <div className="fashion-card-content relative z-20 flex flex-col overflow-hidden rounded-xl h-full">

          {/* Quick Actions (Wishlist) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 bg-white/95 backdrop-blur-md text-[hsl(220,26%,18%)] rounded-full flex items-center justify-center hover:bg-[hsl(220,26%,18%)] hover:text-white transition-colors shadow-lg"
              aria-label="Toggle Wishlist"
            >
              {isWishlisted ? (
                <HiHeart className="w-5 h-5 text-[#DE5D83]" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Image section with parallax */}
          <Link to={`/product/${product.slug}`} className="block relative overflow-hidden">
            <div className={cn("parallax-image-container w-full bg-gray-50", aspectClasses[aspect])}>
              <img
                src={imageUrl}
                alt={product.name}
                className="parallax-image w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Rating Pill - Compact corner pill (4.8 ★ | 61) */}
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10 shadow-xs border border-black/5 select-none pointer-events-none leading-none">
              <span>{reviewStats.averageRating}</span>
              <span className="text-amber-500 text-[8px] sm:text-[9px]">★</span>
              <span className="text-gray-300 font-normal">|</span>
              <span className="text-gray-500 font-medium">{reviewStats.totalReviews}</span>
            </div>
          </Link>

          {/* Content section */}
          <div className="p-3 sm:p-5 bg-white flex flex-col flex-grow transition-all duration-500 border-t border-transparent group-hover:border-gray-50 relative z-20">
            <Link to={`/product/${product.slug}`} className="flex-grow flex flex-col">
              <h3 className="font-heading text-sm sm:text-lg font-medium leading-tight tracking-tight animate-fadeIn text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-400 animate-fadeIn mb-2 sm:mb-3 font-semibold" style={{ animationDelay: '0.1s' }}>
                {product.category || 'Curated Piece'}
              </p>
              
              <div className="flex items-center gap-1.5 sm:gap-2 mt-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <p className="font-heading font-semibold text-sm sm:text-lg text-gray-900">
                  {formatPrice(product.price)}
                </p>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through tracking-wider font-medium">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row gap-2 w-full animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={handleAddToCart}
                className="relative rounded-full px-2 sm:px-4 py-2 sm:py-2.5 flex-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest border border-pink-200 text-gray-800 hover:bg-pink-50/70 hover:border-pink-300 hover:text-[#DE5D83] flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300"
              >
                <HiOutlineShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                Add to Bag
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="shine-effect relative rounded-full px-2 sm:px-4 py-2 sm:py-2.5 flex-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-[#E05A75] hover:bg-[#D44E6A] text-white overflow-hidden hover:animate-shine flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300 shadow-md shadow-pink-200/80 hover:shadow-lg hover:shadow-pink-300"
              >
                <HiLightningBolt className="w-3 h-3 sm:w-4 sm:h-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
