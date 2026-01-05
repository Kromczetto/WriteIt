const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const Work = require('../models/work');

const rentWork = async (req, res) => {
  try {
    const { days } = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const workId = new mongoose.Types.ObjectId(req.params.workId);

    const work = await Work.findOne({
      _id: workId,
      status: 'published'
    });

    if (!work) {
      return res.status(404).json({
        message: 'Article not available'
      });
    }

    if (work.author.toString() === userId.toString()) {
      return res.status(400).json({
        message: 'You cannot rent your own article'
      });
    }

    let expiresAt = null;
    if (days && Number(days) > 0) {
      expiresAt = new Date(
        Date.now() + Number(days) * 86400000
      );
    }

    const rental = await Rental.create({
      user: userId,
      work: workId,
      expiresAt
    });

    res.status(201).json(rental);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Article already rented' });
    }

    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyRentals = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const rentals = await Rental.find({ user: userId })
    .populate('work', 'title')
    .sort({ createdAt: -1 });

  res.json(rentals);
};

const deleteRental = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const rentalId = new mongoose.Types.ObjectId(req.params.id);

  const rental = await Rental.findOneAndDelete({
    _id: rentalId,
    user: userId
  });

  if (!rental) {
    return res.status(404).json({
      message: 'Rental not found'
    });
  }

  res.json({ success: true });
};

const readRentedWork = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const workId = new mongoose.Types.ObjectId(req.params.workId);

  const rental = await Rental.findOne({
    user: userId,
    work: workId,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });

  if (!rental) {
    return res.status(403).json({
      message: 'Access denied'
    });
  }

  const work = await Work.findById(workId);
  res.json(work);
};

const getMyRentedWorkIds = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const rentals = await Rental.find({ user: userId }).select(
    'work'
  );

  res.json(rentals.map(r => r.work.toString()));
};

const getTopRented = async (req, res) => {
  const top = await Rental.aggregate([
    { $group: { _id: '$work', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'works',
        localField: '_id',
        foreignField: '_id',
        as: 'work'
      }
    },
    { $unwind: '$work' },
    {
      $project: {
        _id: '$work._id',
        title: '$work.title',
        count: 1
      }
    }
  ]);

  res.json(top);
};

module.exports = {
  rentWork,
  getMyRentals,
  deleteRental,
  readRentedWork,
  getMyRentedWorkIds,
  getTopRented
};
