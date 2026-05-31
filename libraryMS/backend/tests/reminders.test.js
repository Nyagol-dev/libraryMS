/**
 * reminders.test.js
 *
 * Tests the ReminderService logic with nodemailer mocked out so no actual
 * emails are sent.  The mock replaces `../config/emailConfig` which is what
 * reminderService requires internally.
 */

// ─── Mock nodemailer / emailConfig BEFORE any require of reminderService ─────
const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });

jest.mock('../config/emailConfig', () => ({
  sendEmail: mockSendMail,
}));

const reminderService = require('../services/reminderService');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Book = require('../models/Book');

describe('ReminderService', () => {
  let testUser, testBook;

  beforeEach(async () => {
    // Clear mock call history
    mockSendMail.mockClear();

    // Create a user whose email will be asserted in the reminder
    testUser = await User.create({
      firstName: 'Reminder',
      lastName: 'User',
      email: 'reminder@test.com',
      username: 'reminderuser',
      password: 'password123',
      role: 'user',
    });

    // Create a book to attach to the transaction
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Rem',
      email: 'admin-rem@test.com',
      username: 'adminrem',
      password: 'password123',
      role: 'admin',
    });

    testBook = await Book.create({
      title: 'Reminder Test Book',
      author: 'Reminder Author',
      genre: 'History',
      bookType: 'physical',
      availability: { totalCopies: 2, availableCopies: 2 },
      addedBy: adminUser._id,
    });
  });

  // ─── Due-in-3-days reminder ────────────────────────────────────────────────
  describe('checkAndSendReminders() — due in 3 days', () => {
    it('sends one email with subject containing "due in 3" to the correct user', async () => {
      // dueDate exactly 3 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);

      await Transaction.create({
        user: testUser._id,
        book: testBook._id,
        type: 'issue',
        status: 'approved',
        dueDate,
        isOverdue: false,
      });

      await reminderService.checkAndSendReminders();

      // One email should have been sent
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      // Check the recipient
      const [to, subject] = mockSendMail.mock.calls[0];
      expect(to).toBe('reminder@test.com');

      // Subject must contain "due in 3" (case-insensitive)
      expect(subject.toLowerCase()).toContain('due in 3');
    });
  });

  // ─── Overdue detection ─────────────────────────────────────────────────────
  describe('checkAndSendReminders() — past due date', () => {
    it('marks transaction isOverdue: true and calculates fineAmount > 0', async () => {
      // dueDate 5 days in the past
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 5);

      const overdueTransaction = await Transaction.create({
        user: testUser._id,
        book: testBook._id,
        type: 'issue',
        status: 'approved',
        dueDate,
        isOverdue: false,
      });

      await reminderService.checkAndSendReminders();

      // Reload from DB to verify mutations
      const updated = await Transaction.findById(overdueTransaction._id);

      expect(updated.isOverdue).toBe(true);
      expect(updated.fineAmount).toBeGreaterThan(0);
    });

    it('does NOT send an email for overdue transactions (only marks them)', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 2);

      await Transaction.create({
        user: testUser._id,
        book: testBook._id,
        type: 'issue',
        status: 'approved',
        dueDate,
        isOverdue: false,
      });

      await reminderService.checkAndSendReminders();

      // No email is sent for overdue — the service only marks the record
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });

  // ─── Already-overdue transactions are skipped ──────────────────────────────
  describe('checkAndSendReminders() — already marked isOverdue', () => {
    it('skips transactions already marked isOverdue', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 10);

      await Transaction.create({
        user: testUser._id,
        book: testBook._id,
        type: 'issue',
        status: 'approved',
        dueDate,
        isOverdue: true, // already processed
      });

      const summary = await reminderService.checkAndSendReminders();

      // The query filters `isOverdue: false` so this record is excluded
      expect(summary.checked).toBe(0);
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });
});
