// Static data for Arnika Jewellery Store
// Provides all 36 Indian Women's Jewellery items across 6 categories without requiring a database.

export const initialCategories = [
  {
    id: 'cat-necklaces',
    name: 'Necklaces & Chokers',
    slug: 'necklaces',
    description: 'Heritage Temple, Kasu Mala & handcrafted chokers adorned with rubies and emeralds.',
    image: '/images/categories/cat_necklaces.webp',
    product_count: 15,
  },
  {
    id: 'cat-pendants',
    name: 'Pendants & Malas',
    slug: 'pendants',
    description: 'Royal pearl malas, elephant motif chains & Jadau statement pendants.',
    image: '/images/categories/cat_pendants.webp',
    product_count: 6,
  },
  {
    id: 'cat-earrings',
    name: 'Earrings & Jhumkas',
    slug: 'earrings',
    description: 'Handcrafted antique peacock drops, temple jhumkas & traditional studs.',
    image: '/images/categories/cat_earrings.webp',
    product_count: 1,
  },
  {
    id: 'cat-bracelets',
    name: 'Bangles & Bracelets',
    slug: 'bracelets',
    description: 'Antique gold temple kadas, floral cuffs & handcrafted bangles pair.',
    image: '/images/categories/cat_bracelets.webp',
    product_count: 1,
  },
];

