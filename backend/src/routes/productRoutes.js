import { Router } from 'express';
import { createProduct, getProducts, getProductBySlug, getProductById, updateProduct, deleteProduct, getAllProductsAdmin } from '../controllers/productController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/id/:id', getProductById);

// Admin
router.get('/admin/all', verifyToken, requireAdmin, getAllProductsAdmin);
router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

export default router;
