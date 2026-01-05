const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { exportPdf } = require('../controllers/pdfController');

router.get('/rentals/pdf/:workId', requireAuth, exportPdf);

module.exports = router;
