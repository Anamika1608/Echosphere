import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import config from '../../config';

const NODE_ENV = config.NODE_ENV

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.signup(req.body);

      res.cookie("token", token, {
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

      res.cookie("token", token, {
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
};