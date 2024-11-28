import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(':memory:', { verbose: console.log });

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'lawyer', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lawyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expertise TEXT NOT NULL DEFAULT '[]',
    location TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    rating REAL DEFAULT 0,
    years_of_experience INTEGER DEFAULT 0,
    profile_image TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON lawyers(user_id);
`);

// Create some initial data for testing
db.exec(`
  INSERT OR IGNORE INTO users (email, password, name, role)
  VALUES 
    ('test@example.com', '$2a$10$6KvxYVH3Z1pX5.YT5pX5B.O8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3', 'Test User', 'user'),
    ('lawyer@example.com', '$2a$10$6KvxYVH3Z1pX5.YT5pX5B.O8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3', 'Test Lawyer', 'lawyer');
`);

export default db;