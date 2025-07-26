import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.signup(req.body);
      res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      res.status(200).json({ message: 'Login successful', data: user });
    } catch (error) {
      next(error);
    }
  },
};