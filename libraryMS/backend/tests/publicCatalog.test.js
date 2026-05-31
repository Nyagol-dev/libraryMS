const request = require('supertest');
const server = require('../server');
const User = require('../models/User');
const Book = require('../models/Book');
const { generateToken } = require('../middleware/auth');

describe('Public Catalog Routes', () => {
  let adminUser, adminToken;

  beforeEach(async () => {
    // Create an admin so we can seed books
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Seed',
      email: 'admin-public@test.com',
      username: 'adminpublic',
      password: 'password123',
      role: 'admin',
    });
    adminToken = generateToken(adminUser._id);

    // Seed a physical and an electronic book
    await Book.create([
      {
        title: 'Physical Test Book',
        author: 'Author One',
        genre: 'Science',
        bookType: 'physical',
        availability: { totalCopies: 3, availableCopies: 3 },
        addedBy: adminUser._id,
      },
      {
        title: 'Electronic Test Book',
        author: 'Author Two',
        genre: 'Technology',
        bookType: 'electronic',
        fileUrl: 'uploads/test.pdf',
        availability: { totalCopies: 1, availableCopies: 1 },
        addedBy: adminUser._id,
      },
    ]);
  });

  // ─── GET /api/public/books ────────────────────────────────────────────────
  describe('GET /api/public/books', () => {
    it('should return 200 WITHOUT an Authorization header', async () => {
      const res = await request(server).get('/api/public/books').expect(200);

      // Response should contain a books array
      expect(res.body).toHaveProperty('books');
      expect(Array.isArray(res.body.books)).toBe(true);
    });

    it('should also return 200 with a valid token (authenticated request)', async () => {
      const res = await request(server)
        .get('/api/public/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('books');
    });
  });

  // ─── GET /api/public/stats ────────────────────────────────────────────────
  describe('GET /api/public/stats', () => {
    it('should return stats without auth', async () => {
      const res = await request(server).get('/api/public/stats').expect(200);

      expect(res.body).toHaveProperty('totalBooks');
      expect(res.body).toHaveProperty('availablePhysical');
      expect(res.body).toHaveProperty('totalElectronic');
      expect(res.body).toHaveProperty('totalMembers');
    });

    it('totalBooks should reflect seeded books', async () => {
      const res = await request(server).get('/api/public/stats').expect(200);
      expect(res.body.totalBooks).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── GET /api/public/books/search ─────────────────────────────────────────
  describe('GET /api/public/books/search', () => {
    it('should work without auth and return results for ?q=test', async () => {
      const res = await request(server)
        .get('/api/public/books/search')
        .query({ q: 'test' })
        .expect(200);

      // searchBooks returns an array or object with books
      const books = Array.isArray(res.body) ? res.body : res.body.books;
      expect(Array.isArray(books)).toBe(true);
    });

    it('should also work with a valid auth token', async () => {
      const res = await request(server)
        .get('/api/public/books/search')
        .query({ q: 'Electronic' })
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const books = Array.isArray(res.body) ? res.body : res.body.books;
      expect(Array.isArray(books)).toBe(true);
    });
  });
});
