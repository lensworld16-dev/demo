import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi';
import Button from '../components/ui/Button';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center"
        >
          <HiOutlineCheckCircle className="w-14 h-14 text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          Order Placed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8 leading-relaxed"
        >
          Thank you for your purchase! Your order has been confirmed and we'll send you updates via email.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/orders">
            <Button variant="secondary">View Orders</Button>
          </Link>
          <Link to="/shop">
            <Button>
              <HiOutlineShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
