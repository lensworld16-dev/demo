import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlinePlus, HiOutlineUserGroup, HiOutlineTicket, HiOutlineStar, HiOutlineHome, HiOutlineTag } from 'react-icons/hi';
import { userAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import Skeleton from '../../components/ui/Skeleton';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: HiOutlineChartBar, end: true },
  { path: '/admin/homepage', label: 'Home Page', icon: HiOutlineHome },
  { path: '/admin/products', label: 'Products', icon: HiOutlineCube },
  { path: '/admin/categories', label: 'Categories', icon: HiOutlineTag },
  { path: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
  { path: '/admin/add-product', label: 'Add Product', icon: HiOutlinePlus },
  { path: '/admin/users', label: 'Customers', icon: HiOutlineUserGroup },
  { path: '/admin/coupons', label: 'Coupons', icon: HiOutlineTicket },
  { path: '/admin/reviews', label: 'Reviews', icon: HiOutlineStar },
];

export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await userAPI.getDashboard();
        setStats(data.stats);
      } catch {
        setStats({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // If on a sub-route, show that instead
  const isSubRoute = location.pathname !== '/admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[70vh]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-28 bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Admin Panel</h2>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = link.end
                  ? location.pathname === link.path
                  : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {isSubRoute ? (
            <Outlet />
          ) : (
            /* Dashboard Stats */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), color: 'from-emerald-500 to-teal-600' },
                    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'from-purple-500 to-pink-600' },
                    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-amber-500 to-orange-600' },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                    >
                      <p className="text-sm font-medium text-white/80 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
