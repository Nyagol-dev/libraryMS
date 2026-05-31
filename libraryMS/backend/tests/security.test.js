const request = require('supertest');
const server = require('../server');
const { authLimiter } = require('../middleware/rateLimiter');

describe('Security Tests', () => {
  // ─── Role Stripping ───────────────────────────────────────────────────────
  describe('POST /api/auth/register — role stripping', () => {
    it('should ignore role: "admin" in body and create a regular user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          firstName: 'Hacker',
          lastName: 'User',
          email: 'hacker@test.com',
          username: 'hackeruser',
          password: 'password123',
          role: 'admin', // attempt to self-elevate
        })
        .expect(201);

      // The server should have stripped the admin role
      expect(res.body.role).toBe('user');
    });
  });

  // ─── Rate Limiting ────────────────────────────────────────────────────────
  describe('POST /api/auth/login — rate limiting', () => {
    // Reset the limiter's in-memory store before this block so prior tests
    // don't consume our quota (express-rate-limit stores hits per key).
    beforeEach(() => {
      // The authLimiter uses an in-memory store keyed by IP.
      // Resetting via the store's `resetKey` method (if available) or by
      // clearing internal state keeps the test isolated.
      if (authLimiter.resetKey) {
        authLimiter.resetKey('::ffff:127.0.0.1');
        authLimiter.resetKey('127.0.0.1');
        authLimiter.resetKey('::1');
      }
    });

    it('should return 429 after 10 rapid requests', async () => {
      const payload = { email: 'nobody@test.com', password: 'wrongpass' };

      // Fire 10 requests sequentially to exhaust the limit (max: 10).
      for (let i = 0; i < 10; i++) {
        await request(server).post('/api/auth/login').send(payload);
      }

      // The 11th request must be rate-limited.
      const res = await request(server)
        .post('/api/auth/login')
        .send(payload);

      expect(res.status).toBe(429);
    });
  });

  // ─── MongoDB Injection ────────────────────────────────────────────────────
  describe('POST /api/auth/login — MongoDB injection protection', () => {
    it('should return 400 or 401 (not 500) when email is a $gt operator', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: { $gt: '' },
          password: 'anything',
        });

      // mongo-sanitize / xss-clean should neutralise the operator.
      // The result must NOT be a server error.
      expect([400, 401]).toContain(res.status);
    });

    it('should return 400 or 401 for injection in the password field', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'legit@test.com',
          password: { $gt: '' },
        });

      expect([400, 401]).toContain(res.status);
    });
  });
});
