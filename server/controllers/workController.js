const Work = require('../models/work');
const Rental = require('../models/Rental');

const createWork = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }

    const work = await Work.create({
      title,
      content,
      status: status === 'published' ? 'published' : 'draft',
      author: req.user.id
    });

    res.status(201).json(work);
  } catch (error) {
    console.error('CREATE WORK ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getWorks = async (req, res) => {
  const works = await Work.find({ status: 'published' })
    .populate('author', 'email')
    .sort({ createdAt: -1 });

  res.json(works);
};

const searchWorks = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json([]);
  }

  const works = await Work.find(
    {
      status: 'published',
      $text: { $search: q }
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

  res.json(works);
};

const getMyWorks = async (req, res) => {
  const works = await Work.find({ author: req.user.id })
    .sort({ createdAt: -1 });

  res.json(works);
};

const getWorkById = async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  if (work.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(work);
};

const updateWork = async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  if (work.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { title, content, status } = req.body;

  work.title = title;
  work.content = content;
  work.status = status;

  await work.save();
  res.json(work);
};

const deleteWork = async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    return res.status(404).json({ message: 'Work not found' });
  }

  if (work.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  await Rental.deleteMany({ work: work._id });

  await work.deleteOne();
  res.json({ success: true });
};
module.exports = {
  createWork,
  getWorks,
  searchWorks,
  getMyWorks,
  getWorkById,
  updateWork,
  deleteWork
};
