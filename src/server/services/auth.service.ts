import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants';
import { transporter, emailTemplates } from '../config/email';
import type { User } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: 'CLIENT' | 'LAWYER' | 'ADMIN';
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    // Send welcome email
    const template = userData.role === 'LAWYER' 
      ? emailTemplates.welcomeLawyer 
      : emailTemplates.welcomeClient;

    await transporter.sendMail({
      to: user.email,
      subject: template.subject,
      text: template.text(user.name)
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = this.generateToken(user.id);
    return { user, token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}

export const authService = new AuthService();