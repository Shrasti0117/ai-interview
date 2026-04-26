const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  startInterview,
  answerQuestion,
  getInterviewResults,
} = require("../controllers/interviewcontroller");

const { protect } = require("../middleware/authmiddleware");

router.post("/start", protect, upload.single("resume"), startInterview);
router.post("/answer", protect, answerQuestion);
router.get("/results/:interviewId", protect, getInterviewResults);

module.exports = router;
