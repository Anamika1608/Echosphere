import { Router } from 'express';
import { voiceChatController } from './voiceChat.controller';
import { authenticateToken } from '../../middleware/authenticate.middleware';

const router = Router();

router.post('/getResidentCallData', voiceChatController.getResidentCallData);

// manual service/issue request route
router.post('/createNewServiceRequest', authenticateToken, voiceChatController.createNewServiceRequest);

export { router as voiceChatRouter };