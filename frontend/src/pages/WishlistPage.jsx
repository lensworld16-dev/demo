import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

export default function WishlistPage() {
  const { wishlist: items, loading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item) => {
    addItem(item);
    removeFromWishlist(item.id);
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full shadow-sm rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 italic"
        >
          My <span className="font-bold not-italic">Wishlist</span>
        </motion.h1>
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} Total Items</span>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <HiOutlineHeart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Explore & Curate</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your list of most-desired pieces is currently empty.</p>
          <Link to="/shop"><Button size="lg" className="rounded-2xl px-12">Start Journey</Button></Link>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                <Link to={`/product/${item.slug}`} className="block relative">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-50 p-2">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      src={item.thumbnail || item.images?.[0] || ''}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-2xl"
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.category}</h3>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-sm font-bold text-gray-900 mb-4">{formatPrice(item.price)}</p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-[10px] uppercase tracking-widest font-bold rounded-xl" onClick={() => handleMoveToCart(item)}>
                      Move to Cart
                    </Button>
                    <motion.button
                      whileHover={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', color: '#EF4444' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 transition-all"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
