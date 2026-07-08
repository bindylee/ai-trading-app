import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPortfolio, buyStock, sellStock } from '../controllers/portfolioController';

const router = Router();

// GET /api/portfolio
router.get('/', authMiddleware, getPortfolio);

// POST /api/portfolio/buy
router.post('/buy', authMiddleware, buyStock);

// POST /api/portfolio/sell
router.post('/sell', authMiddleware, sellStock);

export default router;