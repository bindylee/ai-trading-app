import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, getUserProfile);

// PUT /api/user/profile
router.put('/profile', authMiddleware, updateUserProfile);

export default router;