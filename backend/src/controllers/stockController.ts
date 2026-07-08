import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Mock stock data
const mockStocks: any[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.95,
    change: 2.5,
    changePercent: 1.33,
    marketCap: '2.98T',
    pe: 28.5,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 380.42,
    change: 1.5,
    changePercent: 0.39,
    marketCap: '2.84T',
    pe: 35.2,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 140.34,
    change: 3.2,
    changePercent: 2.33,
    marketCap: '1.84T',
    pe: 24.1,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 171.58,
    change: 0.8,
    changePercent: 0.47,
    marketCap: '1.78T',
    pe: 62.3,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.35,
    change: -2.1,
    changePercent: -0.84,
    marketCap: '784B',
    pe: 68.5,
  },
];

export const searchStocks = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      throw new AppError('Search query required', 400, 'MISSING_QUERY');
    }

    const query = (q as string).toUpperCase();
    const results = mockStocks.filter(
      (stock) =>
        stock.symbol.includes(query) ||
        stock.name.toUpperCase().includes(query)
    );

    logger.info(`Stock search: ${query} by user ${req.userId}`);

    res.json({
      success: true,
      data: {
        query,
        results,
        count: results.length,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getStockDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      throw new AppError('Stock symbol required', 400, 'MISSING_SYMBOL');
    }

    const stock = mockStocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );

    if (!stock) {
      throw new AppError('Stock not found', 404, 'STOCK_NOT_FOUND');
    }

    logger.info(`Stock details: ${symbol} by user ${req.userId}`);

    res.json({
      success: true,
      data: {
        ...stock,
        historicalData: [
          { date: '2024-01-01', close: 165.5 },
          { date: '2024-01-02', close: 168.2 },
          { date: '2024-01-03', close: 171.5 },
          { date: '2024-01-04', close: 175.3 },
          { date: '2024-01-05', close: 189.95 },
        ],
      },
    });
  } catch (error) {
    throw error;
  }
};