import { PrismaClient } from '@prisma/client';
import { transporter, emailTemplates } from '../config/email';

const prisma = new PrismaClient();

export class RequestService {
  async createRequest(clientId: number, data: {
    title: string;
    description: string;
    domain: string;
  }) {
    const request = await prisma.clientRequest.create({
      data: {
        clientId,
        ...data
      },
      include: {
        client: true
      }
    });

    // Find lawyers matching the domain
    const matchingLawyers = await prisma.lawyer.findMany({
      where: {
        specializations: {
          some: {
            specialization: {
              name: data.domain
            }
          }
        }
      },
      include: {
        user: true
      }
    });

    // Notify matching lawyers
    await Promise.all(
      matchingLawyers.map((lawyer) =>
        transporter.sendMail({
          to: lawyer.user.email,
          subject: emailTemplates.newRequest.subject,
          text: emailTemplates.newRequest.text(lawyer.user.name, request.client.name)
        })
      )
    );

    return request;
  }

  async getLawyerResponses(requestId: number) {
    return prisma.lawyerResponse.findMany({
      where: { requestId },
      include: {
        lawyer: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  async respondToRequest(lawyerId: number, requestId: number, data: {
    message: string;
    proposal?: string;
  }) {
    return prisma.lawyerResponse.create({
      data: {
        lawyerId,
        requestId,
        ...data
      }
    });
  }
}

export const requestService = new RequestService();