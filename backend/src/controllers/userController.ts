import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Mock user database
const users: any[] = [];

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    let user = users.find((u) => u.id === req.userId);

    if (!user) {
      user = {
        id: req.userId,
        email: req.user?.email || 'user@example.com',
        firstName: 'User',
        lastName: 'Name',
        riskTolerance: 'medium',
        investmentExperience: 'beginner',
        createdAt: new Date(),
      };
      users.push(user);
    }

    logger.info(`User profile retrieved: ${req.userId}`);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, riskTolerance, investmentExperience } =
      req.body;

    let user = users.find((u) => u.id === req.userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (riskTolerance) user.riskTolerance = riskTolerance;
    if (investmentExperience) user.investmentExperience = investmentExperience;

    user.updatedAt = new Date();

    logger.info(`User profile updated: ${req.userId}`);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw error;
  }
};