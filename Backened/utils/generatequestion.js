const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validate API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is not set in environment variables!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const staticModelCandidates = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash-latest",
].filter(Boolean);

let cachedDiscoveredModels = null;

const normalizeModelName = (name = "") => name.replace(/^models\//, "").trim();

const discoverGenerateContentModels = async () => {
  if (cachedDiscoveredModels) return cachedDiscoveredModels;

  if (typeof genAI.listModels !== "function") {
    cachedDiscoveredModels = [];
    return cachedDiscoveredModels;
  }

  try {
    const listResult = await genAI.listModels();
    const rawModels = Array.isArray(listResult)
      ? listResult
      : Array.isArray(listResult?.models)
        ? listResult.models
        : [];

    const discovered = rawModels
      .filter((model) => {
        const methods = model?.supportedGenerationMethods || [];
        return methods.includes("generateContent");
      })
      .map((model) => normalizeModelName(model?.name || ""))
      .filter(Boolean);

    cachedDiscoveredModels = [...new Set(discovered)];
    return cachedDiscoveredModels;
  } catch (error) {
    console.warn("⚠️ Unable to list Gemini models, using static fallback list.");
    cachedDiscoveredModels = [];
    return cachedDiscoveredModels;
  }
};

const getModelCandidates = async () => {
  const discovered = await discoverGenerateContentModels();
  return [...new Set([...discovered, ...staticModelCandidates].map(normalizeModelName).filter(Boolean))];
};

const isModelNotFoundError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return message.includes("not found") || message.includes("is not found") || message.includes("not supported");
};

const isQuotaOrRateLimitError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return (
    error?.status === 429 ||
    message.includes("quota") ||
    message.includes("too many requests") ||
    message.includes("rate limit")
  );
};

const isTransientProviderError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return (
    isQuotaOrRateLimitError(error) ||
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("unavailable")
  );
};

const extractResumeFocus = (resumeText) => {
  const skillKeywords = [
    "react",
    "node",
    "express",
    "mongodb",
    "javascript",
    "typescript",
    "python",
    "java",
    "sql",
    "aws",
    "docker",
    "rest",
    "api",
  ];

  const lowerResume = (resumeText || "").toLowerCase();
  const matched = skillKeywords.find((keyword) => lowerResume.includes(keyword));
  return matched ? matched.toUpperCase() : "a recent project";
};

const getLocalFallbackQuestion = (resumeText, questions = [], lastAnswer) => {
  const focusArea = extractResumeFocus(resumeText);
  const previouslyAsked = new Set((questions || []).map((q) => (q || "").trim().toLowerCase()));

  const fallbackCandidates = lastAnswer
    ? [
        `Can you explain one technical trade-off you made in ${focusArea} and why you chose that approach?`,
        "What would you improve in the solution you just described if you had one more week?",
        "How did you measure the impact of that decision on performance, reliability, or user experience?",
      ]
    : [
        `Tell me about your strongest ${focusArea} project and the exact problem you solved.`,
        "Describe a challenging bug you fixed recently and your step-by-step debugging process.",
        "Walk me through a feature you built end-to-end and the technologies you used.",
      ];

  const selected = fallbackCandidates.find((candidate) => !previouslyAsked.has(candidate.toLowerCase()));
  return selected || "Can you describe a recent project, your role, and one measurable impact you delivered?";
};

// ✅ Helper function to get language instruction for Gemini
const getLanguageInstruction = (language = "english") => {
  const languageMap = {
    english: "Language: Answer in English.",
    hindi: "भाषा: हिंदी में जवाब दें।",
  };

  return languageMap[language] || languageMap["english"];
};

const generateWithFallbackModels = async (prompt) => {
  let lastError;
  const modelCandidates = await getModelCandidates();

  for (const modelName of modelCandidates) {
    try {
      console.log(`🔄 Calling Gemini API with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const question = response.text().trim();

      if (!question) {
        throw new Error("Gemini returned an empty response");
      }

      return question;
    } catch (error) {
      lastError = error;
      if (!isModelNotFoundError(error)) {
        throw error;
      }
      console.warn(`⚠️ Model ${modelName} unavailable, trying next model...`);
    }
  }

  throw (
    lastError ||
    new Error(
      "No compatible Gemini model available for generateContent. Set GEMINI_MODEL in .env to a model available for your API key."
    )
  );
};

async function generateQuestion(resumeText, questions, lastAnswer, language = "english") {
  try {
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("Resume text is empty");
    }

    // Map language to proper instruction
    const languageInstruction = getLanguageInstruction(language);

    const prompt = `
You are a professional technical interviewer.

Resume:
${resumeText}

Previous Questions:
${questions.join("\n") || "None"}

Last Answer:
${lastAnswer || "None"}

${languageInstruction}

Rules:
- Generate ONLY ONE interview question.
- ONE LINE only.
- No numbering.
- No explanation.
- Do NOT repeat previous questions.
- Question must be based on resume.
- If answer exists, go deeper based on it.

Generate next question:
`;

    const question = await generateWithFallbackModels(prompt);
    console.log("✅ Question generated successfully from Gemini API");
    return {
      question,
      isFromGemini: true,
      usingFallback: false
    };
  } catch (error) {
    console.error("❌ Question Generation Error:", error.message);

    if (isTransientProviderError(error)) {
      const fallbackQuestion = getLocalFallbackQuestion(resumeText, questions, lastAnswer);
      console.warn("⚠️ Gemini unavailable/quota-limited. Using local fallback question. (Max 6 questions)");
      return {
        question: fallbackQuestion,
        isFromGemini: false,
        usingFallback: true
      };
    }
    
    // Provide specific error messages for different failure scenarios
    if (error.message.includes("API_KEY")) {
      console.warn("⚠️ Gemini API Key is invalid. Using local fallback question. (Max 6 questions)");
      const fallbackQuestion = getLocalFallbackQuestion(resumeText, questions, lastAnswer);
      return {
        question: fallbackQuestion,
        isFromGemini: false,
        usingFallback: true
      };
    } else if (error.message.includes("rate limit")) {
      console.warn("⚠️ Gemini API rate limit exceeded. Using local fallback question. (Max 6 questions)");
      const fallbackQuestion = getLocalFallbackQuestion(resumeText, questions, lastAnswer);
      return {
        question: fallbackQuestion,
        isFromGemini: false,
        usingFallback: true
      };
    } else if (error.message.includes("network")) {
      console.warn("⚠️ Network error connecting to Gemini API. Using local fallback question. (Max 6 questions)");
      const fallbackQuestion = getLocalFallbackQuestion(resumeText, questions, lastAnswer);
      return {
        question: fallbackQuestion,
        isFromGemini: false,
        usingFallback: true
      };
    } else {
      throw error;
    }
  }
}

module.exports = generateQuestion;
