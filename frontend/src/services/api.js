import axios from 'axios';
import { auth } from './firebase';
import {
  getStaticProducts,
  getStaticProductBySlug,
  getStaticProductById,
  createStaticProduct,
  updateStaticProduct,
  deleteStaticProduct,
  getStaticCategories,
  getStaticSetting,
  updateStaticSetting,
  getStaticOrders,
  createStaticOrder,
  getStaticWishlist,
  addStaticWishlist,
  removeStaticWishlist,
} from '../data/data';

// Standalone mode: All data served directly from local static storage without database requirement
console.log('%c 💎 ARNIKA STORE: Database-free mode active', 'background: #111; color: #d4af37; padding: 4px; font-weight: bold;');

// Product APIs
export const productAPI = {
  getAll: async (params) => getStaticProducts(params),
  getFeatured: async () => getStaticProducts({ featured: true, limit: 8 }),
  getBestSellers: async () => getStaticProducts({ bestseller: true, limit: 8 }),
  getBySlug: async (slug) => getStaticProductBySlug(slug),
  getById: async (id) => getStaticProductById(id),
  create: async (data) => createStaticProduct(data),
  update: async (id, data) => updateStaticProduct(id, data),
  delete: async (id) => deleteStaticProduct(id),
  adminGetAll: async () => getStaticProducts({ limit: 1000 }),
};

// Setting APIs
export const settingAPI = {
  get: async (id) => getStaticSetting(id),
  update: async (id, value) => updateStaticSetting(id, value),
};

// Order APIs
export const orderAPI = {
  create: async (data) => createStaticOrder(data),
  getUserOrders: async () => getStaticOrders(),
  getById: async (id) => {
    const res = getStaticOrders();
    const order = (res.orders || []).find(o => o.id === id);
    return { success: true, order: order || null };
  },
  adminGetAll: async () => getStaticOrders(),
  updateStatus: async (id, status) => ({ success: true, status }),
  delete: async (id) => ({ success: true, id }),
};

// Wishlist APIs
export const wishlistAPI = {
  get: async () => getStaticWishlist(),
  add: async (product_id) => addStaticWishlist(product_id),
  remove: async (productId) => removeStaticWishlist(productId),
};

// Category APIs
export const categoryAPI = {
  getAll: async () => getStaticCategories(),
  create: async (data) => ({ success: true, category: data }),
  update: async (id, data) => ({ success: true, category: { id, ...data } }),
  delete: async (id) => ({ success: true, id }),
};

// Image APIs (Client-side mock with object URLs or fallback)
export const imageAPI = {
  upload: async (file, folder) => {
    try {
      const url = URL.createObjectURL(file);
      return { success: true, url, secure_url: url };
    } catch {
      return { success: true, url: 'https://images.unsplash.com/photo-1599643478518-a96b1f3e1ac9?auto=format&fit=crop&q=80&w=800' };
    }
  },
  getAll: async (folder) => ({ success: true, images: [] }),
  delete: async (id) => ({ success: true }),
  purgeByPublicId: async (public_id) => ({ success: true }),
};

// Coupon APIs
export const couponAPI = {
  adminGetAll: async () => ({
    success: true,
    coupons: [
      { id: '1', code: 'ARNIKA20', discount: 20, active: true },
      { id: '2', code: 'WELCOME10', discount: 10, active: true },
    ]
  }),
  create: async (data) => ({ success: true, coupon: data }),
  delete: async (id) => ({ success: true }),
};

// User APIs
export const userAPI = {
  getProfile: async () => ({ success: true, user: { name: 'Arnika Guest', email: 'guest@arnika.com' } }),
  updateProfile: async (data) => ({ success: true, user: data }),
  getDashboard: async () => ({
    success: true,
    stats: {
      totalRevenue: 245000,
      totalSales: 245000,
      totalOrders: 18,
      totalProducts: 36,
      totalUsers: 54
    }
  }),
  getAll: async () => ({ success: true, users: [] }),
};

// Empty axios client for compatibility if imported anywhere
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
