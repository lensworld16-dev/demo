import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';
import { 
  HiOutlineChevronLeft, 
  HiOutlineShoppingBag, 
  HiOutlineTruck, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCreditCard
} from 'react-icons/hi';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await orderAPI.getById(id);
        console.log("Order Data:", data);
        setOrder(data.order);
      } catch (err) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) return <div className="p-24 text-center">Loading Order Journey...</div>;
  if (!order) return <div className="p-24 text-center">Order not found</div>;

  const steps = [
    { label: 'Order Placed', status: 'pending', icon: HiOutlineClock },
    { label: 'Confirmed', status: 'confirmed', icon: HiOutlineCheckCircle },
    { label: 'Processing', status: 'processing', icon: HiOutlineCog },
    { label: 'Shipped', status: 'shipped', icon: HiOutlineTruck },
    { label: 'Delivered', status: 'delivered', icon: HiOutlineCheckCircle },
  ];

  const currentStatusIndex = steps.findIndex(s => s.status === order.status?.toLowerCase());
  const activeIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  // Safe parsing for items and address
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  } catch (e) {
    console.error('Error parsing order items:', e);
  }

  const shipping_address = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address || '{}') 
    : (order.shipping_address || {});

  const orderTotal = Number(order.total || 0);
  const orderSubtotal = Number(order.subtotal || orderTotal - (Number(order.shipping) || 0));
  const shippingFee = Number(order.shipping || 0);

  return (
    <div className="min-h-screen bg-[#FDFDFC] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-10 hover:text-gray-900 transition-colors">
          <HiOutlineChevronLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-500/5 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-[10px] font-bold text-[#C41E3A] uppercase tracking-[0.3em] mb-2">Track Voyage</p>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h1>
              <p className="text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
               <span className="px-5 py-2 rounded-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest">
                  {order.status}
               </span>
            </div>
          </div>

          {/* Stepper Tracking UI */}
          <div className="relative flex justify-between mb-16 px-4">
             <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0" />
             <div 
               className="absolute top-5 left-0 h-0.5 bg-gray-900 transition-all duration-1000 -z-0" 
               style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
             />
             
             {steps.map((step, i) => {
               const Icon = step.icon;
               const isCompleted = i <= activeIndex;
               return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${isCompleted ? 'bg-gray-900 text-white scale-110' : 'bg-white text-gray-300 border border-gray-100'}`}>
                        <Icon className="w-5 h-5" />
                     </div>
                     <span className={`text-[8px] font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                        {step.label}
                     </span>
                  </div>
               );
             })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pt-12 border-t border-gray-50">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-900">
                   <HiOutlineLocationMarker className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase tracking-widest">Shipping To</h3>
                </div>
                <div className="text-sm text-gray-500 leading-relaxed pl-8">
                  <p className="font-bold text-gray-900">{shipping_address.name || 'Customer'}</p>
                  <p>{shipping_address.address || 'Address not provided'}</p>
                  <p>{shipping_address.city}, {shipping_address.state}</p>
                  <p className="mt-1 font-bold">{shipping_address.zip}</p>
                  {shipping_address.phone && <p className="mt-1">Phone: {shipping_address.phone}</p>}
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-900">
                   <HiOutlineCreditCard className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase tracking-widest">Payment</h3>
                </div>
                <div className="text-sm text-gray-500 pl-8">
                   <p className="font-bold text-emerald-600 uppercase tracking-widest text-[10px]">
                     {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid via Razorpay'}
                   </p>
                   <p className="mt-1">Transaction ID:</p>
                   <p className="font-mono text-[10px] break-all">{order.payment_id || order.razorpay_payment_id || 'N/A'}</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-900">
                   <HiOutlineShoppingBag className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase tracking-widest">Summary</h3>
                </div>
                <div className="space-y-2 pl-8">
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Items ({items.length})</span>
                      <span className="font-bold">{formatPrice(orderSubtotal)}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-emerald-500 font-bold">{shippingFee > 0 ? formatPrice(shippingFee) : 'FREE'}</span>
                   </div>
                   <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-50">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-[#FAF9F6] rounded-[2rem] p-8">
             <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-gray-900 mb-6">Manifest Items</h3>
             <div className="space-y-4">
                {items.map((item, i) => (
                   <div key={i} className="flex items-center justify-between pb-4 border-b border-white last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-white">
                            <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category} • Qty: {item.quantity}</p>
                         </div>
                      </div>
                      <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function HiOutlineCog(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
