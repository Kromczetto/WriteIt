const Message = require('../models/Message');

exports.getChat = async (req, res) => {
  const friendId = req.params.friendId;

  const messages = await Message.find({
    $or: [
      { from: req.user.id, to: friendId },
      { from: friendId, to: req.user.id }
    ]
  })
    .populate('work', 'title')
    .sort({ createdAt: 1 });

  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { text, workId } = req.body;

  const msg = await Message.create({
    from: req.user.id,
    to: req.params.friendId,
    text,
    work: workId || null
  });

  res.json(msg);
};
