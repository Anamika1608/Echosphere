import { Router } from 'express';
import { voiceChatController } from './voiceChat.controller';

const router = Router();

router.post('/getResidentCallData', voiceChatController.getResidentCallData);

export { router as voiceChatRouter };