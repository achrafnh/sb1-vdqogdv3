import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userSchema } from '../utils/validation';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = userSchema.parse(req.body);
      const { user, token } = await authService.register(validatedData);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();