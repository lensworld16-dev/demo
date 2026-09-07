import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

import { initialCategories } from '../data/data';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F9] text-gray-900 selection:bg-pink-100 selection:text-pink-900 relative overflow-hidden py-8 sm:py-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DE5D83] block mb-2">
            Curated Collections
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-gray-900 mb-3 italic tracking-tight">
            Shop by <span className="font-bold not-italic">Category</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#DE5D83] to-transparent mx-auto mb-3" />
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">Explore demi-fine jewellery handcrafted for every occasion</p>
        </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {initialCategories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/shop?category=${cat.slug}`}
              className="relative h-72 sm:h-96 rounded-3xl overflow-hidden group block"
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-2xl font-bold text-white mb-1">{cat.name}</h2>
                <p className="text-white/70 text-sm mb-3">{cat.description || cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                  Browse Collection <HiArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
  );
}
