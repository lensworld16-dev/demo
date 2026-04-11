import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const categories = [
  { name: 'Rings', slug: 'rings', image: '/images/rings.png', desc: 'Elegant bands for every finger' },
  { name: 'Earrings', slug: 'earrings', image: '/images/earrings.png', desc: 'Dazzling drops & minimal studs' },
  { name: 'Necklaces', slug: 'necklaces', image: '/images/necklaces.png', desc: 'Statement pieces & daily chains' },
  { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1573408302185-912781878b27?w=600', desc: 'Demi-fine wrist adornments' },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h1>
        <p className="text-gray-500 max-w-md mx-auto">Explore our curated collections</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
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
                <p className="text-white/70 text-sm mb-3">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                  Browse Collection <HiArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
