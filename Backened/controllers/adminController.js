const Subject = require("../models/Subject");
const Question = require("../models/Question");
const User = require("../models/user");
const Interview = require("../models/Interview");

// --- Subject CRUD ---
exports.addSubject = async (req, res) => {
  try {
    const { title, icon, color, iconColor } = req.body;
    const subject = await Subject.create({ title, icon, color, iconColor });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ subjectId: req.params.id });
    res.json({ success: true, message: "Subject and related questions deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- Question CRUD ---
exports.addQuestion = async (req, res) => {
  try {
    const { subjectId, questionText, difficulty } = req.body;
    const question = await Question.create({ subjectId, questionText, difficulty });
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getQuestionsBySubject = async (req, res) => {
  try {
    const questions = await Question.find({ subjectId: req.params.subjectId });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionText, difficulty } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, difficulty },
      { new: true }
    );
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Question deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- Admin Access to Dashboard/Progress ---
exports.getAdminDashboardData = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const interviewCount = await Interview.countDocuments();
    const subjectCount = await Subject.countDocuments();
    const questionCount = await Question.countDocuments();

    // Latest interviews
    const latestInterviews = await Interview.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        users: userCount,
        interviews: interviewCount,
        subjects: subjectCount,
        questions: questionCount,
      },
      latestInterviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUsersWithProgress = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const interviews = await Interview.find({ userId: user._id });
        const interviewCount = interviews.length;
        const avgScore =
          interviewCount > 0
            ? interviews.reduce((sum, int) => sum + (int.performanceScore || 0), 0) / interviewCount
            : 0;

        return {
          ...user._doc,
          interviewCount,
          avgScore: avgScore.toFixed(2),
        };
      })
    );

    res.json({ success: true, data: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
