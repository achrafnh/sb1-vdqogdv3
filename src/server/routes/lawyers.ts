import { Router } from 'express';
import { lawyerController } from '../controllers/lawyer.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', lawyerController.searchLawyers);
router.get('/:id', lawyerController.getLawyerById);
router.post('/profile', authMiddleware, lawyerController.createProfile);

export default router;