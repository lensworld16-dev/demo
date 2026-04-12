import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import RippleWaveLoader from '../../components/ui/RippleWaveLoader';
import { 
  HiOutlineUser, 
  HiOutlineLocationMarker, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineChevronDown, 
  HiOutlineChevronUp, 
  HiOutlineExternalLink, 
  HiOutlineTrash,
  HiOutlineShoppingBag 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.adminGetAll();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    
    try {
      await orderAPI.delete(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success('Order deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <RippleWaveLoader />
        <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">Syncing Transaction Logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-widest">
          {orders.length} Total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-medium">No orders found in the system yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            let items = [];
            let address = {};
            try {
              items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
              address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
            } catch (e) {
              console.error('Error parsing order data:', e);
            }
            const isExpanded = expandedId === order.id;

            return (
              <motion.div 
                key={order.id} 
                layout
                className={`bg-white rounded-3xl border transition-all duration-300 ${isExpanded ? 'border-gray-900 shadow-xl' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}
              >
                <div 
                  className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isExpanded ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400'}`}>
                      <HiOutlineShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter">Order #{order.id?.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                        {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                       <p className="text-xs font-bold text-gray-900">{address?.name || order.display_name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
                       <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-4 py-2 text-[10px] font-bold rounded-full border border-transparent uppercase tracking-widest cursor-pointer outline-none ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                          title="Delete Order"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                      {isExpanded ? <HiOutlineChevronUp className="w-5 h-5 text-gray-400" /> : <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-50"
                    >
                      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left: Customer Info */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <HiOutlineUser className="w-4 h-4" /> Customer Details
                           </h3>
                           <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                   <HiOutlineUser className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                   <p className="text-sm font-bold text-gray-900">{address?.name}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                   <HiOutlinePhone className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                   <a href={`tel:${address?.phone}`} className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors uppercase">{address?.phone || 'N/A'}</a>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                   <HiOutlineMail className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                   <p className="text-sm font-bold text-gray-900 lowercase">{order.email || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                   <HiOutlineLocationMarker className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                                   <p className="text-sm font-bold text-gray-900 leading-relaxed capitalize">
                                      {address?.address}<br />
                                      {address?.city}, {address?.state} - {address?.zip}
                                   </p>
                                </div>
                              </div>
                           </div>
                        </div>

                        {/* Right: Items Manifest */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <HiOutlineShoppingBag className="w-4 h-4" /> Ordered Items
                           </h3>
                           <div className="bg-white border border-gray-100 rounded-[2rem] p-4 divide-y divide-gray-50">
                              {items?.map((item, j) => (
                                <div key={j} className="flex items-center gap-4 py-4 first:pt-2 last:pb-2">
                                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                    <img src={item.thumbnail || ''} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xs font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                  </div>
                                </div>
                              ))}
                              <div className="pt-6 mt-2 space-y-2">
                                 <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
                                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{order.payment_method?.toUpperCase()}</span>
                                 </div>
                                 <div className="flex justify-between items-center px-2 pt-2 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Total Payout</span>
                                    <span className="text-lg font-black text-gray-900">{formatPrice(order.total)}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
