const Question = require("../models/Question");

// Get questions by subject and/or topic
exports.getQuestions = async (req, res) => {
  try {
    const { subject, topic } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updatedAt = Date.now();
    const question = await Question.findByIdAndUpdate(id, update, { new: true });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to update question" });
  }
};
