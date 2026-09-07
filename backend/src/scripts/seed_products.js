import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function query(text, params) {
  return pool.query(text, params);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

const products = [
  // ====== NECKLACES (6) ======
  {
    name: 'Kundan Choker Necklace',
    description: 'Traditional Kundan choker necklace with meenakari work on the reverse side. Handcrafted with semi-precious stones set in gold-plated brass. Perfect for weddings and festive occasions. Comes with matching earrings hook.',
    price: 2499,
    compare_price: 3999,
    category: 'necklaces',
    tags: ['kundan', 'choker', 'wedding', 'bridal', 'indian'],
    images: ['https://images.unsplash.com/photo-1599643478518-a96b1f3e1ac9?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a96b1f3e1ac9?auto=format&fit=crop&q=80&w=400',
    stock: 25,
    is_featured: true,
    is_bestseller: true,
  },
  {
    name: 'Temple Gold Haram Necklace',
    description: 'Exquisite South Indian temple jewellery haram with Lakshmi motifs. 18K gold plated on pure copper base. Anti-tarnish coating ensures long-lasting shine. Ideal for traditional ceremonies and puja.',
    price: 3499,
    compare_price: 5499,
    category: 'necklaces',
    tags: ['temple', 'haram', 'south-indian', 'gold-plated', 'traditional'],
    images: ['https://images.unsplash.com/photo-1611085583191-a3b1ae84fd9b?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1611085583191-a3b1ae84fd9b?auto=format&fit=crop&q=80&w=400',
    stock: 15,
    is_featured: true,
    is_bestseller: false,
  },
  {
    name: 'Polki Diamond Layered Necklace',
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
  },
  {
    name: 'Mangalsutra Modern Chain',
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
  },
  {
    name: 'Rajasthani Aad Necklace',
    description: 'Royal Rajasthani Aad necklace with intricate Thewa art work. Features colorful enamel and glass kundan stones. Gold-plated brass with adjustable dori. A collector\'s piece for ethnic fashion lovers.',
    price: 2899,
    compare_price: 4499,
    category: 'necklaces',
    tags: ['rajasthani', 'aad', 'thewa', 'ethnic', 'handcrafted'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    is_featured: true,
    is_bestseller: false,
  },
  {
    name: 'Pearl Mala Haar Necklace',
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
  },

  // ====== RINGS (6) ======
  {
    name: 'Kundan Adjustable Ring',
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
  },
  {
    name: 'Navratna Nine Stone Ring',
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
  },
  {
    name: 'Oxidised Silver Boho Ring Set',
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
  },
  {
    name: 'Polki Bridal Statement Ring',
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
  },
  {
    name: 'Rose Gold Minimal Band Ring',
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
  },
  {
    name: 'Pacheli Gold Finger Ring',
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
  },

  // ====== EARRINGS (6) ======
  {
    name: 'Chandbali Gold Earrings',
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
  },
  {
    name: 'Jhumka Temple Earrings',
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
  },
  {
    name: 'Oxidised Silver Jhumki Drops',
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
  },
  {
    name: 'Meenakari Peacock Studs',
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
  },
  {
    name: 'AD Diamond Huggie Hoops',
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
  },
  {
    name: 'Kashmiri Earcuff Chain Earrings',
    description: 'Unique Kashmiri-inspired earcuff with chain earring set. Features detailed filigree work with turquoise stones. No piercing needed for the earcuff. Antique gold finish that pairs beautifully with ethnic and western wear.',
    price: 1099,
    compare_price: 1799,
    category: 'earrings',
    tags: ['kashmiri', 'earcuff', 'chain', 'filigree', 'turquoise'],
    images: ['https://images.unsplash.com/photo-1588444650733-d0090c956093?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1588444650733-d0090c956093?auto=format&fit=crop&q=80&w=400',
    stock: 18,
    is_featured: true,
    is_bestseller: false,
  },
];

async function seedProducts() {
  console.log('🌱 Starting product seeding...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    const slug = slugify(product.name);
    try {
      await query(
        `INSERT INTO products (name, slug, description, price, compare_price, category, tags, images, thumbnail, stock, is_featured, is_bestseller)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          product.name,
          slug,
          product.description,
          product.price,
          product.compare_price || null,
          product.category || null,
          product.tags || [],
          product.images || [],
          product.thumbnail || null,
          product.stock || 0,
          product.is_featured || false,
          product.is_bestseller || false,
        ]
      );
      successCount++;
      console.log(`  ✅ ${product.category.toUpperCase().padEnd(10)} → ${product.name} (₹${product.price})`);
    } catch (err) {
      errorCount++;
      console.error(`  ❌ Failed: ${product.name} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors:  ${errorCount}`);
  console.log(`\n   📦 Necklaces: 6`);
  console.log(`   💍 Rings:     6`);
  console.log(`   ✨ Earrings:  6`);
  console.log(`   ─────────────────`);
  console.log(`   Total:        18 products\n`);

  await pool.end();
  process.exit(errorCount > 0 ? 1 : 0);
}

seedProducts();
