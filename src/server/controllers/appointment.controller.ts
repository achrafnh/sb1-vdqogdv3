import { Request, Response } from 'express';
import { appointmentService } from '../services/appointment.service';
import { appointmentSchema } from '../utils/validation';

export class AppointmentController {
  async createAppointment(req: Request, res: Response) {
    try {
      const validatedData = appointmentSchema.parse(req.body);
      const appointment = await appointmentService.createAppointment(
        req.user!.userId,
        validatedData
      );
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserAppointments(req: Request, res: Response) {
    try {
      const appointments = await appointmentService.getUserAppointments(req.user!.userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAppointmentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await appointmentService.updateAppointmentStatus(
        Number(id),
        status
      );
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const appointmentController = new AppointmentController();