import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewService {
  async createReview(clientId: number, data: {
    lawyerId: number;
    rating: number;
    comment?: string;
  }) {
    const review = await prisma.$transaction(async (tx) => {
      // Create the review
      const newReview = await tx.review.create({
        data: {
          clientId,
          ...data
        }
      });

      // Update lawyer's average rating
      const reviews = await tx.review.findMany({
        where: { lawyerId: data.lawyerId }
      });

      const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

      await tx.lawyer.update({
        where: { id: data.lawyerId },
        data: {
          rating: averageRating,
          reviewCount: reviews.length
        }
      });

      return newReview;
    });

    return review;
  }

  async getLawyerReviews(lawyerId: number) {
    return prisma.review.findMany({
      where: { lawyerId },
      include: {
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

export const reviewService = new ReviewService();