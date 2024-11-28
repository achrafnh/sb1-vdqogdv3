import { Router } from 'express';
import authRoutes from './auth';
import lawyerRoutes from './lawyers';
import requestRoutes from './requests';
import appointmentRoutes from './appointments';
import reviewRoutes from './reviews';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/lawyers', lawyerRoutes);
router.use('/requests', authMiddleware, requestRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/reviews', reviewRoutes);

export default router;