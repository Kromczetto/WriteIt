const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
  sendRequest,
  getRequests,
  acceptRequest,
  getFriends
} = require('../controllers/friendController');

router.post('/request', requireAuth, sendRequest);
router.get('/requests', requireAuth, getRequests);
router.post('/accept/:id', requireAuth, acceptRequest);
router.get('/', requireAuth, getFriends);

module.exports = router;
