import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import config from '../../config';
import { AuthenticatedRequest } from '@/middleware/authenticate.middleware';
import { redis } from '../../lib/redis';

const NODE_ENV = config.NODE_ENV

export const authController = {

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.signup(req.body);

      res.cookie("community_auth_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.login(req.body);

      res.cookie("community_auth_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: 'Login successful', data: user });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("community_auth_token");
      res.status(200).json({ message: 'Logged out successfully', data: null });
    } catch (error) {
      next(error);
    }
  },

  async getUserProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const response = await authService.getUserById(req.user?.userId as string);

      res.status(200).json({ message: 'Profile fetched successfully', data: response });
    } catch (error) {
      next(error);
    }
  },

  // Set user ID in Redis
  async setUserInRedis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      await redis.set('widgetSession', userId as string)

      res.status(200).json({
        message: 'Widget session user ID set successfully',
        data: { userId }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user ID from Redis
  async getUserFromRedis(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await redis.get('widgetSession');
      res.status(200).json({
        message: 'Widget session user ID get successfully',
        data: { result }
      });
    } catch (error) {
      next(error);
    }
  }
};