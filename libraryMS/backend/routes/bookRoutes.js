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

const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

router.route('/')
  .get(cacheMiddleware(300), getBooks)
  .post(protect, admin, createBook);

router.get('/search', searchBooks);

router.route('/:id')
  .get(getBook)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router; 