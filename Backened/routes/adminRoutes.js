const express = require("express");
const router = express.Router();
const Planner = require("../models/Planner");
const {
  addSubject,
  getSubjects,
  deleteSubject,
  addQuestion,
  getQuestionsBySubject,
  updateQuestion,
  deleteQuestion,
  getAdminDashboardData,
  getAllUsersWithProgress,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authmiddleware");

// Apply protection and admin check to all routes
router.use(protect);
router.use(admin);

// Dashboard & Stats
router.get("/dashboard", getAdminDashboardData);
router.get("/users-progress", getAllUsersWithProgress);

// Subject Routes
router.post("/subjects", addSubject);
router.get("/subjects", getSubjects);
router.delete("/subjects/:id", deleteSubject);

// Question Routes
router.post("/questions", addQuestion);
router.get("/questions/:subjectId", getQuestionsBySubject);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

// Planner Routes
router.get('/planner', protect, admin, async (req, res) => {
    try {
        const tasks = await Planner.find().sort({ date: 1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/planner', protect, admin, async (req, res) => {
    try {
        const task = await Planner.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/planner/:id', protect, admin, async (req, res) => {
    try {
        await Planner.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
