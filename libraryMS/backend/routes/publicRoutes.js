const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const { getBooks, getBook, searchBooks } = require('../controllers/bookController');
const { optionalAuth } = require('../middleware/optionalAuth');
const { cacheMiddleware } = require('../middleware/cache');

// @route   GET /api/public/books
router.get('/books', cacheMiddleware(300), getBooks);

// @route   GET /api/public/books/search
router.get('/books/search', searchBooks);

// @route   GET /api/public/books/:id
router.get('/books/:id', optionalAuth, getBook);

// @route   GET /api/public/stats
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const availablePhysical = await Book.countDocuments({ 
      isActive: true, 
      bookType: 'physical',
      'availability.availableCopies': { $gt: 0 }
    });
    const totalElectronic = await Book.countDocuments({
      isActive: true,
      bookType: 'electronic'
    });
    const totalMembers = await User.countDocuments({ isActive: true });

    res.json({
      totalBooks,
      availablePhysical,
      totalElectronic,
      totalMembers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
