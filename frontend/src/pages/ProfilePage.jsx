import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderAPI, userAPI, imageAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineShoppingBag, 
  HiOutlineHeart, 
  HiOutlineLocationMarker, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiOutlineChevronRight,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCamera,
  HiOutlineCalendar,
  HiOutlineCreditCard
} from 'react-icons/hi';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useLocation, Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, dbUser, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'overview';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (params.get('tab')) {
      setActiveTab(params.get('tab'));
    }
  }, [location.search]);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: dbUser?.display_name || user?.displayName || '',
    photo_url: dbUser?.photo_url || user?.photoURL || '',
  });

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'overview') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderAPI.getUserOrders();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const data = await imageAPI.upload(file, 'sajhnaa/users');
      const photo_url = data.image.secure_url;
      await userAPI.updateProfile({ ...profileData, photo_url });
      setProfileData(prev => ({ ...prev, photo_url }));
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Dashboard', icon: HiOutlineUser },
    { id: 'orders', label: 'My Orders', icon: HiOutlineShoppingBag },
    { id: 'wishlist', label: 'My Wishlist', icon: HiOutlineHeart, link: '/wishlist' },
    { id: 'addresses', label: 'Saved Addresses', icon: HiOutlineLocationMarker },
    { id: 'settings', label: 'Settings', icon: HiOutlineCog },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return HiOutlineCheckCircle;
      case 'shipped': return HiOutlineTruck;
      case 'processing': return HiOutlineClock;
      default: return HiOutlineClock;
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FDFDFC] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Enhanced Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 mb-6 shadow-xl shadow-gray-500/5 text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-gray-900 to-gray-800" />
               <div className="relative mt-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg ring-4 ring-gray-50 mx-auto overflow-hidden">
                      {profileData.photo_url ? (
                        <img src={profileData.photo_url} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-2xl uppercase">
                          {profileData.display_name?.[0] || user?.email?.[0]}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white">
                      {uploadingAvatar ? (
                           <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                           </svg>
                      ) : <HiOutlineCamera className="w-4 h-4" />}
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" />
                    </label>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900">{profileData.display_name || 'Valued Member'}</h3>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Premium Customer</p>
                    </div>
                  </div>
               </div>
            </div>

            <nav className="bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-xl shadow-gray-500/5">
              {sidebarLinks.map((link) => (
                link.link ? (
                  <Link
                    key={link.id}
                    to={link.link}
                    className="flex items-center justify-between w-full px-5 py-4 rounded-3xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all group mb-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-900 transition-colors">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <HiOutlineChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                ) : (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`flex items-center justify-between w-full px-5 py-4 rounded-3xl text-sm font-bold transition-all group mb-1 ${
                      activeTab === link.id 
                        ? 'bg-gray-900 text-white shadow-[0_10px_30px_rgba(26,26,46,0.3)]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeTab === link.id ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-900'}`}>
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <HiOutlineChevronRight className={`w-4 h-4 transition-all ${activeTab === link.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                )
              ))}
              <div className="mt-4 pt-4 border-t border-gray-50">
                 <button onClick={logout} className="flex items-center gap-4 w-full px-5 py-4 rounded-3xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-50">
                       <HiOutlineLogout className="w-5 h-5" />
                    </div>
                    <span>Sign Out</span>
                 </button>
              </div>
            </nav>
          </aside>

          {/* Dynamic Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Total Spent', value: formatPrice(orders.reduce((acc, o) => acc + (o.total || 0), 0)), icon: HiOutlineCreditCard, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                      { label: 'Orders Placed', value: orders.length, icon: HiOutlineShoppingBag, bg: 'bg-blue-50', color: 'text-blue-600' },
                      { label: 'Wishlist Items', value: wishlistCount, icon: HiOutlineHeart, bg: 'bg-pink-50', color: 'text-pink-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                           <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                           <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Profile Form */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <HiOutlineUser className="w-7 h-7 text-gray-400" />
                      General Settings
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                             Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <HiOutlineUser className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.display_name}
                              onChange={(e) => setProfileData({...profileData, display_name: e.target.value})}
                              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-900 outline-none transition-all text-sm font-medium shadow-inner"
                              placeholder="e.g. Aman Raj"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Primary Email</label>
                          <div className="relative">
                            <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              disabled
                              type="email"
                              value={user?.email}
                              className="w-full pl-14 pr-6 py-4 bg-gray-100 border border-transparent rounded-3xl text-sm font-medium text-gray-500 cursor-not-allowed shadow-inner"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Join Date</label>
                          <div className="relative">
                            <HiOutlineCalendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <div className="w-full pl-14 pr-6 py-4 bg-gray-100 border border-transparent rounded-3xl text-sm font-medium text-gray-500 shadow-inner">
                              {new Date(dbUser?.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" size="lg" className="rounded-2xl px-12 uppercase tracking-widest text-xs font-bold shadow-xl shadow-gray-200">Save Profile</Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm min-h-[600px]">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-gray-50 pb-8">
                        <div>
                           <h2 className="text-3xl font-bold text-gray-900">Track Orders</h2>
                           <p className="text-sm text-gray-500 mt-1">Real-time status of your jewellery deliveries</p>
                        </div>
                        <button onClick={loadOrders} className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-all">
                           Sync Status
                        </button>
                      </div>

                      {loadingOrders ? (
                        <div className="space-y-6">
                           {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-[2rem] animate-pulse" />)}
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-24">
                           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <HiOutlineShoppingBag className="w-12 h-12 text-gray-200" />
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 mb-2">Adventure awaits!</h3>
                           <p className="text-gray-500">You haven't added any premium pieces to your collection yet.</p>
                           <Link to="/shop" className="mt-8 inline-block px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">Start Shopping</Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           {orders.map((order) => {
                             const StatusIcon = getStatusIcon(order.status);
                             return (
                               <div key={order.id} className="bg-[#FCFCFD] border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 hover:shadow-xl hover:shadow-gray-200/40 transition-all group overflow-hidden relative">
                                  <div className="flex flex-col xl:flex-row gap-8">
                                     <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                              #{order.id.slice(-8).toUpperCase()}
                                           </span>
                                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                              <StatusIcon className="w-3.5 h-3.5" />
                                              {order.status}
                                           </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900">
                                           Luxury Collection Order
                                        </h4>
                                        <div className="flex items-center gap-6 mt-2">
                                           <div className="flex items-center gap-2">
                                              <HiOutlineClock className="w-4 h-4 text-gray-400" />
                                              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                 {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                              </span>
                                           </div>
                                           <div className="flex items-center gap-2">
                                              <HiOutlineCreditCard className="w-4 h-4 text-gray-400" />
                                              <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                 {formatPrice(order.total_amount)}
                                              </span>
                                           </div>
                                        </div>
                                     </div>

                                     {/* Simple Tracking Visual */}
                                     <div className="hidden xl:flex items-center gap-4 flex-1 max-w-sm">
                                        {[
                                          { label: 'Confirmed', done: true },
                                          { label: 'Shipped', done: order.status?.toLowerCase() === 'shipped' || order.status?.toLowerCase() === 'delivered' },
                                          { label: 'Arriving', done: order.status?.toLowerCase() === 'delivered' }
                                        ].map((step, i) => (
                                          <div key={i} className="flex-1 relative text-center">
                                             <div className={`h-1.5 rounded-full ${step.done ? 'bg-emerald-400' : 'bg-gray-100'} mb-3 transition-colors duration-1000`} />
                                             <span className={`text-[8px] font-bold uppercase tracking-widest ${step.done ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                                          </div>
                                        ))}
                                     </div>

                                     <div className="flex items-center justify-between xl:justify-end gap-6 sm:min-w-[200px]">
                                        <div className="flex -space-x-4">
                                           {order.items?.slice(0, 3).map((item, i) => (
                                              <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                                                <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                                              </div>
                                           ))}
                                           {order.items?.length > 3 && (
                                              <div className="w-12 h-12 rounded-2xl border-4 border-white bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                                                 +{order.items.length - 3}
                                              </div>
                                           )}
                                        </div>
                                        <Link to={`/orders/${order.id}`} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 hover:shadow-lg transition-all group">
                                           <HiOutlineChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                     </div>
                                  </div>
                               </div>
                             );
                           })}
                        </div>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
