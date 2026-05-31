const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { randomUUID } = require('crypto');
const path = require('path');

const requestEbook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.bookType !== 'electronic') {
      return res.status(400).json({ message: 'This book is not an electronic book' });
    }

    const now = new Date();

    const activeTransaction = await Transaction.findOne({
      user: req.user._id,
      book: bookId,
      status: 'approved',
      downloadTokenExpiry: { $gt: now }
    });

    if (activeTransaction) {
      return res.status(400).json({ message: 'You already have an active download link for this book' });
    }

    const downloadTokenExpiry = new Date();
    downloadTokenExpiry.setHours(downloadTokenExpiry.getHours() + 48); // 48 hours from now

    const transaction = await Transaction.create({
      user: req.user._id,
      book: bookId,
      type: 'issue',
      status: 'approved',
      downloadToken: randomUUID(),
      downloadTokenExpiry: downloadTokenExpiry,
      downloadCount: 0,
      maxDownloads: 3
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const downloadEbook = async (req, res) => {
  try {
    const { token } = req.params;
    const now = new Date();

    const transaction = await Transaction.findOne({
      downloadToken: token,
      downloadTokenExpiry: { $gt: now }
    }).populate('book');

    if (!transaction || transaction.downloadCount >= transaction.maxDownloads) {
      return res.status(404).json({ message: 'Invalid or expired download link' });
    }

    const book = transaction.book;

    if (!book || !book.isActive || book.bookType !== 'electronic' || !book.fileUrl) {
      return res.status(404).json({ message: 'Book not available for download' });
    }

    transaction.downloadCount += 1;
    await transaction.save();

    const filePath = path.resolve(book.fileUrl);
    const filename = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}${path.extname(book.fileUrl)}`;

    res.download(filePath, filename, (err) => {
      if (err && !res.headersSent) {
        console.error('File download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = {
  requestEbook,
  downloadEbook
};
