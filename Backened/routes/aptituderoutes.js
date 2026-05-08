const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash-latest",
  "gemini-pro",
].filter(Boolean);

const isModelNotFoundError = (err) => {
  const msg = (err?.message || "").toLowerCase();
  return msg.includes("not found") || msg.includes("is not found") || msg.includes("not supported");
};

const isRateLimitError = (err) => {
  const msg = (err?.message || "").toLowerCase();
  return msg.includes("quota") || msg.includes("too many requests") || msg.includes("rate limit") || msg.includes("429");
};

const generateWithFallback = async (prompt) => {
  let lastError;
  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`🔄 [Aptitude] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (!text) throw new Error("Empty response");
      console.log(`✅ [Aptitude] Success with model: ${modelName}`);
      return text;
    } catch (err) {
      lastError = err;
      if (isModelNotFoundError(err)) {
        console.warn(`⚠️ Model ${modelName} not available, trying next...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error("No compatible Gemini model available");
};

const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`AI timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

// ===== FALLBACK QUESTION BANK =====
const FALLBACK_QUESTIONS = {
  "Percentage": [
    { id: 1, topic: "Percentage", question: "If a number is increased by 20% and then decreased by 20%, what is the net change?", options: { A: "No change", B: "4% decrease", C: "4% increase", D: "2% decrease" }, answer: "B", explanation: "Let number = 100. After 20% increase → 120. After 20% decrease → 96. Net change = 4% decrease." },
    { id: 2, topic: "Percentage", question: "What is 15% of 240?", options: { A: "34", B: "36", C: "38", D: "32" }, answer: "B", explanation: "15/100 × 240 = 36." },
    { id: 3, topic: "Percentage", question: "A student scored 450 out of 600. What percentage did they score?", options: { A: "70%", B: "72%", C: "75%", D: "78%" }, answer: "C", explanation: "450/600 × 100 = 75%." },
    { id: 4, topic: "Percentage", question: "If 30% of a number is 90, what is 50% of that number?", options: { A: "140", B: "150", C: "160", D: "145" }, answer: "B", explanation: "30% = 90, so number = 300. 50% of 300 = 150." },
    { id: 5, topic: "Percentage", question: "A price increases from ₹200 to ₹250. What is the percentage increase?", options: { A: "20%", B: "22%", C: "25%", D: "28%" }, answer: "C", explanation: "(250-200)/200 × 100 = 25%." },
  ],
  "Speed Distance Time": [
    { id: 1, topic: "Speed Distance Time", question: "A train travels 360 km in 4 hours. What is its speed in km/h?", options: { A: "80", B: "85", C: "90", D: "95" }, answer: "C", explanation: "Speed = Distance/Time = 360/4 = 90 km/h." },
    { id: 2, topic: "Speed Distance Time", question: "A car covers 150 km at 50 km/h. How long does it take?", options: { A: "2 hours", B: "2.5 hours", C: "3 hours", D: "3.5 hours" }, answer: "C", explanation: "Time = Distance/Speed = 150/50 = 3 hours." },
    { id: 3, topic: "Speed Distance Time", question: "If a person walks at 6 km/h for 2.5 hours, how far does he walk?", options: { A: "12 km", B: "14 km", C: "15 km", D: "16 km" }, answer: "C", explanation: "Distance = Speed × Time = 6 × 2.5 = 15 km." },
    { id: 4, topic: "Speed Distance Time", question: "Two trains start simultaneously from stations 200 km apart, moving toward each other at 60 km/h and 40 km/h. When do they meet?", options: { A: "1.5 hours", B: "2 hours", C: "2.5 hours", D: "3 hours" }, answer: "B", explanation: "Combined speed = 100 km/h. Time = 200/100 = 2 hours." },
    { id: 5, topic: "Speed Distance Time", question: "A cyclist covers 40 km at 20 km/h and returns at 10 km/h. What is the average speed?", options: { A: "12.5 km/h", B: "13.3 km/h", C: "14 km/h", D: "15 km/h" }, answer: "B", explanation: "Average speed = 2×20×10/(20+10) = 400/30 ≈ 13.3 km/h." },
  ],
  "Time & Work": [
    { id: 1, topic: "Time & Work", question: "A can complete a work in 10 days and B in 15 days. How many days do they take together?", options: { A: "4", B: "5", C: "6", D: "8" }, answer: "C", explanation: "Combined rate = 1/10 + 1/15 = 1/6. So they take 6 days." },
    { id: 2, topic: "Time & Work", question: "If 6 workers can build a wall in 12 days, how long will 9 workers take?", options: { A: "6 days", B: "7 days", C: "8 days", D: "9 days" }, answer: "C", explanation: "6×12 = 9×d → d = 72/9 = 8 days." },
    { id: 3, topic: "Time & Work", question: "A alone takes 20 days; A and B together take 12 days. How many days does B alone take?", options: { A: "28 days", B: "30 days", C: "32 days", D: "35 days" }, answer: "B", explanation: "B's rate = 1/12 - 1/20 = 1/30. So B takes 30 days." },
    { id: 4, topic: "Time & Work", question: "P can do a work in 8 days; Q can do it in 12 days. If they work alternately starting with P, in how many days is the work done?", options: { A: "9 days", B: "9.5 days", C: "10 days", D: "9.67 days" }, answer: "D", explanation: "In 2 days: 1/8+1/12=5/24. In 4 pairs (8 days): 20/24. Remaining 4/24=1/6, P takes 1/6÷1/8 = 4/3 days. Total ≈ 9.67 days." },
    { id: 5, topic: "Time & Work", question: "X is twice as efficient as Y. If Y takes 18 days, how many days do X and Y together take?", options: { A: "5 days", B: "6 days", C: "7 days", D: "8 days" }, answer: "B", explanation: "X takes 9 days. Together: 1/9+1/18 = 3/18 = 1/6 → 6 days." },
  ],
  "Number Series": [
    { id: 1, topic: "Number Series", question: "Find the missing number: 2, 6, 12, 20, 30, ?", options: { A: "40", B: "42", C: "44", D: "46" }, answer: "B", explanation: "Differences: 4,6,8,10,12. Next: 30+12=42." },
    { id: 2, topic: "Number Series", question: "What is the next number: 1, 4, 9, 16, 25, ?", options: { A: "36", B: "30", C: "32", D: "34" }, answer: "A", explanation: "Perfect squares: 1²,2²,3²,4²,5²,6²=36." },
    { id: 3, topic: "Number Series", question: "Find next: 3, 6, 11, 18, 27, ?", options: { A: "36", B: "38", C: "38", D: "40" }, answer: "B", explanation: "Differences: 3,5,7,9,11. Next: 27+11=38." },
    { id: 4, topic: "Number Series", question: "Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64", options: { A: "50", B: "26", C: "64", D: "37" }, answer: "C", explanation: "Pattern: n²+1 → 1,4,9,16,25,36,49,64. But 64=8²+0 not 8²+1. Should be 65." },
    { id: 5, topic: "Number Series", question: "Next in series: 1, 1, 2, 3, 5, 8, ?", options: { A: "11", B: "12", C: "13", D: "14" }, answer: "C", explanation: "Fibonacci: each term = sum of previous two. 5+8=13." },
  ],
  "Profit & Loss": [
    { id: 1, topic: "Profit & Loss", question: "An item is bought for ₹500 and sold for ₹625. What is the profit percentage?", options: { A: "20%", B: "22%", C: "25%", D: "28%" }, answer: "C", explanation: "Profit = 125. Profit% = 125/500×100 = 25%." },
    { id: 2, topic: "Profit & Loss", question: "If selling price is ₹800 and loss is 20%, what is the cost price?", options: { A: "₹900", B: "₹960", C: "₹1000", D: "₹1050" }, answer: "C", explanation: "SP = CP×(1-20/100) → 800 = CP×0.8 → CP = 1000." },
    { id: 3, topic: "Profit & Loss", question: "A shopkeeper marks goods 40% above cost and gives 20% discount. What is the profit%?", options: { A: "10%", B: "12%", C: "14%", D: "16%" }, answer: "B", explanation: "Let CP=100. MP=140. SP=140×0.8=112. Profit=12%." },
    { id: 4, topic: "Profit & Loss", question: "By selling 45 articles for ₹40, a person loses 10%. To gain 35%, how many articles should be sold for ₹56?", options: { A: "27", B: "28", C: "30", D: "32" }, answer: "A", explanation: "CP of 45 = 40/0.9 = 44.44. SP for 35% gain = 44.44×1.35=60. For ₹56... 56/60×45 ≈ 27 articles." },
    { id: 5, topic: "Profit & Loss", question: "Two items sold at ₹990 each — one at 10% profit, one at 10% loss. Net result?", options: { A: "1% loss", B: "1% gain", C: "No loss no profit", D: "2% loss" }, answer: "A", explanation: "When sold at same price but one at gain% and one at loss% equal, there's always a loss of (x²/100)% = 100/100 = 1% loss." },
  ],
  "Ratio & Proportion": [
    { id: 1, topic: "Ratio & Proportion", question: "If A:B = 3:4 and B:C = 5:6, what is A:B:C?", options: { A: "15:20:24", B: "12:16:20", C: "9:12:15", D: "18:24:30" }, answer: "A", explanation: "B is common. A:B=3:4=15:20, B:C=5:6=20:24. So A:B:C=15:20:24." },
    { id: 2, topic: "Ratio & Proportion", question: "₹4800 is divided among A, B, C in ratio 3:4:5. How much does B get?", options: { A: "₹1400", B: "₹1500", C: "₹1600", D: "₹1800" }, answer: "C", explanation: "Total parts=12. B's share = 4/12×4800 = ₹1600." },
    { id: 3, topic: "Ratio & Proportion", question: "If 12 men can complete work in 15 days, how many men needed to finish in 9 days?", options: { A: "18", B: "20", C: "22", D: "24" }, answer: "B", explanation: "12×15 = N×9 → N = 180/9 = 20 men." },
    { id: 4, topic: "Ratio & Proportion", question: "The ratio of milk to water in a 60-litre mixture is 2:1. How much water should be added to make ratio 1:2?", options: { A: "55 litres", B: "60 litres", C: "65 litres", D: "70 litres" }, answer: "B", explanation: "Milk=40L, Water=20L. For 1:2, Water=80L. Add 60L water." },
    { id: 5, topic: "Ratio & Proportion", question: "A:B = 2:3, B:C = 4:5. Find A:C.", options: { A: "7:15", B: "8:15", C: "6:15", D: "5:15" }, answer: "B", explanation: "A:B=2:3=8:12, B:C=4:5=12:15. So A:C=8:15." },
  ],
  "Average": [
    { id: 1, topic: "Average", question: "What is the average of first 50 natural numbers?", options: { A: "25", B: "25.5", C: "26", D: "26.5" }, answer: "B", explanation: "Average = (n+1)/2 = 51/2 = 25.5." },
    { id: 2, topic: "Average", question: "Average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?", options: { A: "24", B: "26", C: "28", D: "30" }, answer: "C", explanation: "Sum of 5 = 100. Sum of 4 = 72. Excluded = 100 - 72 = 28." },
    { id: 3, topic: "Average", question: "The average age of 30 students is 15 years. If teacher's age is added, average increases by 1. Teacher's age?", options: { A: "45", B: "46", C: "47", D: "48" }, answer: "B", explanation: "New sum = 31 * 16 = 496. Old sum = 30 * 15 = 450. Age = 46." },
    { id: 4, topic: "Average", question: "What is the average of even numbers between 1 and 20?", options: { A: "10", B: "11", C: "12", D: "9" }, answer: "B", explanation: "Even numbers: 2, 4, ..., 20. Sum = 110. Count = 10. Avg = 11." },
    { id: 5, topic: "Average", question: "The average of 7 consecutive numbers is 20. What is the largest number?", options: { A: "22", B: "23", C: "24", D: "25" }, answer: "B", explanation: "Middle number is 20. Numbers are 17, 18, 19, 20, 21, 22, 23." },
  ],
};

const getFallbackQuestions = (topics, count = 15) => {
  const allQ = [];
  const perTopic = Math.ceil(count / topics.length);

  topics.forEach((topic) => {
    const bank = FALLBACK_QUESTIONS[topic] || [];
    // Repeat if not enough questions
    let pool = [];
    while (pool.length < perTopic) pool = [...pool, ...bank];
    allQ.push(...pool.slice(0, perTopic));
  });

  // Shuffle and assign sequential IDs
  return allQ
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((q, i) => ({ ...q, id: i + 1 }));
};

// POST /api/aptitude/generate
router.post("/generate", async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: "Topics array is required" });
  }

  const topicsStr = topics.join(", ");

  const prompt = `Generate exactly 15 aptitude MCQ questions for these topics: ${topicsStr}.
