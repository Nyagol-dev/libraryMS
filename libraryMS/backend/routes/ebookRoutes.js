const express = require('express');
const router = express.Router();
const { requestEbook, downloadEbook } = require('../controllers/ebookController');
const { protect } = require('../middleware/auth');

router.post('/request', protect, requestEbook);
router.get('/download/:token', downloadEbook);

module.exports = router;
