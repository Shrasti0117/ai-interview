const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
