const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { rentWork, getMyRentals, readRentedWork } = require('../controllers/rentalController');

router.post('/rentals/:workId', requireAuth, rentWork);
router.get('/rentals/my', requireAuth, getMyRentals);
router.get('/rentals/read/:workId', requireAuth, readRentedWork);

module.exports = router;
