import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Brain, Languages, BarChart3, 
  Clock, ChevronRight, CheckCircle2, AlertCircle, 
  ArrowLeft, RotateCcw, Award 
} from 'lucide-react';
import SecurityWrapper from '../SecurityWrapper';

// --- MOCK DATA GENERATOR ---
const TOPICS = {
  quant: {
    title: "Quantitative Aptitude",
    icon: <Calculator className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
    subtopics: ["Arithmetic", "Time & Work", "Number System", "Algebra & Geometry", "Permutation & Combination"]
  },
  logical: {
    title: "Logical Reasoning",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
    subtopics: ["Series & Sequences", "Relationships", "Seating Arrangement", "Syllogism", "Directions", "Data Sufficiency"]
  },
  verbal: {
    title: "Verbal Ability",
    icon: <Languages className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600",
    subtopics: ["Reading Comprehension", "Grammar", "Vocabulary"]
  },
  di: {
    title: "Data Interpretation",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
    subtopics: ["Bar Graphs", "Pie Charts", "Line Graphs", "Tables"]
  }
};

// Simple question generator logic
const generateQuestions = (topic) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Sample question about ${topic} #${i + 1}: What is the logical conclusion or calculation based on the standard rules of this module?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: Math.floor(Math.random() * 4)
  }));
};

const AptitudeRound = () => {
  const [view, setView] = useState('categories'); // categories, subtopics, quiz, results
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Timer logic
  useEffect(() => {
    let timer;
    if (view === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setView('results');
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const startQuiz = (subtopic) => {
    setActiveSubtopic(subtopic);
    setQuestions(generateQuestions(subtopic));
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(600);
    setView('quiz');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    return score;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden relative">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Global Navbar / Logo */}
      <nav className="w-full px-6 py-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="InterviewAce Logo" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", transition: "all 0.3s ease" }} 
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
            InterviewAce
          </span>
        </div>
      </nav>

      {/* Main Content Area - Centered and fills remaining height */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center px-4 md:px-8 py-6 z-10">
        
        {view === 'categories' && (
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight drop-shadow-sm">Aptitude Module</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Test your reasoning and problem-solving skills with our expertly curated assessments.</p>
          </div>
        )}

        <div className="w-full flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* CATEGORY GRID */}
            {view === 'categories' && (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full"
              >
                {Object.entries(TOPICS).map(([key, data]) => (
                  <button 
                    key={key}
                    onClick={() => { setActiveCategory(key); setView('subtopics'); }}
                    className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 text-left flex flex-col items-start gap-6 group relative overflow-hidden h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`p-4 rounded-2xl shadow-sm ${data.color} relative z-10`}>{data.icon}</div>
                    <div className="relative z-10 flex-1">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors mb-2 leading-tight">{data.title}</h3>
                      <p className="text-sm font-medium text-slate-400">{data.subtopics.length} Interactive Modules</p>
                    </div>
                    <div className="relative z-10 mt-auto w-full flex justify-end">
                      <div className="bg-slate-50 group-hover:bg-indigo-50 p-2 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* SUBTOPIC SELECTION */}
            {view === 'subtopics' && (
              <motion.div 
                key="subtopics"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 shadow-2xl max-w-4xl w-full mx-auto"
              >
                <button onClick={() => setView('categories')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors bg-slate-50 hover:bg-indigo-50 py-2 px-4 rounded-full w-fit">
                  <ArrowLeft size={18} /> Back to Modules
                </button>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-800 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${TOPICS[activeCategory].color}`}>
                    {TOPICS[activeCategory].icon}
                  </div>
                  {TOPICS[activeCategory].title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {TOPICS[activeCategory].subtopics.map((sub, i) => (
                    <button 
                      key={i}
                      onClick={() => startQuiz(sub)}
                      className="flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="font-semibold text-lg text-slate-700 group-hover:text-indigo-800">{sub}</span>
                      <div className="bg-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                        <ChevronRight size={18} className="text-indigo-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* QUIZ INTERFACE */}
            {view === 'quiz' && (
              <SecurityWrapper>
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl w-full mx-auto"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">
                        Question {currentIdx + 1} <span className="text-slate-400 font-medium">/ 10</span>
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 font-mono font-bold text-xl bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100 ${timeLeft < 60 ? 'text-red-500 border-red-200 animate-pulse' : 'text-slate-700'}`}>
                      <Clock size={22} className={timeLeft < 60 ? 'text-red-500' : 'text-indigo-500'} /> 
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.05)]">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full mb-10 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
                      ></div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-10 text-slate-800 leading-tight">
                      {questions[currentIdx].question}
                    </h3>

                    <div className="space-y-4">
                      {questions[currentIdx].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswers({...answers, [currentIdx]: i})}
                          className={`w-full p-5 md:p-6 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group
                            ${answers[currentIdx] === i 
                              ? 'border-indigo-500 bg-indigo-50/50 text-indigo-800 shadow-md transform scale-[1.01]' 
                              : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${answers[currentIdx] === i ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                              {['A', 'B', 'C', 'D'][i]}
                            </span>
                            <span className="font-medium text-lg">{opt}</span>
                          </div>
                          {answers[currentIdx] === i && (
                            <motion.div initial={{scale:0}} animate={{scale:1}}>
                              <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
                      <button 
                        disabled={currentIdx === 0}
                        onClick={() => setCurrentIdx(prev => prev - 1)}
                        className="px-6 py-3 text-slate-500 font-semibold disabled:opacity-30 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft size={18} /> Previous
                      </button>
                      {currentIdx === 9 ? (
                        <button 
                          onClick={() => setView('results')}
                          className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                          Submit Test
                        </button>
                      ) : (
                        <button 
                          onClick={() => setCurrentIdx(prev => prev + 1)}
                          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          Next <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </SecurityWrapper>
            )}

            {/* RESULTS VIEW */}
            {view === 'results' && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.90, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] text-center relative overflow-hidden"
              >
                {/* Result Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-50 to-transparent"></div>

                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200 rotate-3 hover:rotate-0 transition-transform">
                  <Award size={48} />
                </div>
                
                <h2 className="relative z-10 text-4xl md:text-5xl font-extrabold mb-3 text-slate-800 tracking-tight">Test Completed!</h2>
                <p className="relative z-10 text-lg text-slate-500 mb-10">You've successfully finished the <span className="font-semibold text-slate-700">{activeSubtopic}</span> module.</p>
                
                <div className="relative z-10 grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl transform hover:-translate-y-1 transition-transform">
                    <p className="text-sm text-slate-400 uppercase font-extrabold tracking-widest mb-2">Final Score</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <p className="text-5xl font-black text-indigo-600">{calculateScore()}</p>
                      <p className="text-2xl font-bold text-slate-300">/10</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl transform hover:-translate-y-1 transition-transform">
                    <p className="text-sm text-slate-400 uppercase font-extrabold tracking-widest mb-2">Time Spent</p>
                    <p className="text-4xl font-black text-slate-700">{formatTime(600 - timeLeft)}</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => startQuiz(activeSubtopic)}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} /> Retake Module
                  </button>
                  <button 
                    onClick={() => setView('categories')}
                    className="flex-1 py-4 px-6 bg-white text-slate-600 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Back to Topics
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AptitudeRound;
