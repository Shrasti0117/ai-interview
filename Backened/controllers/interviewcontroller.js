const { PDFParse } = require("pdf-parse");
const Interview = require("../models/Interview");
const generateQuestion = require("../utils/generatequestion");

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "where", "how", "what", "why",
  "is", "are", "was", "were", "be", "been", "being", "to", "of", "in", "on", "at", "for", "from",
  "with", "without", "as", "by", "it", "this", "that", "these", "those", "i", "we", "you", "they",
  "he", "she", "my", "our", "your", "their", "me", "us", "them", "do", "did", "does", "done", "have",
  "has", "had", "can", "could", "will", "would", "should", "may", "might", "about", "into", "over", "under"
]);

const tokenize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getOverlapStats = (question = "", answer = "") => {
  const questionTokens = tokenize(question);
  const answerTokens = tokenize(answer);
  const overlapCount = questionTokens.length > 0
    ? questionTokens.filter((token) => answerTokens.includes(token)).length
    : 0;

  return {
    questionTokens,
    answerTokens,
    overlapCount,
  };
};

const validateAnswerRelevance = (question = "", answer = "") => {
  const normalizedAnswer = (answer || "").trim();
  const answerWordCount = normalizedAnswer ? normalizedAnswer.split(/\s+/).filter(Boolean).length : 0;
  const { questionTokens, answerTokens, overlapCount } = getOverlapStats(question, normalizedAnswer);

  // Strict rule for short replies: must include at least one question-related keyword.
  if (answerWordCount <= 8) {
    if (answerTokens.length === 0 || overlapCount === 0) {
      return {
        isValid: false,
        message: "Answer must include words related to the current question.",
      };
    }
  }

  // For longer replies, reject only when there is clearly no topical overlap.
  if (answerWordCount > 8 && questionTokens.length > 0 && overlapCount === 0) {
    return {
      isValid: false,
      message: "Your answer does not appear related to the question. Please answer the asked topic.",
    };
  }

  return { isValid: true };
};

const assessSingleAnswer = (question = "", answer = "") => {
  const normalizedAnswer = (answer || "").trim();
  const questionTokens = tokenize(question);
  const answerTokens = tokenize(normalizedAnswer);

  const answerWordCount = normalizedAnswer ? normalizedAnswer.split(/\s+/).filter(Boolean).length : 0;
  const uniqueRatio = answerTokens.length > 0
    ? new Set(answerTokens).size / answerTokens.length
    : 0;

  const overlapCount = questionTokens.length > 0
    ? questionTokens.filter((token) => answerTokens.includes(token)).length
    : 0;
  const relevanceRatio = questionTokens.length > 0 ? overlapCount / questionTokens.length : 0;

  const structureHints = ["because", "therefore", "result", "impact", "challenge", "solution", "implemented", "optimized", "improved"];
  const hasStructure = structureHints.some((hint) => normalizedAnswer.toLowerCase().includes(hint));

  const hasNumberEvidence = /(\d+%|\d+\s*(ms|sec|seconds|minutes|hours|days|weeks|months|years|x))/i.test(normalizedAnswer);
  const isVague = /(^|\s)(idk|i don't know|not sure|maybe|can't remember)(\s|$)/i.test(normalizedAnswer);
  const isVeryShort = answerWordCount <= 3;
  const isShort = answerWordCount > 3 && answerWordCount < 10;

  const depthScore = clamp(answerWordCount / 140, 0, 1); // 140 words ~= full depth score
  const relevanceScore = clamp(relevanceRatio * 1.8, 0, 1); // reward aligned answers
  const clarityScore = clamp(uniqueRatio, 0, 1);
  const specificityScore = hasNumberEvidence ? 1 : clamp(answerWordCount / 220, 0, 0.6);
  const structureScore = hasStructure ? 1 : 0.4;
  const vaguePenalty = isVague ? 0.2 : 0;
  const brevityPenalty = isVeryShort ? 0.4 : isShort ? 0.2 : 0;

  let score = clamp(
    (relevanceScore * 0.35 + depthScore * 0.25 + specificityScore * 0.2 + clarityScore * 0.1 + structureScore * 0.1 - vaguePenalty) * 100,
    0,
    100
  );

  score = clamp(score - brevityPenalty * 100, 0, 100);

  // Hard caps for low-content answers so timing/completion cannot inflate final result.
  if (isVeryShort) {
    score = Math.min(score, 20);
  } else if (isShort) {
    score = Math.min(score, 45);
  }

  return {
    score: Math.round(score),
    answerWordCount,
    relevanceRatio,
    hasNumberEvidence,
    hasStructure,
    isVague,
  };
};

