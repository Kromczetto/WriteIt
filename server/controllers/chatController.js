const mongoose = require('mongoose');
const Message = require('../models/Message');
const FriendRequest = require('../models/FriendRequest');

const toObjectId = id => new mongoose.Types.ObjectId(id);

const isValidObjectId = id =>
  mongoose.Types.ObjectId.isValid(id);

const areFriends = async (userId, friendId) => {
  if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
    return false;
  }

  const u = toObjectId(userId);
  const f = toObjectId(friendId);

  const rel = await FriendRequest.findOne({
    status: 'accepted',
    $or: [
      { from: u, to: f },
      { from: f, to: u },
    ],
  });

  return !!rel;
};

getChat = async (req, res) => {
  try {
    const { friendId } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(friendId)) {
      return res.status(400).json({ message: 'Invalid friendId' });
    }

    if (!(await areFriends(req.user.id, friendId))) {
      return res.status(403).json({ message: 'Not friends' });
    }

    const messages = await Message.find({
      $or: [
        { from: toObjectId(req.user.id), to: toObjectId(friendId) },
        { from: toObjectId(friendId), to: toObjectId(req.user.id) },
      ],
    })
      .populate('work', 'title')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('GET CHAT ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

sendMessage = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { text, workId } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(friendId)) {
      return res.status(400).json({ message: 'Invalid friendId' });
    }

    if (!(await areFriends(req.user.id, friendId))) {
      return res.status(403).json({ message: 'Not friends' });
    }

    const msg = await Message.create({
      from: toObjectId(req.user.id),
      to: toObjectId(friendId),
      text: text || '',
      work: isValidObjectId(workId)
        ? toObjectId(workId)
        : null,
    });

    await msg.populate('work', 'title');

    res.json(msg);
  } catch (err) {
    console.error('SEND MESSAGE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getChat, sendMessage };