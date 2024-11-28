import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { startServer, stopServer } from '../index';
import db from '../database/db';
import { getRandomPort } from '../utils/testing';

let port: number;

beforeAll(async () => {
  port = await getRandomPort();
});

beforeEach(async () => {
  // Initialize a fresh database for each test
  db.exec('BEGIN TRANSACTION');
  
  // Create test data
  db.exec(`
    INSERT INTO users (email, password, name, role)
    VALUES 
      ('test@example.com', '$2a$10$test', 'Test User', 'user'),
      ('lawyer@example.com', '$2a$10$test', 'John Doe', 'lawyer');
  `);

  db.exec(`
    INSERT INTO lawyers (user_id, expertise, location, rating)
    VALUES (
      (SELECT id FROM users WHERE email = 'lawyer@example.com'),
      '["Criminal Law", "Family Law"]',
      'New York',
      4.5
    );
  `);

  // Start server on random port
  await startServer(port);
});

afterEach(async () => {
  await stopServer();
  db.exec('ROLLBACK');
});

afterAll(async () => {
  db.close();
});