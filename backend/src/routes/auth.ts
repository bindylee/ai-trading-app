import { Router } from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';

const router = Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

export default router;