import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', getSettings);
router.put('/:id', verifyToken, requireAdmin, updateSettings);

export default router;
