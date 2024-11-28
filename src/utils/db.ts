import Loki from 'lokijs';

class Database {
  private db: Loki;
  private users: Collection<any>;
  private lawyers: Collection<any>;

  constructor() {
    this.db = new Loki('legalconnect.db');
    this.users = this.db.addCollection('users', {
      unique: ['email'],
      indices: ['email']
    });
    this.lawyers = this.db.addCollection('lawyers', {
      indices: ['userId']
    });

    // Add some initial data
    this.seedData();
  }

  private seedData() {
    if (this.users.count() === 0) {
      this.users.insert({
        email: 'test@example.com',
        password: '$2a$10$6KvxYVH3Z1pX5.YT5pX5B.O8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3',
        name: 'Test User',
        role: 'user',
        created_at: new Date()
      });

      this.users.insert({
        email: 'lawyer@example.com',
        password: '$2a$10$6KvxYVH3Z1pX5.YT5pX5B.O8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3',
        name: 'Test Lawyer',
        role: 'lawyer',
        created_at: new Date()
      });

      const lawyer = this.users.findOne({ email: 'lawyer@example.com' });
      this.lawyers.insert({
        user_id: lawyer.$loki,
        expertise: JSON.stringify(['Criminal Law', 'Family Law']),
        location: 'New York',
        bio: 'Experienced lawyer with 10+ years of practice',
        rating: 4.5,
        years_of_experience: 10
      });
    }
  }

  getUsers() {
    return this.users;
  }

  getLawyers() {
    return this.lawyers;
  }

  clearDatabase() {
    this.users.clear();
    this.lawyers.clear();
  }
}

export default new Database();