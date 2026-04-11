import { Router } from 'express';
import { getProfile, updateProfile, getDashboardStats } from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/admin/dashboard', verifyToken, requireAdmin, getDashboardStats);

export default router;
