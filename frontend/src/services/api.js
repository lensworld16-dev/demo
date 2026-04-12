import axios from 'axios';
import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  try {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Auth not available - continue without token
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products', { params: { featured: true, limit: 8 } }),
  getBestSellers: () => api.get('/products', { params: { bestseller: true, limit: 8 } }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/id/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  adminGetAll: () => api.get('/products/admin/all'),
};

// Setting APIs
export const settingAPI = {
  get: (id) => api.get(`/settings/${id}`),
  update: (id, value) => api.put(`/settings/${id}`, { value }),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  adminGetAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Wishlist APIs
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (product_id) => api.post('/wishlist', { product_id }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Image APIs
export const imageAPI = {
  upload: (file, folder) => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (folder) => api.get('/images', { params: { folder } }),
  delete: (id) => api.delete(`/images/${id}`),
  purgeByPublicId: (public_id) => api.post('/images/purge-by-public-id', { public_id }),
};

// User APIs
export const couponAPI = {
  adminGetAll: () => api.get('/coupons/admin/all'),
  create: (data) => api.post('/coupons', data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDashboard: () => api.get('/users/admin/dashboard'),
  getAll: () => api.get('/users/admin/all'),
};

export default api;
