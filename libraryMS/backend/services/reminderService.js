const Transaction = require('../models/Transaction');
const { sendEmail } = require('../config/emailConfig');

/**
 * ReminderService — handles due-date email notifications
 * and overdue detection for library book transactions.
 */
class ReminderService {
  /**
   * Send a due-date reminder email for a single transaction.
   *
   * @param {Object} transaction - Mongoose transaction document (will be populated)
   * @param {number} daysUntilDue - Number of days until the book is due
   */
  async sendDueReminder(transaction, daysUntilDue) {
    // Populate user and book if not already populated
    if (!transaction.populated('user')) {
      await transaction.populate('user', 'email firstName lastName');
    }
    if (!transaction.populated('book')) {
      await transaction.populate('book', 'title author');
    }

    const { user, book, dueDate } = transaction;
    const finePerDay = process.env.FINE_PER_DAY || 2;
    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const subject =
      daysUntilDue === 0
        ? 'Your library book is due today'
        : `Your library book is due in ${daysUntilDue} day(s)`;

    const urgencyColor = daysUntilDue === 0 ? '#e74c3c' : '#f39c12';
    const urgencyText =
      daysUntilDue === 0
        ? '⚠️ Your book is due <strong>today</strong>!'
        : `📅 Your book is due in <strong>${daysUntilDue} day(s)</strong>.`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: ${urgencyColor}; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Library Book Reminder</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${user.firstName}</strong>,</p>
          <p style="font-size: 15px; color: #555;">${urgencyText}</p>
          <div style="background: #f8f9fa; border-left: 4px solid ${urgencyColor}; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0; color: #333;"><strong>Book:</strong> ${book.title}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Author:</strong> ${book.author}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Due Date:</strong> ${formattedDueDate}</p>
          </div>
          <p style="font-size: 14px; color: #e74c3c; font-weight: 600;">
            Please return the book by the due date to avoid a late fine of $${finePerDay} per day.
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 24px;">
            If you have already returned this book, please disregard this email.
          </p>
        </div>
        <div style="background: #f1f1f1; padding: 16px; text-align: center; font-size: 13px; color: #999;">
          <p style="margin: 0;">📚 ${process.env.LIBRARY_NAME || 'Library Management System'}</p>
        </div>
      </div>
    `;

    await sendEmail(user.email, subject, htmlBody);
  }

  /**
   * Main job function — checks all active issued transactions
   * and sends reminders or marks overdue as appropriate.
   *
   * @returns {Object} Summary: { checked, remindersDay3, remindersDay0, markedOverdue, errors }
   */
  async checkAndSendReminders() {
    const summary = {
      checked: 0,
      remindersDay3: 0,
      remindersDay0: 0,
      markedOverdue: 0,
      errors: [],
    };

    const transactions = await Transaction.find({
      type: 'issue',
      status: 'approved',
      returnedAt: { $exists: false },
      isOverdue: false,
    });

    summary.checked = transactions.length;
    const reminderDays = parseInt(process.env.REMINDER_DAYS_BEFORE) || 3;
    const now = new Date();

    for (const transaction of transactions) {
      try {
        const daysUntilDue = Math.ceil(
          (new Date(transaction.dueDate) - now) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilDue < 0) {
          // Book is overdue — mark it and calculate fine
          const daysOverdue = Math.abs(daysUntilDue);
          const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 2;

          transaction.isOverdue = true;
          transaction.fineAmount = daysOverdue * finePerDay;
          await transaction.save();

          summary.markedOverdue++;
        } else if (daysUntilDue === reminderDays) {
          await this.sendDueReminder(transaction, daysUntilDue);
          summary.remindersDay3++;
        } else if (daysUntilDue === 0) {
          await this.sendDueReminder(transaction, 0);
          summary.remindersDay0++;
        }
      } catch (err) {
        // One failed email should not stop the entire batch
        summary.errors.push({
          transactionId: transaction._id,
          error: err.message,
        });
      }
    }

    return summary;
  }
}

module.exports = new ReminderService();
