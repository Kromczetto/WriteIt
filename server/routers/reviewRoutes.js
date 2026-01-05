const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const {
  addReview,
  getReviews,
} = require('../controllers/reviewController');

router.post('/:workId', requireAuth, addReview);
router.get('/:workId', getReviews);

module.exports = router;
