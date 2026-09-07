// Customer reviews dataset and storage engine for Arnika
// Supports product ratings pill (e.g. 4.9 ★ | 53) and Pinterest-style customer reviews

export const baseReviewsPool = [
  {
    id: 'rev-1',
    author: 'Sakshi',
    isVerified: true,
    date: '8/6/2026',
    rating: 5,
    comment: 'Perfect for everyday and festive occasions. Elegant, simple, and ideal for daily wear.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 'rev-2',
    author: 'Saba',
    isVerified: true,
    date: '9/5/2026',
    rating: 5,
    comment: 'Gifted this and she loved it! Packaging was super premium and delivery was very fast.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-[4/5]',
  },
  {
    id: 'rev-3',
    author: 'Sucharita',
    isVerified: true,
    date: '18/8/2026',
    rating: 5,
    comment: 'Lovely piece, bought for my daughter and she loved it, easy and comfortable to wear all day without any irritation.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-square',
  },
  {
    id: 'rev-4',
    author: 'Aanya Sharma',
    isVerified: true,
    date: '22/8/2026',
    rating: 5,
    comment: 'The shine is breathtaking! Received so many compliments at my cousin’s sangeet ceremony.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-[9/16]',
    hasVideo: true,
  },
  {
    id: 'rev-5',
    author: 'Pooja Mehta',
    isVerified: true,
    date: '25/8/2026',
    rating: 5,
    comment: 'Quality exceeds expectations. Real gold polish look and completely anti-tarnish even with daily use.',
    image: null,
    aspectRatio: '',
  },
  {
    id: 'rev-6',
    author: 'Rhea Patel',
    isVerified: true,
    date: '28/8/2026',
    rating: 5,
    comment: 'Absolutely in love with the intricate craftsmanship. Worth every single rupee!',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 'rev-7',
    author: 'Meera Iyer',
    isVerified: true,
    date: '01/9/2026',
    rating: 5,
    comment: 'Subtle yet royal. Looks even prettier in real life than in the pictures.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-[4/5]',
  },
  {
    id: 'rev-8',
    author: 'Tanvi Joshi',
    isVerified: true,
    date: '03/9/2026',
    rating: 5,
    comment: 'Very delicate and pretty! Arrived in a gorgeous velvet pouch with certificate.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    aspectRatio: 'aspect-square',
  },
];

// Helper to get consistent seed based on product ID
function getProductHash(productId) {
  let hash = 0;
  if (!productId) return 5;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) % 1000;
  }
  return hash;
}

// Retrieve reviews for a product (user submitted + curated selection from pool)
export function getProductReviews(productId) {
  if (!productId) return [];
  const stored = getStoredReviews(productId);
  
  // Pick 4 to 6 reviews from the pool uniquely for each product
  const hash = getProductHash(productId);
  const startIndex = hash % baseReviewsPool.length;
  const count = 4 + (hash % 3); // 4, 5, or 6 reviews
  
  const curated = [];
  for (let i = 0; i < count; i++) {
    curated.push(baseReviewsPool[(startIndex + i) % baseReviewsPool.length]);
  }

  return [...stored, ...curated];
}

// Compute review count and average rating for a product
// Returns realistic values like 4.9 ★ | 53 matching the user's reference
export function getProductReviewStats(productId, reviewsList = null) {
  const hash = getProductHash(productId);
  
  // Base review count (e.g. 45 to 75, giving 53, 48, 62, etc.)
  const baseCount = 45 + (hash % 28);
  const userStored = getStoredReviews(productId);
  const totalCount = baseCount + userStored.length;

  // Rating is 4.8 or 4.9
  const rating = hash % 4 === 0 ? '4.8' : '4.9';

  return {
    totalReviews: totalCount,
    averageRating: parseFloat(rating),
  };
}

export function getStoredReviews(productId) {
  try {
    const key = `arnika_reviews_${productId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse reviews from localStorage', err);
    return [];
  }
}

export function addStoredReview(productId, review) {
  try {
    const key = `arnika_reviews_${productId}`;
    const existing = getStoredReviews(productId);
    const updated = [review, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save review to localStorage', err);
    return [];
  }
}
