const Work = require('../models/work');

const createWork = async (req, res) => {
    try {
        const { title, content } = req.body;

        if(!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const work = await Work.create({
            title,
            content,
            author: req.user.id,
        });

        res.status(201).json({ message: "Work created successfully", work });
    } catch(error) {
        console.error('CREATE WORK ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getWorks = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');

        const works = await Work.find()
        .populate('author', 'email')
        .sort({ createdAt: -1 });

        res.status(200).json(works);
    } catch(error) {
        console.log("GET WORKS ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createWork, getWorks };