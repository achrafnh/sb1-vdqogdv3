import { PrismaClient } from '@prisma/client';
import type { Lawyer, Prisma } from '@prisma/client';
import type { SearchFilters } from '../types';

const prisma = new PrismaClient();

export class LawyerService {
  async searchLawyers(filters: SearchFilters) {
    const where: Prisma.LawyerWhereInput = {};

    if (filters.expertise) {
      where.specializations = {
        some: {
          specialization: {
            name: filters.expertise
          }
        }
      };
    }

    if (filters.location) {
      where.city = filters.location;
    }

    if (filters.rating) {
      where.rating = {
        gte: filters.rating
      };
    }

    return prisma.lawyer.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        specializations: {
          include: {
            specialization: true
          }
        }
      }
    });
  }

  async getLawyerById(id: number) {
    return prisma.lawyer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        specializations: {
          include: {
            specialization: true
          }
        },
        reviews: {
          include: {
            client: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }

  async createLawyerProfile(userId: number, data: {
    bio: string;
    hourlyRate: number;
    yearsExperience: number;
    city: string;
    sector: string;
    specializations: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const lawyer = await tx.lawyer.create({
        data: {
          userId,
          bio: data.bio,
          hourlyRate: data.hourlyRate,
          yearsExperience: data.yearsExperience,
          city: data.city,
          sector: data.sector
        }
      });

      const specializationPromises = data.specializations.map((name) =>
        tx.specialization.upsert({
          where: { name },
          create: { name },
          update: {}
        })
      );

      const specializations = await Promise.all(specializationPromises);

      await tx.lawyerSpecialization.createMany({
        data: specializations.map((spec) => ({
          lawyerId: lawyer.id,
          specializationId: spec.id
        }))
      });

      return lawyer;
    });
  }
}

export const lawyerService = new LawyerService();