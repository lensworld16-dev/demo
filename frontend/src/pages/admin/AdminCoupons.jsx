import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTicket, HiOutlinePlus, HiOutlineTrash, HiOutlineClock, HiOutlineTag, HiOutlineX } from 'react-icons/hi';
import { couponAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    max_discount: '',
    expires_at: ''
  });

  const fetchCoupons = async () => {
    try {
      const data = await couponAPI.adminGetAll();
      setCoupons(data.coupons || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.create(formData);
      toast.success('Coupon created successfully');
      setShowModal(false);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_value: '',
        max_discount: '',
        expires_at: ''
      });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponAPI.delete(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Syncing Vault...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Discount Coupons</h1>
            <p className="text-gray-500 mt-1">Manage active promotional codes</p>
         </div>
         <button 
           onClick={() => setShowModal(true)}
           className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
         >
            <HiOutlinePlus className="w-4 h-4" />
            Create Coupon
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => handleDelete(coupon.id)}
                 className="p-2 text-gray-400 hover:text-red-600 transition-colors"
               >
                  <HiOutlineTrash className="w-5 h-5" />
               </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HiOutlineTicket className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">{coupon.code}</h2>
                   <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${coupon.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {coupon.is_active ? 'Active' : 'Draft'}
                   </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-4">
                   <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount</span>
                      <span className="text-xs font-bold text-gray-900">
                         {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `${formatPrice(coupon.discount_value)} OFF`}
                      </span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min. Spend</span>
                      <span className="text-xs font-bold text-gray-900">{formatPrice(coupon.min_order_value)}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <HiOutlineClock className="w-3.5 h-3.5" />
                   <span>Exp: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {coupons.length === 0 && (
         <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <HiOutlineTag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No coupons in your vault yet.</p>
         </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 overflow-hidden"
            >
               <button 
                 onClick={() => setShowModal(false)}
                 className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
               >
                 <HiOutlineX className="w-6 h-6" />
               </button>

               <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">New Coupon Code</h2>

               <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Code</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. SUMMER50"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-gray-900 transition-all outline-none font-bold placeholder:text-gray-300" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Type</label>
                      <select 
                        value={formData.discount_type}
                        onChange={e => setFormData({...formData, discount_type: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-gray-900 transition-all outline-none font-bold"
                      >
                         <option value="percentage">Percentage (%)</option>
                         <option value="fixed">Fixed (₹)</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Value</label>
                      <input 
                        required
                        type="number" 
                        value={formData.discount_value}
                        onChange={e => setFormData({...formData, discount_value: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-gray-900 transition-all outline-none font-bold" 
                      />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Min Order</label>
                        <input 
                          type="number" 
                          value={formData.min_order_value}
                          onChange={e => setFormData({...formData, min_order_value: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-gray-900 transition-all outline-none font-bold" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Expiry Date</label>
                        <input 
                          type="date" 
                          value={formData.expires_at}
                          onChange={e => setFormData({...formData, expires_at: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:border-gray-900 transition-all outline-none font-bold" 
                        />
                    </div>
                 </div>

                 <button className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 mt-4">
                    Generate Coupon
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
