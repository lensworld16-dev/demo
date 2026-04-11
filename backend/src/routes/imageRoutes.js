import { Router } from 'express';
import { handleUpload, handleFetch, handleDelete } from '../controllers/imageController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', verifyToken, requireAdmin, upload.single('image'), handleUpload);
router.get('/', verifyToken, requireAdmin, handleFetch);
router.delete('/:id', verifyToken, requireAdmin, handleDelete);

export default router;