const evaluateInterviewResponses = (questions = [], answers = [], durationSeconds = 0) => {
  const answeredCount = Math.min(questions.length, answers.length);
  const assessments = [];

  for (let i = 0; i < answeredCount; i += 1) {
    assessments.push(assessSingleAnswer(questions[i], answers[i]));
  }

  const avgQuality = assessments.length > 0
    ? assessments.reduce((sum, item) => sum + item.score, 0) / assessments.length
    : 0;

  const avgWords = assessments.length > 0
    ? assessments.reduce((sum, item) => sum + item.answerWordCount, 0) / assessments.length
    : 0;

  const avgRelevance = assessments.length > 0
    ? assessments.reduce((sum, item) => sum + item.relevanceRatio, 0) / assessments.length
    : 0;

  const evidenceRate = assessments.length > 0
    ? assessments.filter((item) => item.hasNumberEvidence).length / assessments.length
    : 0;

  const vagueRate = assessments.length > 0
    ? assessments.filter((item) => item.isVague).length / assessments.length
    : 0;

  const timePerQuestion = answeredCount > 0 ? durationSeconds / answeredCount : 0;
  const pacingScore = timePerQuestion >= 50 && timePerQuestion <= 360
    ? 100
    : timePerQuestion >= 30 && timePerQuestion <= 500
      ? 80
      : 60;

  const completionRate = questions.length > 0 ? answeredCount / questions.length : 0;
  const completionScore = completionRate * 100;

  let finalScore = Math.round(clamp(avgQuality * 0.75 + pacingScore * 0.15 + completionScore * 0.1, 0, 100));

  // Interview-level cap to ensure consistently short answers stay low-scoring.
  if (avgWords <= 3) {
    finalScore = Math.min(finalScore, 25);
  } else if (avgWords < 10) {
    finalScore = Math.min(finalScore, 50);
  }

  return {
    finalScore,
    avgQuality: Math.round(avgQuality),
    avgWords: Math.round(avgWords),
    avgRelevance: Number(avgRelevance.toFixed(2)),
    evidenceRate: Number(evidenceRate.toFixed(2)),
    vagueRate: Number(vagueRate.toFixed(2)),
    timePerQuestion: Math.round(timePerQuestion),
    answeredCount,
    assessments,
  };
};

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

    const currentQuestion = interview.currentQuestion || interview.questions[interview.questions.length - 1] || "";
    const relevanceValidation = validateAnswerRelevance(currentQuestion, answer);

    if (!relevanceValidation.isValid) {
      return res.status(400).json({
        error: relevanceValidation.message,
      });
    }

    interview.answers.push(answer);

    // Check if interview should end based on max questions
    if (interview.questions.length >= interview.maxQuestions) {
      console.log(`✅ Interview Complete - Reached maximum of ${interview.maxQuestions} questions`);
      interview.status = "completed";
      interview.completedAt = new Date();

      // Calculate duration
      interview.duration = Math.round((interview.completedAt - interview.startedAt) / 1000);

      // Generate a response-driven score based on relevance, depth and specificity.
      const analysis = evaluateInterviewResponses(
        interview.questions,
        interview.answers,
        interview.duration
      );

      interview.performanceScore = analysis.finalScore;

      interview.feedback = generateFeedback(analysis);

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
const generateFeedback = (analysis) => {
  const {
    finalScore,
    avgWords,
    avgRelevance,
    evidenceRate,
    vagueRate,
    timePerQuestion,
  } = analysis;

  let feedback = "";

  if (finalScore >= 80) {
    feedback = "🌟 Excellent performance! Your responses were relevant, structured, and impactful.";
  } else if (finalScore >= 70) {
    feedback = "👍 Good performance! Your answers were mostly relevant with clear reasoning.";
  } else if (finalScore >= 60) {
    feedback = "🤔 Average performance. Improve relevance and include stronger examples in each answer.";
  } else {
    feedback = "💡 Keep practicing! Focus on directly answering the question with concrete outcomes.";
  }

  if (avgRelevance < 0.25) {
    feedback += " Many responses were weakly aligned with the asked question.";
  } else if (avgRelevance >= 0.45) {
    feedback += " Strong question-to-answer alignment throughout the interview.";
  }

  if (avgWords < 40) {
    feedback += " Add more depth with examples and implementation details.";
  } else if (avgWords > 180) {
    feedback += " Great depth, but keep answers concise and focused.";
  }

  if (evidenceRate < 0.3) {
    feedback += " Include measurable outcomes (percentages, time saved, impact metrics).";
  } else if (evidenceRate >= 0.6) {
    feedback += " Excellent use of measurable evidence in your responses.";
  }

  if (vagueRate > 0.3) {
    feedback += " Avoid uncertain phrasing and provide confident, concrete explanations.";
  }

  if (timePerQuestion < 30) {
    feedback += " Pacing was very fast; spend more time structuring your responses.";
  } else if (timePerQuestion > 600) {
    feedback += " Pacing was slow; aim for concise, high-impact answers.";
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
        const responseAnalysis = evaluateInterviewResponses(
          interview.questions,
          interview.answers,
          interview.duration
        );

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
            timePerQuestion: totalQuestions > 0 ? Math.round(interview.duration / totalQuestions) : 0,
            responseQualityScore: responseAnalysis.avgQuality,
            relevanceScore: Math.round(responseAnalysis.avgRelevance * 100),
            evidenceUsageScore: Math.round(responseAnalysis.evidenceRate * 100),
            clarityRiskScore: Math.round(responseAnalysis.vagueRate * 100),
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
