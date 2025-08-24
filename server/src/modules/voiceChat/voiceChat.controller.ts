import { Request, Response, NextFunction } from 'express';
import { voiceChatService } from './voiceChat.service';
import { AppError } from '../../utils/errors';
import { AuthenticatedRequest } from '@/middleware/authenticate.middleware';

export const voiceChatController = {
  async getResidentCallData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await voiceChatService.getResidentCallData(req.body);
      res.status(201).json({ message: 'Resdient data in controller received', data: response });
    } catch (error) {
      next(error);
    }
  },
  async createNewServiceRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }
      const userId = req.user?.userId as string;
      const response = await voiceChatService.createNewServiceRequest(req.body, userId);
      res.status(201).json({ message: 'New service request created successfully', data: response });
    } catch (error) {
      next(error);
    }
  }
};
