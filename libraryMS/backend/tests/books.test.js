const request = require('supertest');
const server = require('../server');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

describe('Books Endpoints', () => {
  let adminToken, userToken, adminUser, regularUser;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      username: 'admin',
      password: 'password123',
      role: 'admin'
    });
    adminToken = generateToken(adminUser._id);

    // Create regular user
    regularUser = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      username: 'user',
      password: 'password123',
      role: 'user'
    });
    userToken = generateToken(regularUser._id);
  });

  describe('GET /api/books', () => {
    it('should get all books for any authenticated user', async () => {
      const res = await request(server)
        .get('/api/books')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body.books)).toBe(true);
    });
  });

  describe('POST /api/books', () => {
    it('should allow admin to create book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        isbn: '1234567890',
        availability: {
          totalCopies: 5,
          availableCopies: 5
        }
      };

      const res = await request(server)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bookData)
        .expect(201);

      expect(res.body.title).toBe(bookData.title);
      expect(res.body.author).toBe(bookData.author);
    });

    it('should deny regular user from creating book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author'
      };

      await request(server)
        .post('/api/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookData)
        .expect(403);
    });
  });
});