const express = require("express");
const router = express.Router();
const { getQuestions, updateQuestion } = require("../controllers/questioncontroller");
const { protect } = require("../middleware/authmiddleware");

// Get questions by subject/topic
router.get("/questions", protect, getQuestions);

// Update a question by ID
router.put("/questions/:id", protect, updateQuestion);

module.exports = router;
