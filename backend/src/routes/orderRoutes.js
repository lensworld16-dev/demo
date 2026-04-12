import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.get('/admin/all', verifyToken, requireAdmin, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, requireAdmin, deleteOrder);

export default router;
