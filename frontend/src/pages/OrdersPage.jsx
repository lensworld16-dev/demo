import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import Skeleton from '../components/ui/Skeleton';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await orderAPI.getUserOrders();
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <HiOutlineShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Your order history will appear here.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order #{order.id?.slice(-8)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4 overflow-x-auto">
                  {items?.slice(0, 4).map((item, j) => (
                    <div key={j} className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={item.thumbnail || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {items?.length > 4 && (
                    <span className="text-sm text-gray-400">+{items.length - 4} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">{items?.length || 0} item(s)</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
