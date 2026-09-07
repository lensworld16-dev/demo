import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAdjustments, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import Skeleton from '../components/ui/Skeleton';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const categoryOptions = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Anklets', 'Pendants'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filterOpen, setFilterOpen] = useState(false);
  const { addItem } = useCart();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') || '';
  const bestseller = searchParams.get('bestseller') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (category && category !== 'All') params.category = category;
        if (search) params.search = search;
        if (featured) params.featured = featured;
        if (bestseller) params.bestseller = bestseller;

        const data = await productAPI.getAll(params);
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        // fallback demo
        setProducts([
          { id: '1', name: 'Minimal Watch', slug: 'minimal-watch', price: 4999, compare_price: 7999, category: 'Accessories', is_featured: true, thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
          { id: '2', name: 'Wireless Earbuds Pro', slug: 'wireless-earbuds-pro', price: 3499, compare_price: 5999, category: 'Electronics', is_featured: true, thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500' },
          { id: '3', name: 'Leather Tote Bag', slug: 'leather-tote-bag', price: 2999, category: 'Fashion', thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500' },
          { id: '4', name: 'Smart Home Speaker', slug: 'smart-home-speaker', price: 6999, compare_price: 9999, category: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1543512214-318228f0468d?w=500' },
          { id: '5', name: 'Premium Sunglasses', slug: 'premium-sunglasses', price: 1999, compare_price: 3499, category: 'Accessories', thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' },
          { id: '6', name: 'Ceramic Vase Set', slug: 'ceramic-vase-set', price: 1499, category: 'Home & Living', thumbnail: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, search, sort, featured, bestseller, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-gray-900 selection:bg-pink-100 selection:text-pink-900 pb-16">
      {/* Header with Luxury Pink Gradient & Ambient Glow */}
      <div className="bg-gradient-to-b from-[#FFF0F4]/90 via-[#FFF7F9] to-[#FFF8F9] border-b border-pink-200/70 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-light text-gray-900 mb-2 italic tracking-tight"
          >
            {search ? `Search: "${search}"` : featured ? 'Featured Collections' : bestseller ? 'Best Sellers' : 'Shop Collections'}
          </motion.h1>
          <p className="text-[#DE5D83] text-[11px] font-bold uppercase tracking-[0.25em]">{pagination.total || products.length} Curated Pieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category Pills - Luxury Pink Accents */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            {categoryOptions.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => updateParam('category', cat === 'All' ? '' : cat.toLowerCase().replace(/ & /g, '-'))}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  (!category && cat === 'All') || category === cat.toLowerCase().replace(/ & /g, '-')
                    ? 'bg-[#E05A75] text-white shadow-md shadow-pink-200/80 border border-[#E05A75]'
                    : 'bg-white/90 border border-pink-200/80 text-gray-700 hover:bg-pink-50 hover:border-pink-300 hover:text-[#DE5D83]'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-4 py-2.5 bg-white border border-pink-200/80 rounded-xl text-xs sm:text-sm font-medium text-gray-800 shadow-2xs hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-pink-200/80 rounded-xl text-xs sm:text-sm font-medium text-gray-800 shadow-2xs hover:bg-pink-50"
          >
            <HiOutlineAdjustments className="w-4 h-4 text-[#DE5D83]" />
            Filter
          </button>
        </div>

        {/* Mobile Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2 pb-4">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { updateParam('category', cat === 'All' ? '' : cat.toLowerCase().replace(/ & /g, '-')); setFilterOpen(false); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                      (!category && cat === 'All') || category === cat.toLowerCase().replace(/ & /g, '-')
                        ? 'bg-[#E05A75] text-white shadow-sm shadow-pink-200'
                        : 'bg-white border border-pink-200 text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {(search || category) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100/70 border border-pink-200 text-[#DE5D83] rounded-full text-xs font-semibold">
                Search: {search}
                <button onClick={() => updateParam('search', '')}><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100/70 border border-pink-200 text-[#DE5D83] rounded-full text-xs font-semibold capitalize">
                {category.replace(/-/g, ' ')}
                <button onClick={() => updateParam('category', '')}><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-x-6 sm:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-4 w-1/2 rounded-none" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <HiOutlineSearch className="w-12 h-12 mx-auto text-gray-300 mb-6" />
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-900 mb-2">No Curations Found</h3>
            <p className="text-gray-500 text-xs tracking-wider">Try adjusting your filters or search terms</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-x-6 sm:gap-y-10"
          >
            <AnimatePresence>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateParam('page', String(i + 1))}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                  pagination.page === i + 1
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
