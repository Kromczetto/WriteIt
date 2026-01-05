const Review = require('../models/Review');

const addReview = async (req, res) => {
  const { rating } = req.body;
  const { workId } = req.params;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user.id, work: workId },
    { rating },
    { upsert: true, new: true }
  );

  res.json(review);
};

const getReviews = async (req, res) => {
const reviews = await Review.find({ work: req.params.workId });

const avg =
    reviews.reduce((s, r) => s + r.rating, 0) /
    (reviews.length || 1);

res.json({
    average: Number(avg.toFixed(1)),
    count: reviews.length,
});
};

module.exports = { addReview, getReviews };