Mix topics evenly. Return ONLY valid JSON, no markdown, no code fences, no text before or after.

{"questions":[{"id":1,"topic":"TopicName","question":"Question?","options":{"A":"opt","B":"opt","C":"opt","D":"opt"},"answer":"A","explanation":"why A is correct"}]}

Rules: answer must be A/B/C/D only. Make questions clear and realistic.`;

  try {
    // 12 second timeout — if AI is rate-limited/hanging, use fallback
    const rawText = await withTimeout(generateWithFallback(prompt), 12000);
    const jsonStr = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(jsonStr);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response structure");
    }

    console.log(`✅ [Aptitude] AI generated ${parsed.questions.length} questions for: ${topicsStr}`);
    return res.json({ questions: parsed.questions, source: "ai" });

  } catch (err) {
    console.error("❌ [Aptitude] AI failed:", err.message);

    if (isRateLimitError(err)) {
      console.warn("⚠️ [Aptitude] Rate limited — using fallback question bank");
      const fallbackQ = getFallbackQuestions(topics, 15);
      return res.json({ questions: fallbackQ, source: "fallback" });
    }

    // For any other error also use fallback
    console.warn("⚠️ [Aptitude] Error — using fallback question bank");
    const fallbackQ = getFallbackQuestions(topics, 15);
    return res.json({ questions: fallbackQ, source: "fallback" });
  }
});

module.exports = router;
