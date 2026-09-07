import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiMinus, HiPlus, HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 flex items-center justify-center rounded-none border border-gray-100">
            <HiOutlineShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-light text-gray-900 mb-2 uppercase tracking-widest">Your Bag is Empty</h2>
          <p className="text-gray-400 mb-8 text-[10px] uppercase tracking-[0.2em]">Select items to curate your collection.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center">
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-10 sm:pt-16 bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 border-b border-gray-100 pb-6"
      >
        <h1 className="text-3xl font-light text-gray-900 uppercase tracking-widest">
          Shopping Bag <span className="text-gray-400 font-normal text-sm ml-2">({itemCount})</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-4 sm:gap-6 bg-white border-b border-gray-100 pb-6 group"
              >
                {/* Image */}
                <Link to={`/product/${item.slug}`} className="shrink-0 relative overflow-hidden bg-gray-50 aspect-[4/5] w-24 sm:w-32">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    src={item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <p className="text-[9px] text-[#C41E3A] uppercase tracking-[0.2em]">{item.category}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-medium text-gray-900 uppercase tracking-wide text-sm">{item.name}</h3>
                    </Link>
                    {item.isGift && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DE5D83] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md mt-1.5">
                        🎁 Gift Wrapped (+₹50)
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-900 w-24 h-[35px]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <HiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <HiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice((parseFloat(item.price) + (item.isGift ? 50 : 0)) * item.quantity)}</p>
                      {item.isGift && (
                        <p className="text-[10px] text-gray-400">incl. ₹50 gift wrap</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-28 h-fit"
        >
          <div className="bg-gray-50 p-8 border border-gray-100 text-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em] mb-6">Summary</h3>

            <div className="space-y-4 mb-8 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Delivery</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                </span>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Total</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider text-right mt-1">Includes all applicable duties</p>
              </div>
            </div>

            <Link to="/checkout" className="block w-full">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                Checkout
                <HiArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <Link to="/shop" className="block w-full mt-3">
              <button className="btn-outline w-full p-2 text-[10px]">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
