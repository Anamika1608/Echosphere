import { Request, Response, NextFunction } from 'express';
import { voiceChatService } from './voiceChat.service';

export const voiceChatController = {
  async getResidentCallData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await voiceChatService.getResidentCallData(req.body);
      res.status(201).json({ message: 'Resdient data in controller received', data: response });
    } catch (error) {
      next(error);
    }
  },
};
