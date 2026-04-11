import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod',
  });

  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          thumbnail: item.thumbnail || (item.images && item.images[0]) || '',
        })),
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        tax: Number(tax),
        total: Number(total),
        shipping_address: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
        },
        payment_method: form.paymentMethod,
      };

      console.log('Sending Order Data:', orderData);
      await orderAPI.create(orderData);
      
      clearCart();
      setShowSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error('Checkout Error:', err);
      toast.error(err.message || 'Failed to place order. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !showSuccess) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 relative">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="p-8 sm:p-12 text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                   >
                     <HiOutlineCheckCircle className="w-14 h-14 text-emerald-500" />
                   </motion.div>
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Order Placed!</h2>
                <p className="text-gray-500 mb-10 leading-relaxed text-sm">
                  Your premium jewellery collection is being prepared. <br />
                  We'll notify you as soon as it's expertly packaged and shipped.
                </p>

                <div className="space-y-4">
                   <Link 
                     to="/profile?tab=orders" 
                     className="flex items-center justify-center gap-3 w-full py-5 bg-gray-900 text-white rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-gray-200"
                   >
                     <HiOutlineShoppingBag className="w-5 h-5" />
                     View My Orders
                   </Link>
                   
                   <Link 
                     to="/" 
                     className="flex items-center justify-center gap-3 w-full py-5 bg-white text-gray-900 border-2 border-gray-900/5 rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                   >
                     Continue Shopping
                     <HiOutlineArrowRight className="w-5 h-5" />
                   </Link>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    placeholder="Street address, apartment, suite"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all font-medium h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  { value: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === method.value
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{method.label}</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-500/5">
              <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-widest text-[10px]">Order Summary</h3>

              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50 shadow-sm">
                      <img
                        src={item.thumbnail || (item.images && item.images[0]) || ''}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tighter">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-500' : 'text-gray-900'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-black text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full py-5 rounded-2xl shadow-2xl shadow-gray-200" size="lg" loading={loading} disabled={loading}>
                <HiOutlineLockClosed className="w-4 h-4" />
                PLACE ORDER
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2">
                 <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                 <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                    Bank-Grade Secure Transaction
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
