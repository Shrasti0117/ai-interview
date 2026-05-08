const { PDFParse } = require("pdf-parse");
const Interview = require("../models/Interview");
const generateQuestion = require("../utils/generatequestion");

exports.startInterview = async (req, res) => {
  try {
    // ✅ Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const { language = "english" } = req.body;

    console.log("📄 Processing resume file...", req.file.originalname);
    console.log(`🌍 Interview Language: ${language}`);

    const parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    await parser.destroy();

    const resumeText = data?.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Resume file is empty or unreadable" });
    }

    console.log("🤖 Generating first question from resume...");
    const result = await generateQuestion(resumeText, [], null, language);
    const { question: firstQuestion, usingFallback } = result;

    // Determine max questions based on source
    let maxQuestions;
    if (usingFallback) {
      maxQuestions = 6; // Local fallback: max 6 questions
      console.log("📊 Using Local Fallback Questions - Interview will run max 6 questions");
    } else {
      // Gemini API: random between 6-10 questions
      maxQuestions = Math.floor(Math.random() * 5) + 6; // 6-10
      console.log(`📊 Using Gemini API - Interview will run max ${maxQuestions} questions`);
    }

    console.log("💾 Creating interview record in database...");
    const interview = await Interview.create({
      userId: req.user.id,
      resumeText,
      language,
      questions: [firstQuestion],
      currentQuestion: firstQuestion,
      usingFallback,
      maxQuestions,
    });

    console.log("✅ Interview started successfully:", interview._id);

    res.json({
      interviewId: interview._id,
      question: firstQuestion,
      usingFallback,
      maxQuestions,
      language,
    });
  } catch (err) {
    console.error("❌ Interview Start Error:", err.message);
    console.error("Full Error:", err);
    
    // Return detailed error to help with debugging
    res.status(500).json({ 
      error: err.message || "Failed to start interview",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({ error: "Interview ID and answer are required" });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    interview.answers.push(answer);

    // Check if interview should end based on max questions
    if (interview.questions.length >= interview.maxQuestions) {
      console.log(`✅ Interview Complete - Reached maximum of ${interview.maxQuestions} questions`);
      interview.status = "completed";
      interview.completedAt = new Date();

      // Calculate duration
      interview.duration = Math.round((interview.completedAt - interview.startedAt) / 1000);

      // Calculate performance score (0-100)
      const avgAnswerLength =
        interview.answers.reduce((sum, ans) => sum + ans.trim().length, 0) /
        interview.answers.length;
      const timePerQuestion = interview.duration / interview.questions.length;

      // Scoring logic:
      // - Answer quality (word length, depth)
      // - Time management (not too fast, not too slow)
      let score = 50; // Base score

      // Reward detailed answers (200+ chars avg)
      if (avgAnswerLength >= 200) score += 20;
      else if (avgAnswerLength >= 100) score += 10;

      // Reward appropriate pacing (60-300 seconds per question)
      if (timePerQuestion >= 60 && timePerQuestion <= 300) score += 20;
      else if (timePerQuestion >= 40 && timePerQuestion <= 400) score += 10;

      // Bonus for completing full interview
      score += 10;

      interview.performanceScore = Math.min(100, score);

      // Generate basic feedback
      interview.feedback = generateFeedback(
        avgAnswerLength,
        timePerQuestion,
        interview.performanceScore,
        interview.questions.length
      );

      await interview.save();

      return res.json({
        interviewComplete: true,
        message: `Interview completed with ${interview.questions.length} questions`,
        totalQuestions: interview.questions.length,
        maxQuestions: interview.maxQuestions,
        duration: interview.duration,
        performanceScore: interview.performanceScore,
        usingFallback: interview.usingFallback,
        interviewId: interview._id,
      });
    }

    console.log("🤖 Generating next question...");
    const result = await generateQuestion(
      interview.resumeText,
      interview.questions,
      answer,
      interview.language
    );
    const { question: nextQuestion, usingFallback } = result;

    // Update fallback status if it changed
    if (usingFallback !== interview.usingFallback) {
      interview.usingFallback = usingFallback;
      if (usingFallback) {
        interview.maxQuestions = 6; // Switch to fallback limit
        console.log("⚠️ Switched to fallback questions - Limiting to 6 total questions");
      }
    }

    interview.questions.push(nextQuestion);
    interview.currentQuestion = nextQuestion;

    await interview.save();

    console.log(`✅ Answer saved and next question generated (${interview.questions.length}/${interview.maxQuestions})`);

    res.json({
      question: nextQuestion,
      currentQuestionNumber: interview.questions.length,
      maxQuestions: interview.maxQuestions,
      usingFallback: interview.usingFallback,
      interviewComplete: false,
    });
  } catch (err) {
    console.error("❌ Answer Processing Error:", err.message);
    console.error("Full Error:", err);

    res.status(500).json({ 
      error: err.message || "Failed to process answer",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

// ✅ Helper function to generate feedback based on performance
const generateFeedback = (avgAnswerLength, timePerQuestion, score, totalQuestions) => {
  let feedback = "";

  if (score >= 80) {
    feedback = "🌟 Excellent performance! Your answers were detailed and well-paced.";
  } else if (score >= 70) {
    feedback = "👍 Good performance! You demonstrated solid interview skills.";
  } else if (score >= 60) {
    feedback = "🤔 Average performance. Try providing more detailed answers with specific examples.";
  } else {
    feedback = "💡 Keep practicing! Focus on providing deeper, more detailed responses.";
  }

  // Add specific feedback based on answer length
  if (avgAnswerLength < 50) {
    feedback += " Consider providing more detailed answers.";
  } else if (avgAnswerLength > 500) {
    feedback += " Great depth! Remember to stay concise when needed.";
  }

  // Add timing feedback
  if (timePerQuestion < 30) {
    feedback += " You answered quite quickly - ensure you're not rushing.";
  } else if (timePerQuestion > 600) {
    feedback += " You took substantial time per question - that's thorough!";
  }

  return feedback;
};

// ✅ Get interview results and feedback
exports.getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ error: "Interview ID is required" });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Only allow accessing own interviews
    if (interview.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this interview" });
    }

    // Calculate detailed metrics
    const totalQuestions = interview.questions.length;
    const totalAnswers = interview.answers.length;
    const avgAnswerLength = totalAnswers > 0
      ? Math.round(interview.answers.reduce((sum, ans) => sum + ans.trim().length, 0) / totalAnswers)
      : 0;

    const durationMinutes = Math.floor(interview.duration / 60);
    const durationSeconds = interview.duration % 60;

    // Prepare Q&A pairs with word counts
    const qaPairs = interview.questions.map((question, index) => ({
      questionNumber: index + 1,
      question,
      answer: interview.answers[index] || "Not answered",
      wordCount: interview.answers[index] ? interview.answers[index].trim().split(/\s+/).length : 0,
      charCount: interview.answers[index] ? interview.answers[index].trim().length : 0,
    }));

    res.json({
      success: true,
      interview: {
        _id: interview._id,
        status: interview.status,
        language: interview.language,
        totalQuestions,
        totalAnswers,
        usingFallback: interview.usingFallback,
        performanceScore: interview.performanceScore,
        feedback: interview.feedback,
        duration: interview.duration,
        durationFormatted: `${durationMinutes}m ${durationSeconds}s`,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        metrics: {
          avgAnswerLength,
          avgAnswerWords: totalAnswers > 0
            ? Math.round(
                interview.answers.reduce(
                  (sum, ans) => sum + ans.trim().split(/\s+/).length,
                  0
                ) / totalAnswers
              )
            : 0,
          timePerQuestion: Math.round(interview.duration / totalQuestions),
        },
        qaPairs,
      },
    });
  } catch (err) {
    console.error("❌ Get Interview Results Error:", err.message);
    res.status(500).json({
      error: err.message || "Failed to retrieve interview results",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
