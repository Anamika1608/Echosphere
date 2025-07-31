import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticateToken } from '../../middleware/authenticate.middleware';
import { signupSchema, loginSchema } from './auth.validation';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/logout', authController.logout);
router.get('/getUserProfile', authenticateToken, authController.getUserProfile);
router.get('/setWidgetSessionUserId', authenticateToken, authController.setUserInRedis);
router.get('/getWidgetSessionUserId', authController.getUserFromRedis);

export { router as authRouter };
