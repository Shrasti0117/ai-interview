const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  resumeText: String,

  // Language preference for the interview
  language: {
    type: String,
    default: "english",
    enum: ["english", "hindi"],
  },

  questions: [String],
  answers: [String],

  currentQuestion: String,

  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },

  // Track question generation source
  usingFallback: {
    type: Boolean,
    default: false,
  },

  // Max questions for this interview
  maxQuestions: {
    type: Number,
    default: 10,
  },

  // Timestamps for duration calculation
  startedAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: {
    type: Date,
    default: null,
  },

  // Duration in seconds
  duration: {
    type: Number,
    default: 0,
  },

  // Interview performance score (0-100)
  performanceScore: {
    type: Number,
    default: null,
  },

  // Feedback from AI
  feedback: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
