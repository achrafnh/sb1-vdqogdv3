import { Request, Response } from 'express';
import { lawyerService } from '../services/lawyer.service';
import { lawyerProfileSchema } from '../utils/validation';

export class LawyerController {
  async searchLawyers(req: Request, res: Response) {
    try {
      const lawyers = await lawyerService.searchLawyers({
        expertise: req.query.expertise as string,
        location: req.query.location as string,
        rating: req.query.rating ? Number(req.query.rating) : undefined
      });
      
      res.json(lawyers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getLawyerById(req: Request, res: Response) {
    try {
      const lawyer = await lawyerService.getLawyerById(Number(req.params.id));
      if (!lawyer) {
        return res.status(404).json({ message: 'Lawyer not found' });
      }
      res.json(lawyer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProfile(req: Request, res: Response) {
    try {
      const validatedData = lawyerProfileSchema.parse(req.body);
      const lawyer = await lawyerService.createLawyerProfile(
        req.user!.userId,
        validatedData
      );
      res.json(lawyer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const lawyerController = new LawyerController();