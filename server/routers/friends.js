const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
  sendRequest,
  getRequests,
  acceptRequest,
  getFriends,
  rejectRequest
} = require('../controllers/friendController');

router.post('/request', requireAuth, sendRequest);
router.get('/requests', requireAuth, getRequests);
router.post('/accept/:id', requireAuth, acceptRequest);
router.get('/', requireAuth, getFriends);
router.delete('/reject/:id', requireAuth, rejectRequest);

module.exports = router;
