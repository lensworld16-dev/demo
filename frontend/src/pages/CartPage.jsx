import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiMinus, HiPlus, HiArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <HiOutlineShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Shopping Cart <span className="text-gray-400 font-normal text-lg">({itemCount} items)</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100"
              >
                {/* Image */}
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.category}</p>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors">{item.name}</h3>
                      </Link>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <HiMinus className="w-3 h-3" />
                      </motion.button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <HiPlus className="w-3 h-3" />
                      </motion.button>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-28 h-fit"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders above ₹999</p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <HiArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/shop" className="block mt-3">
              <Button variant="ghost" className="w-full" size="md">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
