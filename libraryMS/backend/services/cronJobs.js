const cron = require('node-cron');
const reminderService = require('./reminderService');

/**
 * Register and start all cron jobs.
 * Should be called after the database connection is established.
 */
const startCronJobs = () => {
  // Run every day at 8:00 AM East Africa Time (UTC+3)
  cron.schedule(
    '0 8 * * *',
    async () => {
      console.log(`[CRON] Due-date reminder job started at ${new Date().toISOString()}`);

      try {
        const summary = await reminderService.checkAndSendReminders();

        console.log('[CRON] Reminder job completed:', {
          checked: summary.checked,
          remindersDay3: summary.remindersDay3,
          remindersDay0: summary.remindersDay0,
          markedOverdue: summary.markedOverdue,
          errors: summary.errors.length,
        });

        if (summary.errors.length > 0) {
          console.warn('[CRON] Reminder errors:', summary.errors);
        }
      } catch (err) {
        console.error('[CRON] Top-level reminder job error:', err.message);
      }
    },
    {
      timezone: 'Africa/Nairobi',
    }
  );

  console.log('📅 Cron jobs registered — reminders scheduled daily at 08:00 AM EAT');
};

module.exports = { startCronJobs };
