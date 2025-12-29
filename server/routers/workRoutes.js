const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { createWork } = require('../controllers/workController');

router.post('/works', requireAuth, createWork);

module.exports = router;