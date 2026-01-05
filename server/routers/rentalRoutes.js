const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
  rentWork,
  getMyRentals,
  deleteRental,
  readRentedWork,
  getMyRentedWorkIds
} = require('../controllers/rentalController');

router.post('/rentals/:workId', requireAuth, rentWork);
router.get('/rentals/my', requireAuth, getMyRentals);
router.delete('/rentals/:id', requireAuth, deleteRental);
router.get('/rentals/read/:workId', requireAuth, readRentedWork);
router.get('/rentals/my/work-ids', requireAuth, getMyRentedWorkIds);

module.exports = router;
