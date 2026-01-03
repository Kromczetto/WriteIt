const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { 
    createWork, 
    getWorks,
    getMyWorks,
    getWorkById,
    updateWork,
    deleteWork 
} = require('../controllers/workController');

router.post('/works', requireAuth, createWork);
router.get('/works', getWorks);

router.get("/works/my", requireAuth, getMyWorks);
router.get("/works/:id", requireAuth, getWorkById);
router.put("/works/:id", requireAuth, updateWork);
router.delete("/works/:id", requireAuth, deleteWork);

module.exports = router;