export const initialProducts = [
  // ====== NECKLACES & CHOKERS (15) ======
  {
    id: 'prod-neck-1',
    name: 'Heritage Temple Mango Mala Necklace Set',
    slug: 'heritage-temple-mango-mala-necklace-set',
    description: 'Exquisite South Indian temple jewellery mango mala (manga malai) crafted with antique gold plating and embossed Lakshmi and floral paisley motifs. Comes complete with matching traditional earrings.',
    price: 3499,
    compare_price: 5499,
    category: 'necklaces',
    tags: ['temple', 'mango-mala', 'south-indian', 'gold-plated', 'traditional', 'wedding'],
    images: ['/images/products/img_3404.webp'],
    thumbnail: '/images/products/img_3404.webp',
    stock: 15,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prod-neck-2',
    name: 'Royal Temple Kasu Mala & Ruby Choker Set',
    slug: 'royal-temple-kasu-mala-ruby-choker-set',
    description: 'Imperial South Indian Kasu Mala coin choker featuring faceted square ruby cabochons, fine cultured pearl border, and engraved Goddess Lakshmi coins with matching deity drop earrings.',
    price: 3999,
    compare_price: 5999,
    category: 'necklaces',
    tags: ['kasu-mala', 'ruby', 'choker', 'pearl', 'bridal', 'temple'],
    images: ['/images/products/img_3403.webp'],
    thumbnail: '/images/products/img_3403.webp',
    stock: 12,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-02T00:00:00.000Z',
  },
  {
    id: 'prod-neck-3',
    name: 'Grand Goddess Lakshmi Temple Collar Choker',
    slug: 'grand-goddess-lakshmi-temple-collar-choker',
    description: 'Stately temple collar necklace sculpted with Lakshmi deity medallion, ruby stone florets, pearl clusters and emerald drops. Paired with ornate Lakshmi ear tops.',
    price: 4499,
    compare_price: 6999,
    category: 'necklaces',
    tags: ['lakshmi', 'collar', 'choker', 'temple', 'bridal', 'antique-gold'],
    images: ['/images/products/img_3234.webp'],
    thumbnail: '/images/products/img_3234.webp',
    stock: 10,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-03T00:00:00.000Z',
  },
  {
    id: 'prod-neck-4',
    name: 'Lakshmi Kasu Mala Coin Necklace Set',
    slug: 'lakshmi-kasu-mala-coin-necklace-set',
    description: 'Traditional antique gold Lakshmi Kasu mala interspersed with fluted gemstone beads in ruby and emerald hues. Features matching engraved Lakshmi coin earrings.',
    price: 2899,
    compare_price: 4299,
    category: 'necklaces',
    tags: ['kasu', 'coins', 'lakshmi', 'traditional', 'temple'],
    images: ['/images/products/img_3241.webp'],
    thumbnail: '/images/products/img_3241.webp',
    stock: 20,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-04T00:00:00.000Z',
  },
  {
    id: 'prod-neck-5',
    name: 'Chandramukhi Crescent Moon Choker Set',
    slug: 'chandramukhi-crescent-moon-choker-set',
    description: 'Antique matte gold choker crafted with interlocking crescent moon (chandramukhi) motifs, emerald green center stones, and delicate ghungroo ball drops with matching chandbali ear studs.',
    price: 2799,
    compare_price: 3999,
    category: 'necklaces',
    tags: ['chandramukhi', 'crescent', 'choker', 'emerald', 'ghungroo'],
    images: ['/images/products/img_3249.webp', '/images/products/img_3465.webp'],
    thumbnail: '/images/products/img_3249.webp',
    stock: 18,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 'prod-neck-6',
    name: 'Heritage Floral Mandala Ruby & Emerald Choker',
    slug: 'heritage-floral-mandala-ruby-emerald-choker',
    description: 'Graceful chevron collar choker adorned with circular floral mandala medallions studded with glowing ruby and emerald stones, completed with matching flower ear studs.',
    price: 3199,
    compare_price: 4899,
    category: 'necklaces',
    tags: ['mandala', 'floral', 'ruby', 'emerald', 'choker', 'festive'],
    images: ['/images/products/img_3242.webp'],
    thumbnail: '/images/products/img_3242.webp',
    stock: 14,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-06T00:00:00.000Z',
  },
  {
    id: 'prod-neck-7',
    name: 'Antique Gold Mango Bud Choker Set',
    slug: 'antique-gold-mango-bud-choker-set',
    description: 'Auspicious South Indian mango bud choker necklace embellished with ruby and emerald stones on a textured gold link band, paired with matching mango bud ear studs.',
    price: 2699,
    compare_price: 3899,
    category: 'necklaces',
    tags: ['mango', 'choker', 'traditional', 'festive', 'south-indian'],
    images: ['/images/products/img_3408.webp'],
    thumbnail: '/images/products/img_3408.webp',
    stock: 16,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-07T00:00:00.000Z',
  },
  {
    id: 'prod-neck-8',
    name: 'Antique Gold Mesh Choker with Floral Charms',
    slug: 'antique-gold-mesh-choker-with-floral-charms',
    description: 'Geometric cube-mesh flexible choker collar graced with dangling ruby and emerald floral charms and matching flower ear studs.',
    price: 2999,
    compare_price: 4499,
    category: 'necklaces',
    tags: ['mesh', 'floral', 'choker', 'modern-traditional'],
    images: ['/images/products/img_3414.webp'],
    thumbnail: '/images/products/img_3414.webp',
    stock: 15,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-08T00:00:00.000Z',
  },
  {
    id: 'prod-neck-9',
    name: 'Antique Gold Ghungroo Peacock Crescent Choker',
    slug: 'antique-gold-ghungroo-peacock-crescent-choker',
    description: 'Artistic choker necklace featuring intricately sculpted peacock crescent plates with green gemstone centers and musical ghungroo drops, with matching peacock studs.',
    price: 3299,
    compare_price: 4999,
    category: 'necklaces',
    tags: ['peacock', 'crescent', 'ghungroo', 'antique-gold'],
    images: ['/images/products/img_3430.webp'],
    thumbnail: '/images/products/img_3430.webp',
    stock: 12,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-09T00:00:00.000Z',
  },
  {
    id: 'prod-neck-10',
    name: 'Royal Temple Lakshmi Coin Long Haram',
    slug: 'royal-temple-lakshmi-coin-long-haram',
    description: 'Long majestic South Indian temple coin haram necklace adorned with crowned Goddess Lakshmi medallions and emerald accents, with matching coin tops.',
    price: 4999,
    compare_price: 7499,
    category: 'necklaces',
    tags: ['haram', 'long-necklace', 'lakshmi', 'temple', 'bridal'],
    images: ['/images/products/img_3441.webp'],
    thumbnail: '/images/products/img_3441.webp',
    stock: 8,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 'prod-neck-11',
    name: 'Hasli Choker with Chandramukhi Pendant & Grand Jhumkas',
    slug: 'hasli-choker-with-chandramukhi-pendant-grand-jhumkas',
    description: 'Solid antique gold torque hasli collar featuring a grand filigree crescent pendant with ruby florets and a magnificent pair of carved temple jhumkas.',
    price: 3699,
    compare_price: 5499,
    category: 'necklaces',
    tags: ['hasli', 'jhumkas', 'chandramukhi', 'antique-gold', 'statement'],
    images: ['/images/products/img_3453.webp'],
    thumbnail: '/images/products/img_3453.webp',
    stock: 10,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-11T00:00:00.000Z',
  },
  {
    id: 'prod-neck-12',
    name: 'Traditional Antique Gold Mango Paisley Mala',
    slug: 'traditional-antique-gold-mango-paisley-mala',
    description: 'Heritage South Indian paisley motif mala with fluted round gold beads, fine ruby accents, and matching teardrop studs.',
    price: 3499,
    compare_price: 5199,
    category: 'necklaces',
    tags: ['mango-mala', 'paisley', 'traditional', 'wedding'],
    images: ['/images/products/img_3457.webp'],
    thumbnail: '/images/products/img_3457.webp',
    stock: 14,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-12T00:00:00.000Z',
  },
  {
    id: 'prod-neck-13',
    name: 'Antique Gold Lakshmi Kasu Choker with Ghungroo',
    slug: 'antique-gold-lakshmi-kasu-choker-with-ghungroo',
    description: 'Regal coin choker necklace showcasing alternating embossed Lakshmi kasu coins, dangling spear charms, and cluster ghungroo drops, paired with matching dangle earrings.',
    price: 2999,
    compare_price: 4599,
    category: 'necklaces',
    tags: ['kasu', 'ghungroo', 'choker', 'temple', 'festive'],
    images: ['/images/products/img_3459.webp'],
    thumbnail: '/images/products/img_3459.webp',
    stock: 16,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-13T00:00:00.000Z',
  },
  {
    id: 'prod-neck-14',
    name: 'Antique Gold Shell Fan Petal Choker Set',
    slug: 'antique-gold-shell-fan-petal-choker-set',
    description: 'Distinctive fan petal choker necklace crowned with cultured white pearl beads and accompanied by matching fan drop earrings.',
    price: 2899,
    compare_price: 4299,
    category: 'necklaces',
    tags: ['fan-petal', 'pearl', 'choker', 'antique-gold', 'elegant'],
    images: ['/images/products/img_3467.webp'],
    thumbnail: '/images/products/img_3467.webp',
    stock: 12,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-14T00:00:00.000Z',
  },
  {
    id: 'prod-neck-15',
    name: 'Floral Pearl Cluster Choker Necklace Set',
    slug: 'floral-pearl-cluster-choker-necklace-set',
    description: 'Opulent circular floral sunburst medallions encircled by natural white seed pearls and ruby-emerald flower cores, with matching medallion earrings.',
    price: 3399,
    compare_price: 4999,
    category: 'necklaces',
    tags: ['pearl-cluster', 'floral', 'choker', 'ruby-emerald', 'bridal'],
    images: ['/images/products/img_3221.webp'],
    thumbnail: '/images/products/img_3221.webp',
    stock: 11,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-15T00:00:00.000Z',
  },

  // ====== PENDANTS & MALAS (6) ======
  {
    id: 'prod-pend-1',
    name: 'Royal Pearl Mala with Antique Crescent Gold Pendant',
    slug: 'royal-pearl-mala-antique-crescent-gold-pendant',
    description: 'Luminous strand pearl mala centered with a handcrafted matte gold crescent moon (chandramukhi) pendant set with ruby and emerald gemstones.',
    price: 2499,
    compare_price: 3799,
    category: 'pendants',
    tags: ['pearl-mala', 'crescent', 'pendant', 'ruby-emerald', 'graceful'],
    images: ['/images/products/img_3201.webp'],
    thumbnail: '/images/products/img_3201.webp',
    stock: 15,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-16T00:00:00.000Z',
  },
  {
    id: 'prod-pend-2',
    name: 'Antique Gold Elephant Motif Chain Necklace & Earrings',
    slug: 'antique-gold-elephant-motif-chain-necklace-earrings',
    description: 'Auspicious gold elephant centerplate on a braided chain with pear emerald drop and ruby cabochons, complete with matching elephant earrings.',
    price: 2299,
    compare_price: 3499,
    category: 'pendants',
    tags: ['elephant', 'pendant', 'auspicious', 'emerald-drop', 'heritage'],
    images: ['/images/products/img_3132.webp', '/images/products/img_3155.webp'],
    thumbnail: '/images/products/img_3132.webp',
    stock: 18,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-17T00:00:00.000Z',
  },
  {
    id: 'prod-pend-3',
    name: 'Vintage Emerald Rectangle Filigree Pendant Necklace',
    slug: 'vintage-emerald-rectangle-filigree-pendant-necklace',
    description: 'Double-layer gold bead chain featuring a large emerald-cut green stone framed in royal filigree with ruby accents and matching drop earrings.',
    price: 2599,
    compare_price: 3899,
    category: 'pendants',
    tags: ['emerald', 'filigree', 'rectangle', 'pendant', 'vintage'],
    images: ['/images/products/img_3172.webp'],
    thumbnail: '/images/products/img_3172.webp',
    stock: 14,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-18T00:00:00.000Z',
  },
  {
    id: 'prod-pend-4',
    name: 'Antique Gold Medallion Hasli Choker & Peacock Studs',
    slug: 'antique-gold-medallion-hasli-choker-peacock-studs',
    description: 'Magnificent filigree sun medallion pendant hung on a slender gold neck wire, adorned with cascading green agate beads and matching peacock studs.',
    price: 3199,
    compare_price: 4699,
    category: 'pendants',
    tags: ['medallion', 'hasli', 'green-beads', 'peacock', 'pendant'],
    images: ['/images/products/img_3182.webp', '/images/products/img_3231.webp'],
    thumbnail: '/images/products/img_3182.webp',
    stock: 10,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-19T00:00:00.000Z',
  },
  {
    id: 'prod-pend-5',
    name: 'Delicate Paisley Motif Drop Necklace & Studs',
    slug: 'delicate-paisley-motif-drop-necklace-studs',
    description: 'Delicate openwork paisley teardrop pendant stations suspended along a fine gold link chain with ruby-emerald crystals and matching studs.',
    price: 1999,
    compare_price: 2999,
    category: 'pendants',
    tags: ['paisley', 'delicate', 'pendant', 'daily-grace'],
    images: ['/images/products/img_3193.webp'],
    thumbnail: '/images/products/img_3193.webp',
    stock: 22,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-03-20T00:00:00.000Z',
  },
  {
    id: 'prod-pend-6',
    name: 'Royal Jadau Teardrop Pendant Necklace Set',
    slug: 'royal-jadau-teardrop-pendant-necklace-set',
    description: 'Magnificent Jadau statement pendant necklace surrounded by ruby and emerald teardrop cabochons and polki accents with matching royal earrings.',
    price: 3899,
    compare_price: 5799,
    category: 'pendants',
    tags: ['jadau', 'teardrop', 'pendant', 'ruby', 'emerald', 'royal'],
    images: ['/images/products/img_3426.webp'],
    thumbnail: '/images/products/img_3426.webp',
    stock: 9,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-21T00:00:00.000Z',
  },

  // ====== EARRINGS & JHUMKAS (1) ======
  {
    id: 'prod-ear-1',
    name: 'Antique Gold Peacock Pearl Drop Statement Earrings',
    slug: 'antique-gold-peacock-pearl-drop-statement-earrings',
    description: 'Handcrafted antique matte gold peacock filigree stud earrings with clustered cascades of miniature faux pearls and a ruby crown accent.',
    price: 1499,
    compare_price: 2299,
    category: 'earrings',
    tags: ['peacock', 'pearl-drop', 'earrings', 'jhumka', 'antique-gold'],
    images: ['/images/products/img_3148.webp'],
    thumbnail: '/images/products/img_3148.webp',
    stock: 25,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-22T00:00:00.000Z',
  },

  // ====== BANGLES & BRACELETS (1) ======
  {
    id: 'prod-brace-1',
    name: 'Antique Temple Gold Floral Kadas / Bangles Pair',
    slug: 'antique-temple-gold-floral-kadas-bangles-pair',
    description: 'Heirloom pair of antique matte gold temple bangles embossed with sculpted Goddess Lakshmi and floral florets encrusted with rubies and emeralds.',
    price: 2999,
    compare_price: 4499,
    category: 'bracelets',
    tags: ['kadas', 'bangles', 'temple', 'ruby-emerald', 'pair'],
    images: ['/images/products/img_3214.webp'],
    thumbnail: '/images/products/img_3214.webp',
    stock: 15,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-03-23T00:00:00.000Z',
  },
];

