const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getChat, sendMessage } = require('../controllers/chatController');

router.get('/:friendId', requireAuth, getChat);
router.post('/:friendId', requireAuth, sendMessage);

module.exports = router;
