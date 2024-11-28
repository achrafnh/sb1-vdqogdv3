import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/lawyer/:lawyerId', reviewController.getLawyerReviews);
router.post('/', authMiddleware, reviewController.createReview);

export default router;