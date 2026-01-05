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
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
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

const readRentedWork = async (req, res) => {
  const { workId } = req.params;

  const rental = await Rental.findOne({
    user: req.user.id,
    work: workId,
    $or: [
      { expiresAt: { $exists: false } }, 
      { expiresAt: null },               
      { expiresAt: { $gt: new Date() } } 
    ]
  });

  if (!rental) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const work = await Work.findById(workId);

  if (!work) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(work);
};


module.exports = { rentWork, getMyRentals, readRentedWork };
