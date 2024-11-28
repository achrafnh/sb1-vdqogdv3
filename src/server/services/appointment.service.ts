import { PrismaClient } from '@prisma/client';
import { addHours, format } from 'date-fns';
import { transporter, emailTemplates } from '../config/email';

const prisma = new PrismaClient();

export class AppointmentService {
  async createAppointment(clientId: number, data: {
    lawyerId: number;
    dateTime: Date;
    duration: number;
    notes?: string;
  }) {
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        ...data
      },
      include: {
        client: true,
        lawyer: {
          include: {
            user: true
          }
        }
      }
    });

    // Send confirmation emails
    await Promise.all([
      // Client notification
      transporter.sendMail({
        to: appointment.client.email,
        subject: 'Appointment Confirmation',
        text: emailTemplates.appointmentReminder.text(
          appointment.client.name,
          format(appointment.dateTime, 'PPpp'),
          appointment.lawyer.user.name
        )
      }),
      // Lawyer notification
      transporter.sendMail({
        to: appointment.lawyer.user.email,
        subject: 'New Appointment Scheduled',
        text: emailTemplates.appointmentReminder.text(
          appointment.lawyer.user.name,
          format(appointment.dateTime, 'PPpp'),
          appointment.client.name
        )
      })
    ]);

    return appointment;
  }

  async getUserAppointments(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { lawyer: true }
    });

    if (user?.role === 'LAWYER' && user.lawyer) {
      return prisma.appointment.findMany({
        where: { lawyerId: user.lawyer.id },
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
    }

    return prisma.appointment.findMany({
      where: { clientId: userId },
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

  async updateAppointmentStatus(id: number, status: 'COMPLETED' | 'CANCELLED') {
    return prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }
}

export const appointmentService = new AppointmentService();