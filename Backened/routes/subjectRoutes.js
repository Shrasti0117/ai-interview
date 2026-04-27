const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Question = require('../models/Question');

// Get all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get questions by subject
router.get('/:subjectId/questions', async (req, res) => {
    try {
        const questions = await Question.find({ subjectId: req.params.subjectId });
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
