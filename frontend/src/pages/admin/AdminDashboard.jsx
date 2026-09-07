import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineChartBar, 
  HiOutlineCube, 
  HiOutlineClipboardList, 
  HiOutlinePlus, 
  HiOutlineUserGroup, 
  HiOutlineTicket, 
  HiOutlineStar, 
  HiOutlineHome, 
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineLogout
} from 'react-icons/hi';
import { userAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import RippleWaveLoader from '../../components/ui/RippleWaveLoader';
import { cn } from '../../lib/utils';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: HiOutlineChartBar, end: true },
  { path: '/admin/homepage', label: 'Home Page', icon: HiOutlineHome },
  { path: '/admin/products', label: 'Stock Inventory', icon: HiOutlineCube },
  { path: '/admin/categories', label: 'Category Flux', icon: HiOutlineTag },
  { path: '/admin/orders', label: 'Vessel Orders', icon: HiOutlineClipboardList },
  { path: '/admin/users', label: 'Ambassadors', icon: HiOutlineUserGroup },
  { path: '/admin/coupons', label: 'Promo Vault', icon: HiOutlineTicket },
  { path: '/admin/reviews', label: 'Feedback Loop', icon: HiOutlineStar },
];

export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await userAPI.getDashboard();
        setStats(data.stats);
      } catch {
        setStats({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    load();
  }, []);

  const isSubRoute = location.pathname !== '/admin';

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-gray-900 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
               {/* Mobile Toggle */}
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-900"
               >
                 <HiOutlineMenu className="w-6 h-6" />
               </button>

               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-lg sm:text-xl italic shadow-lg shadow-gray-200">A</div>
               <div className="hidden xs:block">
                  <h1 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tighter leading-none">Command Center</h1>
                  <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Management Protocol</p>
               </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 min-w-[280px]">
                  <HiOutlineSearch className="text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search data points..." className="bg-transparent border-none outline-none text-xs font-medium w-full placeholder:text-gray-300" />
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors relative">
                     <HiOutlineBell className="w-4 h-4 sm:w-5 sm:h-5" />
                     <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shadow-inner">
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" alt="Admin" className="w-full h-full object-cover" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Modern Sidebar Navigation - Desktop & Mobile Drawer */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-72 bg-white z-[70] transition-transform duration-500 transform lg:relative lg:translate-x-0 lg:z-0 lg:bg-transparent",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full lg:h-auto overflow-y-auto lg:overflow-visible lg:sticky lg:top-28 p-6 lg:p-0">
            {/* Mobile Header in Drawer */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
               <span className="text-xl font-black tracking-widest text-gray-900 italic">ARNIKA</span>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-900 text-white rounded-xl">
                 <HiOutlineX className="w-5 h-5" />
               </button>
            </div>

            <div className="bg-white shadow-xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100 p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-16 translate-x-16 -z-0 opacity-50" />
              
              <nav className="space-y-2 relative z-10">
                {sidebarLinks.map((link) => {
                  const isActive = link.end
                    ? location.pathname === link.path
                    : location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 translate-x-1'
                          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-50">
                 <button className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                    <HiOutlineLogout className="w-5 h-5" />
                    Sign Out
                 </button>
              </div>
            </div>

            {/* Quick Action Card (Hidden on small mobile height if needed) */}
            <div className="mt-6 bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group hidden lg:block">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
               <h3 className="text-xl font-black mb-2 leading-tight">Need to expand?</h3>
               <p className="text-white/60 text-xs font-medium mb-6 leading-relaxed">Add new listings to the inventory pool instantly.</p>
               <Link 
                 to="/admin/add-product" 
                 className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/20 hover:bg-gray-100 transition-all active:scale-95"
               >
                 <HiOutlinePlus className="w-4 h-4" /> Quick Add
               </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0 pb-12">
          <AnimatePresence mode="wait">
            {isSubRoute ? (
              <motion.div
                key="subroute"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            ) : (
              /* Dashboard Stats */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6 sm:space-y-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                   <div>
                      <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Global Pulse</h2>
                      <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mt-1">Real-time ecosystem analytics</p>
                   </div>
                   <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 self-start sm:self-auto">
                      <button className="px-4 py-2 bg-gray-50 text-gray-900 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100">Weekly</button>
                      <button className="px-4 py-2 bg-gray-900 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-gray-900/10">Monthly</button>
                   </div>
                </div>

                {loading ? (
                  <div className="mt-20">
                    <RippleWaveLoader />
                    <p className="text-center mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Neural Net...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), desc: '+12.5%', icon: HiOutlineChartBar, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                      { label: 'Total Orders', value: stats?.totalOrders || 0, desc: '8 pending', icon: HiOutlineClipboardList, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                      { label: 'Total Products', value: stats?.totalProducts || 0, desc: 'Low stock', icon: HiOutlineCube, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                      { label: 'Total Users', value: stats?.totalUsers || 0, desc: 'New users', icon: HiOutlineUserGroup, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm shadow-gray-500/5 group"
                      >
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl ${stat.color} border flex items-center justify-center mb-6 sm:mb-8 shadow-sm transition-transform group-hover:rotate-12 duration-500`}>
                           <stat.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                        <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2 whitespace-nowrap">{stat.value}</h4>
                        <p className="text-[8px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">{stat.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Second Row: Charts or recent activity */}
                {!loading && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     transition={{ delay: 0.5 }}
                     className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
                   >
                      <div className="lg:col-span-2 bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-xl shadow-gray-500/5 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                            <HiOutlineChartBar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                         </div>
                         <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Revenue Stream Map</h3>
                         <p className="text-gray-400 text-[10px] sm:text-sm font-medium max-w-xs mx-auto mb-8">Detailed visual analytics are currently being calibrated.</p>
                         <div className="flex gap-2 sm:gap-4">
                            <div className="w-1.5 sm:w-2 h-12 bg-gray-100 rounded-full"></div>
                            <div className="w-1.5 sm:w-2 h-20 bg-gray-200 rounded-full"></div>
                            <div className="w-1.5 sm:w-2 h-28 bg-gray-900 rounded-full"></div>
                            <div className="w-1.5 sm:w-2 h-16 bg-gray-200 rounded-full"></div>
                            <div className="w-1.5 sm:w-2 h-10 bg-gray-100 rounded-full"></div>
                         </div>
                      </div>

                      <div className="bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/20">
                         <div className="absolute -bottom-10 -right-10 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full blur-3xl" />
                         <h3 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 uppercase tracking-tight leading-tight">Operational Support</h3>
                         <div className="space-y-4 sm:space-y-6">
                            {[
                               { label: 'Server Status', val: 'Operational', color: 'bg-emerald-500' },
                               { label: 'Storage Sync', val: '94% Safe', color: 'bg-indigo-500' },
                               { label: 'Backup Routine', val: 'Active', color: 'bg-amber-500' },
                            ].map((row, i) => (
                               <div key={i} className="flex items-center justify-between">
                                  <span className="text-[8px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest">{row.label}</span>
                                  <span className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                                     <span className={`w-2 h-2 rounded-full ${row.color}`}></span>
                                     {row.val}
                                  </span>
                               </div>
                            ))}
                         </div>
                         <button className="w-full mt-8 sm:mt-12 py-3 sm:py-4 bg-white/10 hover:bg-white/20 transition-all rounded-xl sm:rounded-2xl border border-white/10 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                            Access Infrastructure
                         </button>
                      </div>
                   </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
