import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Mock database for portfolios
const portfolios: any[] = [];

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    let portfolio = portfolios.find((p) => p.userId === req.userId);

    if (!portfolio) {
      portfolio = {
        userId: req.userId,
        holdings: [],
        cash: 10000, // Starting balance
        totalValue: 10000,
        createdAt: new Date(),
      };
      portfolios.push(portfolio);
    }

    logger.info(`Portfolio retrieved for user ${req.userId}`);

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    throw error;
  }
};

export const buyStock = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      throw new AppError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    if (quantity <= 0 || price <= 0) {
      throw new AppError('Invalid quantity or price', 400, 'INVALID_INPUT');
    }

    let portfolio = portfolios.find((p) => p.userId === req.userId);
    if (!portfolio) {
      portfolio = {
        userId: req.userId,
        holdings: [],
        cash: 10000,
        totalValue: 10000,
        createdAt: new Date(),
      };
      portfolios.push(portfolio);
    }

    const cost = quantity * price;
    if (portfolio.cash < cost) {
      throw new AppError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
    }

    // Add to holdings
    const holding = portfolio.holdings.find((h: any) => h.symbol === symbol);
    if (holding) {
      holding.quantity += quantity;
      holding.avgPrice =
        (holding.avgPrice * (holding.quantity - quantity) + price * quantity) /
        holding.quantity;
    } else {
      portfolio.holdings.push({
        symbol,
        quantity,
        avgPrice: price,
        purchaseDate: new Date(),
      });
    }

    portfolio.cash -= cost;
    portfolio.totalValue = portfolio.cash + portfolio.holdings.reduce(
      (sum: number, h: any) => sum + h.quantity * price,
      0
    );

    logger.info(
      `Stock purchased: ${symbol} x${quantity} by user ${req.userId}`
    );

    res.status(201).json({
      success: true,
      data: {
        message: 'Stock purchased successfully',
        portfolio,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const sellStock = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      throw new AppError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    const portfolio = portfolios.find((p) => p.userId === req.userId);
    if (!portfolio) {
      throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
    }

    const holding = portfolio.holdings.find((h: any) => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      throw new AppError(
        'Insufficient shares to sell',
        400,
        'INSUFFICIENT_SHARES'
      );
    }

    const proceeds = quantity * price;
    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        (h: any) => h.symbol !== symbol
      );
    }

    portfolio.cash += proceeds;
    portfolio.totalValue = portfolio.cash + portfolio.holdings.reduce(
      (sum: number, h: any) => sum + h.quantity * price,
      0
    );

    logger.info(
      `Stock sold: ${symbol} x${quantity} by user ${req.userId}`
    );

    res.json({
      success: true,
      data: {
        message: 'Stock sold successfully',
        portfolio,
      },
    });
  } catch (error) {
    throw error;
  }
};