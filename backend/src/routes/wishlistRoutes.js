import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, getWishlist);
router.post('/', verifyToken, addToWishlist);
router.delete('/:productId', verifyToken, removeFromWishlist);

export default router;
