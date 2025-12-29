const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { createWork, getWorks } = require('../controllers/workController');

router.post('/works', requireAuth, createWork);
router.get('/works', getWorks);

module.exports = router;