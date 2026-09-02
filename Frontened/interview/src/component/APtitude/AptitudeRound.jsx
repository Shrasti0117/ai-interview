import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SecurityWrapper from "../SecurityWrapper";

// ────────────────────────────────────────────────────────────────────
// DATA: TOPICS CATEGORIES (Same as before)
// ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    title: "Quantitative Aptitude (Maths)",
    items: [
      { id: "percentage", icon: "📊", title: "Percentage", desc: "Percentage calculations, increase/decrease, and real applications", difficulty: "Easy" },
      { id: "profitloss", icon: "💰", title: "Profit & Loss", desc: "Business mathematics and profit/loss calculations", difficulty: "Medium" },
      { id: "interest", icon: "🏦", title: "Simple & Compound Interest", desc: "Interest rate calculations, time and principal problems", difficulty: "Medium" },
      { id: "ratio", icon: "⚖️", title: "Ratio & Proportion", desc: "Ratio, proportion, and comparison problems", difficulty: "Easy" },
      { id: "average", icon: "📈", title: "Average", desc: "Mean, weighted average and related problems", difficulty: "Easy" },
      { id: "timework", icon: "⏱️", title: "Time & Work", desc: "Work efficiency, pipes & cisterns problems", difficulty: "Medium" },
      { id: "speeddist", icon: "⚡", title: "Speed Distance Time", desc: "Speed, time, distance — trains, boats, and relative motion", difficulty: "Medium" },
      { id: "hcflcm", icon: "🔢", title: "HCF & LCM", desc: "HCF/LCM, divisibility rules, and remainder theorem", difficulty: "Medium" },
      { id: "numbersys", icon: "🔣", title: "Number System", desc: "Integers, divisibility, remainders, and number properties", difficulty: "Hard" },
      { id: "algebra", icon: "📐", title: "Algebra & Equations", desc: "Basic equations, linear and quadratic expressions", difficulty: "Medium" },
      { id: "mensuration", icon: "📏", title: "Mensuration", desc: "Area and volume of 2D and 3D geometric shapes", difficulty: "Medium" },
      { id: "probability", icon: "🎲", title: "Probability", desc: "Basic probability, events, outcomes and combinations", difficulty: "Hard" },
      { id: "permcomb", icon: "🔀", title: "Permutation & Combination", desc: "Selection and arrangement fundamentals", difficulty: "Hard" }
    ]
  },
  {
    title: "Logical Reasoning",
    items: [
      { id: "numseries", icon: "🔢", title: "Number Series", desc: "Pattern recognition and number sequence completion", difficulty: "Hard" },
      { id: "alphaseries", icon: "🔤", title: "Alphabet Series", desc: "Alphabet and letter pattern completion", difficulty: "Medium" },
      { id: "bloodrel", icon: "👨👩👧", title: "Blood Relations", desc: "Family relationships and relative identification", difficulty: "Medium" },
      { id: "coding", icon: "🔐", title: "Coding-Decoding", desc: "Letter and number encoding/decoding logic", difficulty: "Medium" },
      { id: "seating", icon: "💺", title: "Seating Arrangement", desc: "Circular and linear seating puzzles", difficulty: "Hard" },
      { id: "syllogism", icon: "💭", title: "Syllogism", desc: "Statements and conclusions logical problems", difficulty: "Medium" },
      { id: "direction", icon: "🧭", title: "Directions & Distances", desc: "North-East-West-South movement logic problems", difficulty: "Easy" },
      { id: "datasuff", icon: "📁", title: "Data Sufficiency", desc: "Check if given information is sufficient to answer", difficulty: "Hard" }
    ]
  },
  {
    title: "Verbal Ability (English)",
    items: [
      { id: "reading", icon: "📖", title: "Reading Comprehension", desc: "Read passages and answer interpretation questions", difficulty: "Medium" },
      { id: "grammar", icon: "✏️", title: "Grammar & Error Spotting", desc: "Error spotting, sentence improvement, fill in blanks", difficulty: "Easy" },
      { id: "vocab", icon: "📚", title: "Vocabulary", desc: "Synonyms, antonyms, idioms and phrases", difficulty: "Easy" }
    ]
  },
  {
    title: "Data Interpretation (DI)",
    items: [
      { id: "bargraph", icon: "📊", title: "Bar Graph DI", desc: "Extract and calculate data from bar charts", difficulty: "Medium" },
      { id: "piechart", icon: "🟠", title: "Pie Chart DI", desc: "Percentage-based data interpretation from pie charts", difficulty: "Medium" },
      { id: "linegraph", icon: "📉", title: "Line Graph DI", desc: "Trend analysis and comparison from line graphs", difficulty: "Medium" },
      { id: "tabledata", icon: "📋", title: "Table Data DI", desc: "Row and column based table data interpretation", difficulty: "Easy" }
    ]
  }
];

