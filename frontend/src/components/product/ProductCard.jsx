import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiLightningBolt } from 'react-icons/hi';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function ProductCard({ product, aspect = "portrait", glowEffect = true, className }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef(null);

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
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };

  return (
    <div className={cn("fashion-card-container group w-full h-full", className)}>
      <div
        ref={cardRef}
        className={cn(
          "fashion-card relative overflow-hidden rounded-xl bg-white flex flex-col h-full",
          glowEffect && "hover:shadow-2xl",
          "border border-gray-100 transition-all duration-[400ms] ease-out"
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
                <HiHeart className="w-5 h-5 text-[#C41E3A]" />
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
            
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
              {product.is_featured && (
                <div className="fashion-card-badge animate-float px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-[hsl(39,100%,67%)] text-[hsl(220,26%,18%)] shadow-sm relative top-0 right-0 transform-none">
                  Highlight
                </div>
              )}
              {discount > 0 && (
                <div className="fashion-card-badge px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-[#C41E3A] text-white shadow-sm relative top-0 right-0 transform-none">
                  -{discount}%
                </div>
              )}
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
                className="relative rounded-full px-2 sm:px-4 py-2 sm:py-2.5 flex-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest border border-gray-200 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300"
              >
                <HiOutlineShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                Add to Bag
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="shine-effect relative rounded-full px-2 sm:px-4 py-2 sm:py-2.5 flex-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-[#C41E3A] hover:bg-[#8B0000] text-white overflow-hidden hover:animate-shine flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg"
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
