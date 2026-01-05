const Rental = require('../models/Rental');
const Work = require('../models/work');

const rentWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.workId);
    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    const rental = await Rental.create({
      user: req.user.id,
      work: work._id,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dni
    });

    res.status(201).json({ message: 'Work rented', rental });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You already rented this article'
      });
    }

    console.error('RENT WORK ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyRentals = async (req, res) => {
  const rentals = await Rental.find({ user: req.user.id })
    .populate('work', 'title')
    .sort({ rentedAt: -1 });

  res.json(rentals);
};

module.exports = { rentWork, getMyRentals };