// ────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────
export default function AptitudeRound() {

  // Navigation & Flow State
  const [screen, setScreen] = useState("home"); // home, quiz, result
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  
  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Responsive Grid Logic
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridCols = windowWidth < 768 ? '1' : windowWidth < 1024 ? '2' : '3';

  // Stats Logic
  const stats = useMemo(() => {
    const count = selectedTopics.size;
    return {
      topics: count,
      questions: count * 10,
      time: count * 12
    };
  }, [selectedTopics]);

  // Actions
  const toggleTopic = (id) => {
    const next = new Set(selectedTopics);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTopics(next);
  };

  const handleStartQuiz = async () => {
    if (selectedTopics.size === 0) return;
    setScreen("quiz");
    setLoading(true);
    setLoadingText("Initializing connection...");
    
    try {
      const topicNames = [];
      CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (selectedTopics.has(item.id)) topicNames.push(item.title);
        });
      });

      setLoadingText("Generating questions with AI...");
      const res = await axios.post("http://localhost:5001/api/aptitude/generate", {
        topics: topicNames,
      });

      const fetchedQs = res.data.questions || [];
      if (fetchedQs.length === 0) throw new Error("No questions returned.");

      const normalizedQs = fetchedQs.map(q => {
        const optKeys = ["A", "B", "C", "D"];
        const optsArray = optKeys.map(k => `${k}) ${q.options[k]}`);
        const ansIndex = optKeys.indexOf(q.answer);
        return {
          q: q.question,
          opts: optsArray,
          ans: ansIndex >= 0 ? ansIndex : 0,
          exp: q.explanation,
          topic: q.topic || "General"
        };
      });

      setQuestions(normalizedQs);
      setLoading(false);
      setTimerActive(true);
      setSeconds(0);
      setCurrentQ(0);
      setUserAnswers({});
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions. Check backend/API key.");
      setScreen("home");
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ────────────────────────────────────────────────────────────────────
  // INTERNAL COMPONENT: TOPIC CARD (handles hover via state)
  // ────────────────────────────────────────────────────────────────────
  const TopicCard = ({ topic, isSelected, onClick }) => {
    const [hover, setHover] = useState(false);

    const baseStyle = {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
      padding: '20px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '180px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'relative',
      ...(isSelected ? { backgroundColor: '#eff6ff' } : {}),
      ...(hover && !isSelected ? { border: '1px solid #93c5fd', boxShadow: '0 4px 12px rgba(37,99,235,0.15)', transform: 'translateY(-2px)' } : {}),
      ...(hover && isSelected ? { transform: 'translateY(-2px)' } : {})
    };

    const checkboxStyle = {
      position: 'absolute',
      top: '14px',
      right: '14px',
      width: '20px',
      height: '20px',
      borderRadius: '5px',
      border: isSelected ? '2px solid #2563eb' : '2px solid #d1d5db',
      backgroundColor: isSelected ? '#2563eb' : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const badgeStyle = {
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      ...(topic.difficulty === 'Easy' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : 
         topic.difficulty === 'Medium' ? { backgroundColor: '#fef3c7', color: '#d97706' } : 
         { backgroundColor: '#fee2e2', color: '#dc2626' })
    };

    return (
      <div 
        style={baseStyle}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={checkboxStyle}>
          {isSelected && <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>✓</span>}
        </div>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{topic.icon}</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: '8px' }}>{topic.title}</div>
        <div style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5, flex: 1, marginBottom: '14px' }}>
          {topic.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>10 questions</span>
          <span style={badgeStyle}>{topic.difficulty}</span>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────
  // RENDERS
  // ────────────────────────────────────────────────────────────────────
  // --- RENDER HOME ---
  const [startHover, setStartHover] = useState(false);

  const renderHome = () => {
    const isStartEnabled = selectedTopics.size > 0;

    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", margin: 0, padding: 0 }}>
        {/* Content Area */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
          {/* Hero */}
          <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Select Test Topics</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Choose the topics you want to be tested on.<br/>
            Our AI will generate fresh questions just for you.
          </p>

          {/* Stats Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', marginBottom: '40px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '24px 16px', borderRight: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '6px' }}>{stats.topics}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Topics Selected</span>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '24px 16px', borderRight: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '6px' }}>{stats.questions}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Total Questions</span>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '24px 16px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '6px' }}>{stats.time}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Est. Time (min)</span>
            </div>
          </div>

          {/* Categories */}
          {CATEGORIES.map((cat, catIdx) => (
            <div key={catIdx}>
              <div style={{ borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '20px', marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0 }}>{cat.title}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '20px', marginBottom: '40px' }}>
                {cat.items.map(topic => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    isSelected={selectedTopics.has(topic.id)} 
                    onClick={() => toggleTopic(topic.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Start Test Button */}
          <button
            disabled={!isStartEnabled}
            onClick={handleStartQuiz}
            onMouseEnter={() => setStartHover(true)}
            onMouseLeave={() => setStartHover(false)}
            style={{
              display: 'block', 
              margin: '40px auto 60px',
              padding: '14px 48px', 
              borderRadius: '999px', 
              fontSize: '1rem',
              fontWeight: 600, 
              backgroundColor: isStartEnabled ? (startHover ? '#1d4ed8' : '#2563eb') : '#e5e7eb', 
              color: isStartEnabled ? 'white' : '#9ca3af',
              border: 'none', 
              cursor: isStartEnabled ? 'pointer' : 'not-allowed', 
              minWidth: '200px',
              transition: 'all 0.2s ease'
            }}
          >
            Start Test →
          </button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (loading || questions.length === 0) {
      return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ marginTop: '20px', fontWeight: 700 }}>{loadingText}</h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Please wait while we prepare your test</p>
        </div>
      );
    }

    const q = questions[currentQ];
    const total = questions.length;
    const answered = userAnswers[currentQ];
    const isAnswered = answered !== undefined;

    return (
      <SecurityWrapper>
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
          <div style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: 800, color: '#111827' }}>Aptitude Arena</span>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>{formatTimer(seconds)}</span>
          </div>
          <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{q.topic}</span>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Question {currentQ + 1} / {total}</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '32px' }}>{q.q}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {q.opts.map((opt, i) => {
                  const isCorrect = i === q.ans;
                  const isSelected = answered === i;
                  let bg = 'white';
                  let border = '1px solid #e5e7eb';
                  if (isAnswered) {
                    if (isCorrect) { bg = '#dcfce7'; border = '1px solid #16a34a'; }
                    else if (isSelected) { bg = '#fee2e2'; border = '1px solid #dc2626'; }
                  }
                  return (
                    <div 
                      key={i} 
                      onClick={() => !isAnswered && setUserAnswers({...userAnswers, [currentQ]: i})}
                      style={{ padding: '16px', borderRadius: '12px', border, backgroundColor: bg, cursor: isAnswered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{["A", "B", "C", "D"][i]}</div>
                      <div style={{ fontWeight: 500 }}>{opt.replace(/^[A-D]\)\s*/, "")}</div>
                    </div>
                  );
                })}
              </div>
              {isAnswered && (
                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                  <span style={{ fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>Explanation:</span>
                  <p style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>{q.exp}</p>
                </div>
              )}
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0} style={{ border: 'none', background: 'none', fontWeight: 700, color: currentQ === 0 ? '#d1d5db' : '#6b7280', cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}>← Previous</button>
                {currentQ === total - 1 ? (
                  <button onClick={() => { setTimerActive(false); setScreen("result"); }} style={{ padding: '12px 32px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700 }}>Finish Test</button>
                ) : (
                  <button onClick={() => setCurrentQ(prev => prev + 1)} disabled={!isAnswered} style={{ padding: '12px 32px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, opacity: isAnswered ? 1 : 0.5 }}>Next →</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SecurityWrapper>
    );
  };

  const renderResult = () => {
    const total = questions.length;
    let correct = 0;
    questions.forEach((q, i) => { if (userAnswers[i] === q.ans) correct++; });
    const pct = Math.round((correct / total) * 100);

    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 24px', fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '48px', textAlign: 'center', color: 'white' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', fontWeight: 900 }}>{pct}%</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Test Complete</h1>
          </div>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <div style={{ flex: 1, padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Correct</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{correct}</div>
              </div>
              <div style={{ flex: 1, padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Wrong</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{total - correct}</div>
              </div>
            </div>
            <button onClick={() => setScreen("home")} style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Back to Topics</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {screen === "home" && renderHome()}
      {screen === "quiz" && renderQuiz()}
      {screen === "result" && renderResult()}
    </div>
  );
}
