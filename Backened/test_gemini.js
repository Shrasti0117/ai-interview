require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-pro'];
const prompt = 'Generate 2 aptitude MCQ for Percentage. Return ONLY JSON: {"questions":[{"id":1,"topic":"Percentage","question":"Q?","options":{"A":"a","B":"b","C":"c","D":"d"},"answer":"A","explanation":"e"}]}';

async function run() {
  for (const m of MODELS) {
    try {
      console.log('Trying:', m);
      const model = genAI.getGenerativeModel({ model: m });
      const r = await model.generateContent(prompt);
      const text = r.response.text();
      console.log('SUCCESS with', m);
      console.log(text.substring(0, 300));
      return;
    } catch(e) {
      console.log('FAILED', m, ':', e.message.substring(0, 150));
    }
  }
  console.log('All models failed.');
}

run();
