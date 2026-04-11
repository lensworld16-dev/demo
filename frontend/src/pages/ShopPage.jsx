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

const categoryOptions = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'];

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
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (category && category !== 'All') params.category = category;
        if (search) params.search = search;
        if (featured) params.featured = featured;

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
  }, [category, search, sort, featured, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
          >
            {search ? `Search: "${search}"` : featured ? 'Featured Products' : 'All Products'}
          </motion.h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{pagination.total || products.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-body">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category Pills */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            {categoryOptions.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateParam('category', cat === 'All' ? '' : cat.toLowerCase().replace(/ & /g, '-'))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (!category && cat === 'All') || category === cat.toLowerCase().replace(/ & /g, '-')
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700"
          >
            <HiOutlineAdjustments className="w-4 h-4" />
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      (!category && cat === 'All') || category === cat.toLowerCase().replace(/ & /g, '-')
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600'
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
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                Search: {search}
                <button onClick={() => updateParam('search', '')}><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm capitalize">
                {category.replace(/-/g, ' ')}
                <button onClick={() => updateParam('category', '')}><HiOutlineX className="w-3.5 h-3.5" /></button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <HiOutlineSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
