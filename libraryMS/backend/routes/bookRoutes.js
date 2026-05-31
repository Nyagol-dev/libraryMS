const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

router.route('/')
  .get(cacheMiddleware(300), getBooks)
  .post(protect, admin, createBook);

router.get('/search', searchBooks);

router.route('/:id')
  .get(optionalAuth, getBook)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router; 