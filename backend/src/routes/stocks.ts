import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { searchStocks, getStockDetails } from '../controllers/stockController';

const router = Router();

// GET /api/stocks/search?q=AAPL
router.get('/search', authMiddleware, searchStocks);

// GET /api/stocks/:symbol
router.get('/:symbol', authMiddleware, getStockDetails);

export default router;