export const initialSettings = {
  hero_slides: [
    {
      image: "/images/products/img_3404.webp",
      tagline: "AUTHENTIC TEMPLE HERITAGE",
      titlePart1: "Timeless",
      titlePart2: "Elegance",
      cta: "Shop Necklaces",
      align: "center",
      link: "/shop?category=necklaces"
    },
    {
      image: "/images/products/img_3441.webp",
      tagline: "ANTIQUE GOLD & EMERALD",
      titlePart1: "Royal &",
      titlePart2: "Auspicious",
      cta: "Best Sellers",
      align: "left",
      link: "/shop?bestseller=true"
    },
    {
      image: "/images/products/img_3453.webp",
      tagline: "HANDCRAFTED LUXURY",
      titlePart1: "Adorn",
      titlePart2: "Yourself",
      cta: "Explore Hasli Sets",
      align: "right",
      link: "/shop?category=necklaces"
    }
  ],
  expertly_crafted: {
    expertly_crafted_title: "The Art of Adornment",
    expertly_crafted_subtitle: "Expertly Crafted",
    expertly_crafted_description: "Every piece of Arnika jewellery is a testament to timeless South Indian heritage and handcrafted craftsmanship.",
    best_sellers_title: "Our Best Sellers",
    best_sellers_subtitle: "Most Loved Pieces"
  }
};

