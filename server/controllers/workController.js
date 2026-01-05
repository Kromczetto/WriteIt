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
    const works = await Work.find({ status: 'published' })
      .populate('author', 'email')
      .sort({ createdAt: -1 });
  
    res.json(works);
  };
  

const getMyWorks = async (req, res) => {
    try {
        const works = await Work.find({ author: req.user.id }).sort({ createdAt: -1 });

        res.json(works);
    } catch {
        console.log("GET MY WORKS ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getWorkById = async (req, res) => {
    try {
        const work = await Work.findById(req.params.id)

        if(!work) {
            return res.status(404).json({ message: "Work not found" });
        }

        if(work.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(work);

    } catch {
        console.log("GET WORK BY ID ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateWork = async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);

        if(!work) {
            return res.status(404).json({ message: "Work not found" });
        }   

        if(work.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { title, content, status } = req.body;
        
        work.title = title; 
        work.content = content;
        work.status = status;
        
        await work.save();
        res.json(work);
    } catch {
        console.log("UPDATE WORK ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteWork = async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);

        if(!work) {
            return res.status(404).json({ message: "Work not found" });
        }

        if(work.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await work.deleteOne();
        res.json({ success: true });
    } catch {
        console.log("DELETE WORK ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createWork, getWorks, getMyWorks, getWorkById, updateWork, deleteWork };