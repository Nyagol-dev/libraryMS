const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
      'BOOK_CREATED', 'BOOK_UPDATED', 'BOOK_DELETED',
      'TRANSACTION_REQUESTED', 'TRANSACTION_APPROVED', 'TRANSACTION_REJECTED',
      'TRANSACTION_RETURNED', 'TRANSACTION_COMPLETED', 'EBOOK_DOWNLOADED', 'ADMIN_ACTION'
    ]
  },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  targetBookId: { type: Schema.Types.ObjectId, ref: 'Book' },
  targetTransactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, immutable: true }
}, { timestamps: false });

// Prevent updates – logs are immutable
auditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next(new Error('Audit logs are immutable'));
  }
  next();
});

/**
 * Record an audit log entry.
 * @param {String} action - one of the allowed enum values.
 * @param {ObjectId} performedBy - user performing the action.
 * @param {Object} [extras] - optional additional fields (target ids, details).
 * @param {Object} [req] - optional Express request to extract IP & UA.
 */
auditLogSchema.statics.record = async function (action, performedBy, extras = {}, req) {
  try {
    const log = {
      action,
      performedBy,
      ...extras
    };
    if (req) {
      log.ipAddress = req.ip || (req.connection && req.connection.remoteAddress) || '';
      log.userAgent = req.headers && req.headers['user-agent'] ? req.headers['user-agent'] : '';
    }
    await this.create(log);
  } catch (err) {
    console.error('AuditLog.record error:', err);
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
