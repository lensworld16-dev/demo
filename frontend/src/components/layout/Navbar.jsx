import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineSearch } from 'react-icons/hi';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop?category=rings', label: 'Rings' },
  { path: '/shop?category=earrings', label: 'Earrings' },
  { path: '/shop?category=necklaces', label: 'Necklaces' },
  { path: '/shop', label: 'All' },
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60]">
        {/* Announcement Bar */}
        <div className="bg-gray-900 text-white py-2 px-4 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase">
            ANTI-TARNISH & DEMI FINE JEWELLERY • FREE SHIPPING PAN INDIA
          </p>
        </div>

        <motion.header
          className={`transition-all duration-[600ms] ease-luxury ${
            scrolled ? 'glass-premium border-b border-white/50' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`text-lg sm:text-xl font-bold tracking-[0.3em] transition-colors ${
                    scrolled ? 'text-gray-900' : 'text-gray-900'
                  }`}
                >
                  SAJHNAA
                </motion.span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C5A059] group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineSearch className="w-5 h-5 text-gray-700" />
                </motion.button>

                {user && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors block relative">
                      <HiOutlineHeart className="w-5 h-5 text-gray-700" />
                      <AnimatePresence>
                        {wishlistCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                          >
                            {wishlistCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative block">
                    <HiOutlineShoppingBag className="w-5 h-5 text-gray-700" />
                    <AnimatePresence>
                      {itemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-[#C41E3A] text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                        >
                          {itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>

                {/* Profile / Auth */}
                <div className="relative">
                  {user ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <HiOutlineUser className="w-5 h-5 text-gray-700" />
                        )}
                      </motion.button>
                      <AnimatePresence>
                        {profileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-gray-50">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.displayName || 'User'}
                              </p>
                              <p className="text-[10px] text-gray-500 truncate tracking-wider">{user.email}</p>
                            </div>
                            <div className="py-1">
                              <Link
                                to="/profile"
                                onClick={() => setProfileOpen(false)}
                                className="block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                              >
                                Profile
                              </Link>
                              <Link
                                to="/orders"
                                onClick={() => setProfileOpen(false)}
                                className="block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                              >
                                My Orders
                              </Link>
                              {isAdmin && (
                                <Link
                                  to="/admin"
                                  onClick={() => setProfileOpen(false)}
                                  className="block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#C41E3A] hover:bg-gray-50 transition-colors"
                                >
                                  Admin Dashboard
                                </Link>
                              )}
                              <button
                                onClick={() => { logout(); setProfileOpen(false); }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex items-center gap-2 px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-gray-800 transition-colors"
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <HiOutlineUser className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    </Link>
                  )}
                </div>

                {/* Mobile menu button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {mobileOpen ? (
                    <HiOutlineX className="w-5 h-5" />
                  ) : (
                    <HiOutlineMenu className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="px-4 py-6 space-y-4 bg-white">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="block text-xs font-bold uppercase tracking-widest text-gray-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artifical jewellery..."
                  className="w-full pl-14 pr-6 py-5 bg-white rounded-none shadow-2xl text-gray-900 placeholder:text-gray-300 focus:outline-none text-lg tracking-tight"
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gap handler removed to fix double spacing */}
    </>
  );
}
