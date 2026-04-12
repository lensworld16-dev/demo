import { Router } from 'express';
import { getAllCoupons, createCoupon, deleteCoupon } from '../controllers/couponController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/admin/all', verifyToken, requireAdmin, getAllCoupons);
router.post('/', verifyToken, requireAdmin, createCoupon);
router.delete('/:id', verifyToken, requireAdmin, deleteCoupon);

export default router;
