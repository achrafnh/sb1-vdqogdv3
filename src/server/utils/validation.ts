import { z } from 'zod';
import { CITIES, SPECIALIZATIONS } from '../config/constants';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['CLIENT', 'LAWYER', 'ADMIN'])
});

export const lawyerProfileSchema = z.object({
  bio: z.string().min(50),
  hourlyRate: z.number().positive(),
  yearsExperience: z.number().int().positive(),
  city: z.enum(CITIES),
  sector: z.string(),
  specializations: z.array(z.enum(SPECIALIZATIONS)).min(1)
});

export const clientRequestSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(50),
  domain: z.enum(SPECIALIZATIONS)
});

export const appointmentSchema = z.object({
  lawyerId: z.number().int().positive(),
  dateTime: z.string().datetime(),
  duration: z.number().int().min(30).max(180),
  notes: z.string().optional()
});

export const reviewSchema = z.object({
  lawyerId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});

export const questionSchema = z.object({
  title: z.string().min(10),
  content: z.string().min(50)
});

export const answerSchema = z.object({
  content: z.string().min(50)
});