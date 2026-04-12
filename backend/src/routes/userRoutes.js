import { Router } from 'express';
import { getProfile, updateProfile, getDashboardStats, getAllUsers } from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/admin/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/admin/all', verifyToken, requireAdmin, getAllUsers);

export default router;
