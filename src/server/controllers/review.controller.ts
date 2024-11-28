import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { reviewSchema } from '../utils/validation';

export class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const validatedData = reviewSchema.parse(req.body);
      const review = await reviewService.createReview(
        req.user!.userId,
        validatedData
      );
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLawyerReviews(req: Request, res: Response) {
    try {
      const { lawyerId } = req.params;
      const reviews = await reviewService.getLawyerReviews(Number(lawyerId));
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const reviewController = new ReviewController();