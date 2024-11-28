import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Lawyers API Endpoints', () => {
  describe('GET /api/lawyers', () => {
    it('should return all lawyers without filters', async () => {
      const res = await request(app)
        .get('/api/lawyers');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter lawyers by expertise', async () => {
      const res = await request(app)
        .get('/api/lawyers')
        .query({ expertise: 'Criminal Law' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].expertise).toContain('Criminal Law');
    });

    it('should filter lawyers by location', async () => {
      const res = await request(app)
        .get('/api/lawyers')
        .query({ location: 'New York' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].location).toBe('New York');
    });

    it('should filter lawyers by minimum rating', async () => {
      const res = await request(app)
        .get('/api/lawyers')
        .query({ rating: 4 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].rating).toBeGreaterThanOrEqual(4);
    });
  });

  describe('GET /api/lawyers/:id', () => {
    it('should return lawyer details by ID', async () => {
      // First get all lawyers to get a valid ID
      const lawyersRes = await request(app).get('/api/lawyers');
      const lawyerId = lawyersRes.body[0].id;

      const res = await request(app)
        .get(`/api/lawyers/${lawyerId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', lawyerId);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('expertise');
    });

    it('should return 404 for non-existent lawyer', async () => {
      const res = await request(app)
        .get('/api/lawyers/999999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Lawyer not found');
    });
  });
});