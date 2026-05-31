const nodemailer = require('nodemailer');

/**
 * Email configuration using nodemailer.
 * Falls back to console logging when EMAIL_HOST is not configured,
 * so reminder jobs don't crash in development environments.
 */

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_HOST) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Send an email. If email credentials are not configured, logs
 * the email content to console instead of throwing an error.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML email body
 */
const sendEmail = async (to, subject, htmlBody) => {
  const transport = getTransporter();

  if (!transport) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 EMAIL (console fallback — EMAIL_HOST not set)');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body:    ${htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Library System" <noreply@library.com>',
    to,
    subject,
    html: htmlBody,
  };

  await transport.sendMail(mailOptions);
};

module.exports = { sendEmail };
