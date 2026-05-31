const Book = require('./Book');
const User = require('./User');
const Transaction = require('./Transaction');

/**
 * safeCreateIndex - Wraps collection.createIndex in try/catch
 * to ignore duplicate index errors (codes 85 and 86).
 */
const safeCreateIndex = async (collection, indexSpec, options = {}) => {
  try {
    await collection.createIndex(indexSpec, { ...options, background: true });
  } catch (error) {
    if (error.code === 85 || error.code === 86) {
      console.warn(`Warning: Duplicate index skipped for ${collection.name}: ${error.message}`);
    } else {
      throw error;
    }
  }
};

/**
 * createIndexes — Creates all performance-critical indexes
 * using the MongoDB driver's createIndex method on each model's .collection property.
 */
const createIndexes = async () => {
  // On Book.collection
  await safeCreateIndex(
    Book.collection,
    { title: 'text', author: 'text', genre: 'text', description: 'text' },
    {
      weights: { title: 10, author: 5, genre: 3, description: 1 },
      name: 'book_text_search'
    }
  );
  await safeCreateIndex(Book.collection, { genre: 1, isActive: 1 });
  await safeCreateIndex(Book.collection, { 'availability.availableCopies': 1, isActive: 1 });
  await safeCreateIndex(Book.collection, { isbn: 1 }, { unique: true, sparse: true });

  // On User.collection
  await safeCreateIndex(User.collection, { email: 1 }, { unique: true });
  await safeCreateIndex(User.collection, { username: 1 }, { unique: true });
  await safeCreateIndex(User.collection, { role: 1, isActive: 1 });

  // On Transaction.collection
  await safeCreateIndex(Transaction.collection, { user: 1, status: 1 });
  await safeCreateIndex(Transaction.collection, { book: 1, status: 1 });
  await safeCreateIndex(Transaction.collection, { createdAt: -1 });
  await safeCreateIndex(Transaction.collection, { dueDate: 1, status: 1 });
  await safeCreateIndex(Transaction.collection, { type: 1, status: 1, returnedAt: 1 });

  console.log('Database indexes ready');
};

module.exports = { createIndexes };
