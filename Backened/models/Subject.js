const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String, // Icon name or class
    default: "FaCode",
  },
  color: {
    type: String,
    default: "#e0edff",
  },
  iconColor: {
    type: String,
    default: "#2563eb",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subject", subjectSchema);
