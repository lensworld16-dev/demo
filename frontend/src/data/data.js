// Static data for Arnika Jewellery Store
// Provides all 36 Indian Women's Jewellery items across 6 categories without requiring a database.

export const initialCategories = [
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Timeless Kundan, Temple & Polki necklaces crafted for royalty.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Exquisite Kundan, Navratna & statement rings for every occasion.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Traditional Chandbali, Jhumkas & modern studs to illuminate your glow.',
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Handcrafted kadas, cuffs & charm bracelets in gold and silver plating.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
  {
    id: 'cat-anklets',
    name: 'Anklets',
    slug: 'anklets',
    description: 'Auspicious silver and gold payals with melodic bells and meenakari charm.',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
  {
    id: 'cat-pendants',
    name: 'Pendants',
    slug: 'pendants',
    description: 'Delicate solitaire, temple deities & floral pendants for daily grace.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    product_count: 6,
  },
];

export const initialProducts = [
  // ====== NECKLACES (6) ======
  {
    id: 'prod-neck-1',
    name: 'Kundan Choker Necklace',
    slug: 'kundan-choker-necklace',
    description: 'Traditional Kundan choker necklace with meenakari work on the reverse side. Handcrafted with semi-precious stones set in gold-plated brass. Perfect for weddings and festive occasions. Comes with matching earrings hook.',
    price: 2499,
    compare_price: 3999,
    category: 'necklaces',
    tags: ['kundan', 'choker', 'wedding', 'bridal', 'indian'],
    images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    stock: 25,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod-neck-2',
    name: 'Temple Gold Haram Necklace',
    slug: 'temple-gold-haram-necklace',
    description: 'Exquisite South Indian temple jewellery haram with Lakshmi motifs. 18K gold plated on pure copper base. Anti-tarnish coating ensures long-lasting shine. Ideal for traditional ceremonies and puja.',
    price: 3499,
    compare_price: 5499,
    category: 'necklaces',
    tags: ['temple', 'haram', 'south-indian', 'gold-plated', 'traditional'],
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    stock: 15,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'prod-neck-3',
    name: 'Polki Diamond Layered Necklace',
    slug: 'polki-diamond-layered-necklace',
    description: 'Stunning 3-layer polki diamond necklace with emerald beads. Rose gold plated setting with adjustable chain length. Lightweight design for comfortable all-day wear. A statement piece for sangeet and reception.',
    price: 4299,
    compare_price: 6999,
    category: 'necklaces',
    tags: ['polki', 'layered', 'diamond', 'bridal', 'statement'],
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    stock: 10,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'prod-neck-4',
    name: 'Mangalsutra Modern Chain',
    slug: 'mangalsutra-modern-chain',
    description: 'Contemporary mangalsutra design with sleek black beads and a solitaire-style pendant. 18K gold plated on stainless steel. Waterproof and anti-tarnish. Perfect for everyday modern Indian women.',
    price: 1299,
    compare_price: 1999,
    category: 'necklaces',
    tags: ['mangalsutra', 'modern', 'daily-wear', 'waterproof', 'minimalist'],
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 'prod-neck-5',
    name: 'Rajasthani Aad Necklace',
    slug: 'rajasthani-aad-necklace',
    description: "Royal Rajasthani Aad necklace with intricate Thewa art work. Features colorful enamel and glass kundan stones. Gold-plated brass with adjustable dori. A collector's piece for ethnic fashion lovers.",
    price: 2899,
    compare_price: 4499,
    category: 'necklaces',
    tags: ['rajasthani', 'aad', 'thewa', 'ethnic', 'handcrafted'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'prod-neck-6',
    name: 'Pearl Mala Haar Necklace',
    slug: 'pearl-mala-haar-necklace',
    description: 'Elegant multi-strand pearl mala haar with gold-plated spacers and a beautiful pendant. Fresh water pearls with AAA grade lustre. Hypoallergenic and nickel-free. Versatile enough for sarees and gowns alike.',
    price: 1899,
    compare_price: 2999,
    category: 'necklaces',
    tags: ['pearl', 'mala', 'elegant', 'versatile', 'hypoallergenic'],
    images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    stock: 30,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-06T00:00:00.000Z',
  },

  // ====== RINGS (6) ======
  {
    id: 'prod-ring-1',
    name: 'Kundan Adjustable Ring',
    slug: 'kundan-adjustable-ring',
    description: 'Beautiful Kundan adjustable ring with meenakari floral design. Gold-plated brass base with a central green stone. One-size-fits-all with comfortable adjustable band. Perfect for mehendi and haldi ceremonies.',
    price: 699,
    compare_price: 1199,
    category: 'rings',
    tags: ['kundan', 'adjustable', 'meenakari', 'festive', 'floral'],
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    stock: 40,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-07T00:00:00.000Z',
  },
  {
    id: 'prod-ring-2',
    name: 'Navratna Nine Stone Ring',
    slug: 'navratna-nine-stone-ring',
    description: 'Classic Navratna ring featuring nine precious gemstones representing the nine planets. Set in gold-plated sterling silver. Believed to bring good luck and positive energy. Comes in sizes 6-10.',
    price: 1599,
    compare_price: 2499,
    category: 'rings',
    tags: ['navratna', 'gemstone', 'astrology', 'traditional', 'silver'],
    images: ['https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&q=80&w=400',
    stock: 20,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-08T00:00:00.000Z',
  },
  {
    id: 'prod-ring-3',
    name: 'Oxidised Silver Boho Ring Set',
    slug: 'oxidised-silver-boho-ring-set',
    description: 'Set of 5 oxidised silver stackable rings with tribal and boho patterns. Inspired by Rajasthani tribal jewellery. Adjustable sizing. Mix and match for a bohemian-chic look. Nickel-free and skin-friendly.',
    price: 499,
    compare_price: 899,
    category: 'rings',
    tags: ['oxidised', 'boho', 'stackable', 'set', 'tribal'],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    stock: 60,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-09T00:00:00.000Z',
  },
  {
    id: 'prod-ring-4',
    name: 'Polki Bridal Statement Ring',
    slug: 'polki-bridal-statement-ring',
    description: 'Gorgeous oversized polki bridal ring with pearl drops. 22K gold-plated with delicate filigree work. A showstopper accessory for your wedding day. Adjustable band with cushioned comfort.',
    price: 1899,
    compare_price: 3299,
    category: 'rings',
    tags: ['polki', 'bridal', 'statement', 'pearl', 'filigree'],
    images: ['https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=400',
    stock: 8,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'prod-ring-5',
    name: 'Rose Gold Minimal Band Ring',
    slug: 'rose-gold-minimal-band-ring',
    description: 'Sleek and minimal rose gold band ring. Made with surgical-grade stainless steel with PVD rose gold coating. 100% waterproof and sweatproof. Ideal for daily wear — never take it off!',
    price: 599,
    compare_price: 999,
    category: 'rings',
    tags: ['rose-gold', 'minimal', 'daily-wear', 'waterproof', 'stainless-steel'],
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=400',
    stock: 75,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-11T00:00:00.000Z',
  },
  {
    id: 'prod-ring-6',
    name: 'Pacheli Gold Finger Ring',
    slug: 'pacheli-gold-finger-ring',
    description: 'Traditional Rajasthani Pacheli-style finger ring with intricate jaali (lattice) work. Gold-plated brass with red and green meenakari. A statement piece that celebrates Indian heritage craftsmanship.',
    price: 899,
    compare_price: 1499,
    category: 'rings',
    tags: ['pacheli', 'traditional', 'jaali', 'rajasthani', 'meenakari'],
    images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    stock: 22,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-12T00:00:00.000Z',
  },

  // ====== EARRINGS (6) ======
  {
    id: 'prod-earr-1',
    name: 'Chandbali Gold Earrings',
    slug: 'chandbali-gold-earrings',
    description: 'Iconic Hyderabadi Chandbali earrings with crescent moon design. Features kundan stones and pearl fringes. 18K gold-plated with secure lever-back closure. Lightweight at just 12 grams per pair.',
    price: 1499,
    compare_price: 2499,
    category: 'earrings',
    tags: ['chandbali', 'hyderabadi', 'kundan', 'pearl', 'gold-plated'],
    images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    stock: 35,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-13T00:00:00.000Z',
  },
  {
    id: 'prod-earr-2',
    name: 'Jhumka Temple Earrings',
    slug: 'jhumka-temple-earrings',
    description: 'Classic South Indian temple jhumka earrings with Lakshmi devi motif. Made from gold-plated copper alloy with ruby and emerald colored stones. Bell-shaped drops create a melodic jingle. Perfect with silk sarees.',
    price: 1199,
    compare_price: 1999,
    category: 'earrings',
    tags: ['jhumka', 'temple', 'south-indian', 'traditional', 'bell'],
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
    stock: 28,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-14T00:00:00.000Z',
  },
  {
    id: 'prod-earr-3',
    name: 'Oxidised Silver Jhumki Drops',
    slug: 'oxidised-silver-jhumki-drops',
    description: 'Trendy oxidised silver jhumki drop earrings with mirror work. Ghungroo-style bell charms at the bottom. Lightweight and perfect for Indo-Western fusion looks. Hook closure with rubber stoppers.',
    price: 449,
    compare_price: 799,
    category: 'earrings',
    tags: ['oxidised', 'jhumki', 'mirror-work', 'boho', 'fusion'],
    images: ['https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=400',
    stock: 55,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'prod-earr-4',
    name: 'Meenakari Peacock Studs',
    slug: 'meenakari-peacock-studs',
    description: 'Vibrant meenakari peacock stud earrings handcrafted in Jaipur. Features the iconic Indian peacock motif in blue, green, and gold enamel. Gold-plated with push-back closure. Perfect for festive kurta looks.',
    price: 799,
    compare_price: 1299,
    category: 'earrings',
    tags: ['meenakari', 'peacock', 'studs', 'jaipur', 'enamel'],
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    stock: 42,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-16T00:00:00.000Z',
  },
  {
    id: 'prod-earr-5',
    name: 'AD Diamond Huggie Hoops',
    slug: 'ad-diamond-huggie-hoops',
    description: 'Modern American Diamond (AD) huggie hoop earrings with pavé setting. Rose gold plated on pure brass. Secure click-shut mechanism. Water-resistant and tarnish-free. Versatile for office and party wear.',
    price: 999,
    compare_price: 1599,
    category: 'earrings',
    tags: ['american-diamond', 'huggie', 'hoops', 'modern', 'rose-gold'],
    images: ['https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=400',
    stock: 38,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-17T00:00:00.000Z',
  },
  {
    id: 'prod-earr-6',
    name: 'Kashmiri Floral Jhumka Earrings',
    slug: 'kashmiri-floral-jhumka-earrings',
    description: 'Unique Kashmiri-inspired floral jhumka earring set. Features detailed filigree work with turquoise accents. Antique gold finish that pairs beautifully with ethnic and festive wear.',
    price: 1099,
    compare_price: 1799,
    category: 'earrings',
    tags: ['kashmiri', 'jhumka', 'floral', 'filigree', 'turquoise'],
    images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    stock: 18,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-18T00:00:00.000Z',
  },

  // ====== BRACELETS (6) ======
  {
    id: 'prod-brac-1',
    name: 'Royal Kundan Kada Bangle',
    slug: 'royal-kundan-kada-bangle',
    description: 'Majestic openable Kundan kada with floral ruby red meenakari inlay. Handcrafted in 22K gold-plated brass with secure screw lock. A bridal must-have.',
    price: 1799,
    compare_price: 2999,
    category: 'bracelets',
    tags: ['kundan', 'kada', 'bangle', 'bridal', 'traditional'],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    stock: 30,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-19T00:00:00.000Z',
  },
  {
    id: 'prod-brac-2',
    name: 'Evil Eye 18K Gold Bracelet',
    slug: 'evil-eye-18k-gold-bracelet',
    description: 'Protection and style combined in an exquisite Turkish-Indian fusion evil eye charm bracelet. 18K gold plated on waterproof stainless steel.',
    price: 899,
    compare_price: 1499,
    category: 'bracelets',
    tags: ['evil-eye', 'charm', 'waterproof', 'daily-wear', 'gold'],
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    stock: 45,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'prod-brac-3',
    name: 'Temple Lakshmi Coin Bracelet',
    slug: 'temple-lakshmi-coin-bracelet',
    description: 'Traditional Kasu / coin bracelet depicting Goddess Lakshmi. Antique temple gold polish with textured toggle clasp. Brings prosperity and elegance.',
    price: 1399,
    compare_price: 2299,
    category: 'bracelets',
    tags: ['temple', 'lakshmi', 'coin', 'kasu', 'traditional'],
    images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    stock: 20,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-21T00:00:00.000Z',
  },
  {
    id: 'prod-brac-4',
    name: 'Rose Gold Sleek Cuff Bracelet',
    slug: 'rose-gold-sleek-cuff-bracelet',
    description: 'Minimalist curved cuff in polished rose gold. Flex-to-fit sizing for maximum comfort. Perfect for boardroom chic and evening dinners.',
    price: 799,
    compare_price: 1299,
    category: 'bracelets',
    tags: ['rose-gold', 'cuff', 'minimal', 'modern', 'office-wear'],
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=400',
    stock: 55,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-22T00:00:00.000Z',
  },
  {
    id: 'prod-brac-5',
    name: 'Oxidised Silver Bohemian Bangle',
    slug: 'oxidised-silver-bohemian-bangle',
    description: 'Rustic tribal silver bangle with engraved geometric motifs and delicate bells. Inspired by nomadic Kutch culture.',
    price: 599,
    compare_price: 999,
    category: 'bracelets',
    tags: ['oxidised', 'tribal', 'boho', 'silver', 'bangle'],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    stock: 40,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-23T00:00:00.000Z',
  },
  {
    id: 'prod-brac-6',
    name: 'Freshwater Pearl Charm Bracelet',
    slug: 'freshwater-pearl-charm-bracelet',
    description: 'Luminous natural freshwater pearls linked with delicate gold chain and a crystal star charm. Hypoallergenic and anti-tarnish.',
    price: 1199,
    compare_price: 1999,
    category: 'bracelets',
    tags: ['pearl', 'charm', 'freshwater', 'elegant', 'gold'],
    images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    stock: 25,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-24T00:00:00.000Z',
  },

  // ====== ANKLETS (6) ======
  {
    id: 'prod-ank-1',
    name: 'Traditional Ghungroo Silver Payal',
    slug: 'traditional-ghungroo-silver-payal',
    description: 'Pair of classic Indian ghungroo payals in 925 silver finish. Emits soft melodic chimes with each step. Sturdy S-hook clasp.',
    price: 999,
    compare_price: 1699,
    category: 'anklets',
    tags: ['payal', 'ghungroo', 'silver', 'traditional', 'wedding'],
    images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    stock: 35,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-25T00:00:00.000Z',
  },
  {
    id: 'prod-ank-2',
    name: 'Gold Plated Kundan Bridal Payal',
    slug: 'gold-plated-kundan-bridal-payal',
    description: 'Heavy bridal payal set adorned with sparkling kundan stones and green meenakari drops. Designed to make the bride look unforgettable.',
    price: 1999,
    compare_price: 3499,
    category: 'anklets',
    tags: ['kundan', 'bridal', 'payal', 'gold-plated', 'royal'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    stock: 14,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'prod-ank-3',
    name: 'Minimal Black Bead Nazariya Anklet',
    slug: 'minimal-black-bead-nazariya-anklet',
    description: 'Sleek black bead nazariya anklet with an evil eye talisman in 18K gold plating. 100% waterproof for everyday round-the-clock wear.',
    price: 499,
    compare_price: 899,
    category: 'anklets',
    tags: ['nazariya', 'daily-wear', 'waterproof', 'black-beads', 'minimal'],
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    stock: 80,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-27T00:00:00.000Z',
  },
  {
    id: 'prod-ank-4',
    name: 'Peacock Motif Meenakari Payal',
    slug: 'peacock-motif-meenakari-payal',
    description: 'Artistic peacock design payal handcrafted in Jaipur with royal blue and green enamel. Antiqued silver finish with tiny tinkling bells.',
    price: 849,
    compare_price: 1399,
    category: 'anklets',
    tags: ['meenakari', 'peacock', 'jaipur', 'payal', 'handcrafted'],
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    stock: 28,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-28T00:00:00.000Z',
  },
  {
    id: 'prod-ank-5',
    name: 'Dual Layer Star & Moon Anklet',
    slug: 'dual-layer-star-moon-anklet',
    description: 'Chic double layered anklet in rose gold finish with celestial star and crescent moon charms. Adds modern glamour to Indian and Western outfits.',
    price: 649,
    compare_price: 1099,
    category: 'anklets',
    tags: ['layered', 'celestial', 'rose-gold', 'modern', 'anklet'],
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-29T00:00:00.000Z',
  },
  {
    id: 'prod-ank-6',
    name: 'Oxidised Tribal Floral Payal Pair',
    slug: 'oxidised-tribal-floral-payal-pair',
    description: 'Vintage Rajasthani payal pair with embossed lotus petals and rustic patina. Lightweight design ensures comfortable ethnic styling.',
    price: 749,
    compare_price: 1249,
    category: 'anklets',
    tags: ['oxidised', 'tribal', 'floral', 'rajasthani', 'payal'],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    stock: 32,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-01-30T00:00:00.000Z',
  },

  // ====== PENDANTS (6) ======
  {
    id: 'prod-pend-1',
    name: 'Solitaire American Diamond Pendant',
    slug: 'solitaire-american-diamond-pendant',
    description: 'Sparkling brilliant-cut American Diamond solitaire nestled in 18K rose gold setting. Includes an elegant 18-inch adjustable Italian chain.',
    price: 999,
    compare_price: 1699,
    category: 'pendants',
    tags: ['solitaire', 'diamond', 'pendant', 'rose-gold', 'minimalist'],
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    stock: 45,
    is_featured: true,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-01-31T00:00:00.000Z',
  },
  {
    id: 'prod-pend-2',
    name: 'Antique Lakshmi Devi Temple Pendant',
    slug: 'antique-lakshmi-devi-temple-pendant',
    description: 'Sacred South Indian temple pendant featuring seated Goddess Lakshmi with ruby stones and hanging pearl bunch. Pure antique gold finish.',
    price: 1599,
    compare_price: 2499,
    category: 'pendants',
    tags: ['temple', 'lakshmi', 'pendant', 'antique-gold', 'puja'],
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
    stock: 22,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'prod-pend-3',
    name: 'Meenakari Blooming Lotus Pendant',
    slug: 'meenakari-blooming-lotus-pendant',
    description: 'Graceful pink and white blooming lotus pendant crafted with traditional Jaipur enamel art and a glistening teardrop pearl.',
    price: 899,
    compare_price: 1499,
    category: 'pendants',
    tags: ['meenakari', 'lotus', 'pendant', 'pink', 'jaipur'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    stock: 35,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-02-02T00:00:00.000Z',
  },
  {
    id: 'prod-pend-4',
    name: 'Polki Royal Heritage Pendant',
    slug: 'polki-royal-heritage-pendant',
    description: 'Mughal-inspired Polki pendant with emerald green center gemstone surrounded by uncut polki diamonds. Statement luxury for celebrations.',
    price: 2199,
    compare_price: 3699,
    category: 'pendants',
    tags: ['polki', 'royal', 'heritage', 'emerald', 'statement'],
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    is_featured: true,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-02-03T00:00:00.000Z',
  },
  {
    id: 'prod-pend-5',
    name: 'Modern Evil Eye Medallion Pendant',
    slug: 'modern-evil-eye-medallion-pendant',
    description: 'Iconic disc medallion pendant featuring deep blue mother of pearl inlay and protective evil eye emblem in waterproof 18K gold plating.',
    price: 799,
    compare_price: 1299,
    category: 'pendants',
    tags: ['evil-eye', 'medallion', 'waterproof', 'gold', 'protection'],
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    stock: 60,
    is_featured: false,
    is_bestseller: true,
    is_active: true,
    created_at: '2026-02-04T00:00:00.000Z',
  },
  {
    id: 'prod-pend-6',
    name: 'Rose Gold Heart Pearl Pendant',
    slug: 'rose-gold-heart-pearl-pendant',
    description: 'Romantic intertwined heart pendant embracing a genuine cultured freshwater pearl. An affectionate gift for anniversaries and birthdays.',
    price: 1099,
    compare_price: 1799,
    category: 'pendants',
    tags: ['heart', 'pearl', 'romantic', 'rose-gold', 'gift'],
    images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    stock: 24,
    is_featured: false,
    is_bestseller: false,
    is_active: true,
    created_at: '2026-02-05T00:00:00.000Z',
  },
];

export const initialSettings = {
  hero_slides: [
    {
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000",
      tagline: "ANTI-TARNISH & WATERPROOF",
      titlePart1: "Timeless",
      titlePart2: "Elegance",
      cta: "Shop Jewelry",
      align: "center",
      link: "/shop"
    },
    {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000",
      tagline: "18K GOLD PLATED",
      titlePart1: "Bold &",
      titlePart2: "Sophisticated",
      cta: "Best Sellers",
      align: "left",
      link: "/shop?bestseller=true"
    },
    {
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=2000",
      tagline: "LUXURY ESSENTIALS",
      titlePart1: "Adorn",
      titlePart2: "Yourself",
      cta: "Royal Collection",
      align: "right",
      link: "/shop?category=necklaces"
    }
  ],
  expertly_crafted: {
    expertly_crafted_title: "The Art of Adornment",
    expertly_crafted_subtitle: "Expertly Crafted",
    expertly_crafted_description: "Every piece of Arnika jewellery is a testament to timeless elegance and modern craftsmanship. Handcrafted with love in India.",
    best_sellers_title: "Our Best Sellers",
    best_sellers_subtitle: "Most Loved Pieces"
  }
};

// Storage helper functions for client-side persistence (v4 ensures clean cache reset)
const STORAGE_VERSION = 'v4';
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
