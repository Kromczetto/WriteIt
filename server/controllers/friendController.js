const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

sendRequest = async (req, res) => {
  const { email } = req.body;
  const to = await User.findOne({ email });
  if (!to) return res.status(404).json({ message: 'User not found' });

  if (to._id.equals(req.user.id)) {
    return res.status(400).json({ message: 'Cannot add yourself' });
  }

  const exists = await FriendRequest.findOne({
    from: req.user.id,
    to: to._id
  });

  if (exists) {
    return res.status(400).json({ message: 'Request already sent' });
  }

  await FriendRequest.create({ from: req.user.id, to: to._id });
  res.json({ message: 'Friend request sent' });
};

getRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    to: req.user.id,
    status: 'pending'
  }).populate('from', 'email');

  res.json(requests);
};

acceptRequest = async (req, res) => {
  const request = await FriendRequest.findById(req.params.id);
  if (!request || !request.to.equals(req.user.id)) {
    return res.sendStatus(403);
  }

  request.status = 'accepted';
  await request.save();

  res.json({ message: 'Friend added' });
};

getFriends = async (req, res) => {
  const friends = await FriendRequest.find({
    status: 'accepted',
    $or: [
      { from: req.user.id },
      { to: req.user.id }
    ]
  }).populate('from to', 'email');

  res.json(
    friends.map(f =>
      f.from._id.equals(req.user.id) ? f.to : f.from
    )
  );
};

rejectRequest = async (req, res) => {
  const request = await FriendRequest.findById(req.params.id);

  if (!request || !request.to.equals(req.user.id)) {
    return res.sendStatus(403);
  }

  await request.deleteOne();
  res.json({ message: 'Friend request rejected' });
};

module.exports = { sendRequest, getRequests, acceptRequest, getFriends, rejectRequest }