// Storage helper functions for client-side persistence (v6 ensures clean cache reset)
const STORAGE_VERSION = 'v6';
const STORAGE_KEYS = {
  PRODUCTS: `arnika_products_${STORAGE_VERSION}`,
  CATEGORIES: `arnika_categories_${STORAGE_VERSION}`,
  SETTINGS: `arnika_settings_${STORAGE_VERSION}`,
  ORDERS: `arnika_orders_${STORAGE_VERSION}`,
  WISHLIST: `arnika_wishlist_${STORAGE_VERSION}`,
  COUPONS: `arnika_coupons_${STORAGE_VERSION}`,
};

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(item);
    // If stored categories or products have fewer items than initial, reload fresh
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length < fallback.length) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage for key ${key}:`, e);
  }
}

// Database-free local service functions
export function getStaticProducts(params = {}) {
  let list = [...getStored(STORAGE_KEYS.PRODUCTS, initialProducts)];

  // Active only
  list = list.filter(p => p.is_active !== false);

  // Category filter
  if (params.category && params.category !== 'All') {
    const cat = params.category.toLowerCase().trim();
    list = list.filter(p => (p.category || '').toLowerCase() === cat);
  }

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Featured filter
  if (params.featured === 'true' || params.featured === true) {
    list = list.filter(p => p.is_featured);
  }

  // Bestseller filter
  if (params.bestseller === 'true' || params.bestseller === true) {
    list = list.filter(p => p.is_bestseller);
  }

  // Sorting
  const sort = params.sort || 'newest';
  if (sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // newest
    list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  const total = list.length;
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  return {
    success: true,
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    }
  };
}

export function getStaticProductBySlug(slug) {
  const list = getStored(STORAGE_KEYS.PRODUCTS, initialProducts);
  const product = list.find(p => p.slug === slug && p.is_active !== false);
  if (!product) {
    throw new Error('Product not found');
  }
  return { success: true, product };
}

export function getStaticProductById(id) {
  const list = getStored(STORAGE_KEYS.PRODUCTS, initialProducts);
  const product = list.find(p => String(p.id) === String(id));
  if (!product) {
    throw new Error('Product not found');
  }
  return { success: true, product };
}

export function createStaticProduct(data) {
  const list = getStored(STORAGE_KEYS.PRODUCTS, initialProducts);
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  const newProduct = {
    ...data,
    id: 'prod-' + Date.now(),
    slug,
    created_at: new Date().toISOString(),
    is_active: true,
  };
  list.unshift(newProduct);
  setStored(STORAGE_KEYS.PRODUCTS, list);
  return { success: true, product: newProduct };
}

export function updateStaticProduct(id, data) {
  const list = getStored(STORAGE_KEYS.PRODUCTS, initialProducts);
  const index = list.findIndex(p => String(p.id) === String(id));
  if (index === -1) throw new Error('Product not found');
  list[index] = { ...list[index], ...data };
  setStored(STORAGE_KEYS.PRODUCTS, list);
  return { success: true, product: list[index] };
}

export function deleteStaticProduct(id) {
  let list = getStored(STORAGE_KEYS.PRODUCTS, initialProducts);
  list = list.filter(p => String(p.id) !== String(id));
  setStored(STORAGE_KEYS.PRODUCTS, list);
  return { success: true, message: 'Product deleted' };
}

export function getStaticCategories() {
  const categories = getStored(STORAGE_KEYS.CATEGORIES, initialCategories);
  return { success: true, categories };
}

export function getStaticSetting(key) {
  const settings = getStored(STORAGE_KEYS.SETTINGS, initialSettings);
  return { success: true, settings: settings[key] || null };
}

export function updateStaticSetting(key, value) {
  const settings = getStored(STORAGE_KEYS.SETTINGS, initialSettings);
  settings[key] = value;
  setStored(STORAGE_KEYS.SETTINGS, settings);
  return { success: true, settings: value };
}

export function getStaticOrders() {
  const orders = getStored(STORAGE_KEYS.ORDERS, []);
  return { success: true, orders };
}

export function createStaticOrder(orderData) {
  const orders = getStored(STORAGE_KEYS.ORDERS, []);
  const newOrder = {
    ...orderData,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    created_at: new Date().toISOString(),
    status: 'Confirmed',
  };
  orders.unshift(newOrder);
  setStored(STORAGE_KEYS.ORDERS, orders);
  return { success: true, order: newOrder };
}

export function getStaticWishlist() {
  const wishlist = getStored(STORAGE_KEYS.WISHLIST, []);
  return { success: true, items: wishlist };
}

export function addStaticWishlist(productId) {
  const wishlist = getStored(STORAGE_KEYS.WISHLIST, []);
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    setStored(STORAGE_KEYS.WISHLIST, wishlist);
  }
  return { success: true, wishlist };
}

export function removeStaticWishlist(productId) {
  let wishlist = getStored(STORAGE_KEYS.WISHLIST, []);
  wishlist = wishlist.filter(id => id !== productId);
  setStored(STORAGE_KEYS.WISHLIST, wishlist);
  return { success: true, wishlist };
}
