import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, AlertTriangle, Monitor, Maximize, 
  Eye, User, Lock, Activity, RefreshCw, 
  ChevronRight, ArrowLeft, Send, CheckCircle2, 
  XCircle, Clock, Zap, Terminal, ShieldAlert
} from 'lucide-react';
import './ProctoringWrapper.css';

/**
 * ProctoringWrapper - A robust anti-cheat proctoring system
 * Features: Tab monitoring, Fullscreen enforcement, DevTools detection,
 * Shortcut blocking, Copy-paste prevention, Face monitoring simulation,
 * Real-time violation logging, and Result analytics.
 */

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is a core principle of Information Security?",
    options: ["CIA Triad", "OSI Model", "TCP/IP Suite", "MVC Architecture"],
    correct: 0
  },
  {
    id: 2,
    question: "What does SQL injection primarily target?",
    options: ["Client-side scripts", "Network protocols", "Database layer", "Physical hardware"],
    correct: 2
  },
  {
    id: 3,
    question: "Which hashing algorithm is considered most secure among these?",
    options: ["MD5", "SHA-1", "SHA-256", "ROT13"],
    correct: 2
  },
  {
    id: 4,
    question: "A firewall operates at which layer of the OSI model?",
    options: ["Layer 1 (Physical)", "Layer 3/4 (Network/Transport)", "Layer 2 (Data Link)", "Layer 5 (Session)"],
    correct: 1
  },
  {
    id: 5,
    question: "What is the primary purpose of multi-factor authentication (MFA)?",
    options: ["To speed up login", "To reduce password complexity", "To provide multiple layers of defense", "To backup user data"],
    correct: 2
  }
];

const ProctoringWrapper = () => {
  // --- STATE ---
  const [phase, setPhase] = useState('scanning'); // scanning, instructions, active, submitted
  const [violations, setViolations] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isBlockingOverlay, setIsBlockingOverlay] = useState(false);
  const [blockingMessage, setBlockingMessage] = useState("");
  const [toasts, setToasts] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanSteps, setScanSteps] = useState([
    { label: "Browser Integrity Check", status: "pending" },
    { label: "Screen Capture Prevention", status: "pending" },
    { label: "Extension Security Scan", status: "pending" },
    { label: "VM / Sandbox Detection", status: "pending" }
  ]);
  const [proctorStatus, setProctorStatus] = useState({ face: true, attention: true, multipleFaces: false });

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // --- HELPER: ADD VIOLATION ---
  const addViolation = useCallback((type, description, severity = 'LOW') => {
    const newViolation = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date().toLocaleTimeString(),
      severity // LOW, MEDIUM, HIGH, CRITICAL
    };
    
    setViolations(prev => [...prev, newViolation]);
    
    // Toast notification
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev, { id: toastId, ...newViolation }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);

    // Auto-submit logic
    if (type === 'TAB_SWITCH') {
      setTabSwitchCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setTimeout(() => handleFinishTest("AUTOMATIC_SUBMISSION (Limit Exceeded)"), 1000);
        }
        return next;
      });
    }

    if (violations.length >= 4) {
      // 5th violation logic
       // handleFinishTest("AUTOMATIC_SUBMISSION (Multiple Violations)");
    }
  }, [violations.length]);

  // --- MONITORING: TAB & WINDOW ---
  useEffect(() => {
    if (phase !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('TAB_SWITCH', 'User switched tab or minimized browser', 'CRITICAL');
        setIsBlockingOverlay(true);
        setBlockingMessage("⚠️ TAB SWITCH DETECTED! You have been logged. Please return to the test window immediately.");
      }
    };

    const handleBlur = () => {
      addViolation('FOCUS_LOST', 'Browser window lost focus', 'HIGH');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, addViolation]);

  // --- MONITORING: FULLSCREEN ---
  useEffect(() => {
    if (phase !== 'active') return;

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        addViolation('FULLSCREEN_EXIT', 'User exited fullscreen mode', 'HIGH');
        setIsBlockingOverlay(true);
        setBlockingMessage("🚨 FULLSCREEN REQUIRED! Test access suspended until fullscreen is restored.");
      } else {
        setIsBlockingOverlay(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [phase, addViolation]);

  // --- MONITORING: KEYBOARD & MOUSE ---
  useEffect(() => {
    if (phase !== 'active') return;

    const handleKeyDown = (e) => {
      // Block common shortcuts
      const blockedCombos = [
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'u' || e.key === 'p' || e.key === 'n' || e.key === 't')),
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')),
        (e.key === 'F12'),
        (e.metaKey), // Windows/Command key
        (e.altKey && e.key === 'Tab')
      ];

      if (blockedCombos.some(Boolean)) {
        e.preventDefault();
        addViolation('KEYBOARD_SHORTCUT', `Blocked unauthorized shortcut: ${e.key}`, 'MEDIUM');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation('RIGHT_CLICK', 'Right-click menu disabled during test', 'LOW');
    };

    const handleMouseLeave = () => {
      addViolation('MOUSE_LEAVE', 'Mouse left the browser area', 'LOW');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [phase, addViolation]);

  // --- MONITORING: DEVTOOLS ---
  useEffect(() => {
    if (phase !== 'active') return;

    const devtoolsDetector = setInterval(() => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      
      if (widthDiff || heightDiff) {
        addViolation('DEVTOOLS_DETECTED', 'Developer tools suspected to be open', 'CRITICAL');
      }
    }, 2000);

    return () => clearInterval(devtoolsDetector);
  }, [phase, addViolation]);

  // --- MOCK PROCTORING ENGINE ---
  useEffect(() => {
    if (phase !== 'active') return;

    const proctorInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.1) {
        setProctorStatus(prev => ({ ...prev, face: false }));
        addViolation('PROCTOR_WARNING', 'Face not detected in camera frame', 'MEDIUM');
        setTimeout(() => setProctorStatus(prev => ({ ...prev, face: true })), 2000);
      } else if (rand < 0.2) {
        setProctorStatus(prev => ({ ...prev, multipleFaces: true }));
        addViolation('PROCTOR_WARNING', 'Multiple faces detected!', 'HIGH');
        setTimeout(() => setProctorStatus(prev => ({ ...prev, multipleFaces: false })), 3000);
      } else if (rand < 0.3) {
        setProctorStatus(prev => ({ ...prev, attention: false }));
        addViolation('PROCTOR_WARNING', 'Looking away from screen detected', 'MEDIUM');
        setTimeout(() => setProctorStatus(prev => ({ ...prev, attention: true })), 2000);
      }
    }, 8000);

    return () => clearInterval(proctorInterval);
  }, [phase, addViolation]);

  // --- TIMER ENGINE ---
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinishTest("TIME_EXPIRED");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // --- ENVIRONMENT SCAN SIMULATION ---
  useEffect(() => {
    if (phase === 'scanning') {
      let step = 0;
      const scanInterval = setInterval(() => {
        if (step < 4) {
          setScanSteps(prev => {
            const next = [...prev];
            next[step].status = 'complete';
            return next;
          });
          setScanProgress((step + 1) * 25);
          step++;
        } else {
          clearInterval(scanInterval);
          setTimeout(() => setPhase('instructions'), 800);
        }
      }, 1000);
      return () => clearInterval(scanInterval);
    }
  }, [phase]);

  // --- ACTIONS ---
  const startTest = async () => {
    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
      setPhase('active');
    } catch (err) {
      alert("Please allow fullscreen to start the test.");
    }
  };

  const handleFinishTest = (reason = "USER_SUBMITTED") => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setPhase('submitted');
  };

  const restoreFullscreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    return score;
  };

  const calculateIntegrity = () => {
    const penalty = violations.length * 10;
    return Math.max(0, 100 - penalty);
  };

  const getIntegrityVerdict = () => {
    const score = calculateIntegrity();
    if (score >= 90) return { text: "EXCELLENT ✓", color: "text-emerald-400" };
    if (score >= 70) return { text: "PASSED ✓", color: "text-blue-400" };
    if (score >= 40) return { text: "FLAGGED ⚠️", color: "text-orange-400" };
    return { text: "DISQUALIFIED ✗", color: "text-red-500" };
  };

  // --- RENDER: SCANNING ---
  if (phase === 'scanning') {
    return (
      <div className="proctor-container flex items-center justify-center p-6">
        <div className="scanline-overlay"></div>
        <div className="cyber-card w-full max-w-md p-8 rounded-2xl border-emerald-500/30">
          <div className="flex items-center gap-3 mb-8">
            <RefreshCw className="animate-spin text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tighter text-emerald-400">ENVIRONMENT SCAN IN PROGRESS...</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {scanSteps.map((step, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{step.label}</span>
                {step.status === 'complete' ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-700 border-t-emerald-500 animate-spin"></div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_15px_#00ff88]" 
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-[10px] text-gray-500 text-center uppercase">System Integrity Verification v2.4.0</p>
        </div>
      </div>
    );
  }

  // --- RENDER: INSTRUCTIONS ---
  if (phase === 'instructions') {
    return (
      <div className="proctor-container flex items-center justify-center p-6">
        <div className="scanline-overlay"></div>
        <div className="cyber-card w-full max-w-2xl p-10 rounded-3xl border-cyan-500/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Shield size={32} /></div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">EXAM INTEGRITY PROTOCOL</h1>
              <p className="text-cyan-400/70 text-xs">Read all instructions carefully before starting</p>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-gray-300 text-sm leading-relaxed">
            <div className="flex gap-3"><Monitor className="flex-shrink-0 text-cyan-400" size={18} /> <p>Fullscreen mode is mandatory. Exiting will log a violation.</p></div>
            <div className="flex gap-3"><Lock className="flex-shrink-0 text-cyan-400" size={18} /> <p>Copy, paste, and right-click are strictly disabled.</p></div>
            <div className="flex gap-3"><AlertTriangle className="flex-shrink-0 text-cyan-400" size={18} /> <p>Tab switching or window blur events will trigger auto-submission after 3 attempts.</p></div>
            <div className="flex gap-3"><Eye className="flex-shrink-0 text-cyan-400" size={18} /> <p>Your attention and presence are simulatedly monitored via Proctoring Engine.</p></div>
          </div>

          <button 
            onClick={startTest}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
          >
            I AGREE & START TEST <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: SUBMITTED / RESULTS ---
  if (phase === 'submitted') {
    const verdict = getIntegrityVerdict();
    return (
      <div className="proctor-container p-6 flex flex-col items-center">
        <div className="scanline-overlay"></div>
        <div className="w-full max-w-4xl space-y-6">
          <div className="cyber-card p-10 rounded-3xl border-gray-800 text-center">
            <h1 className="text-4xl font-black mb-8 tracking-tighter">EXAM SESSION REPORT</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase mb-2">Final Score</p>
                <p className="text-3xl font-bold text-white">{calculateScore()} / 5</p>
              </div>
              <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase mb-2">Violations</p>
                <p className={`text-3xl font-bold ${violations.length > 0 ? 'text-red-500' : 'text-emerald-400'}`}>{violations.length}</p>
              </div>
              <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase mb-2">Integrity Score</p>
                <p className="text-3xl font-bold text-cyan-400">{calculateIntegrity()}%</p>
              </div>
              <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase mb-2">Verdict</p>
                <p className={`text-xl font-black ${verdict.color}`}>{verdict.text}</p>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={20} className="text-red-500" /> Violation History Log</h3>
              <div className="bg-black/50 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-gray-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Time</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-600 italic text-xs">No violations detected during this session. Integrity maintained.</td></tr>
                    ) : (
                      violations.map((v, i) => (
                        <tr key={i} className="border-t border-gray-900 hover:bg-gray-900/30 transition-colors">
                          <td className="p-4 text-gray-400 font-mono">{v.timestamp}</td>
                          <td className="p-4 text-white font-bold">{v.type}</td>
                          <td className="p-4 text-gray-400 text-xs">{v.description}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                              v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                              'bg-yellow-500/20 text-yellow-500'
                            }`}>{v.severity}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="mt-10 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm font-bold flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={18} /> RE-SCAN ENVIRONMENT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: ACTIVE TEST ---
  return (
    <div ref={containerRef} className="proctor-container flex h-screen select-none overflow-hidden">
      <div className="scanline-overlay"></div>

      {/* FULLSCREEN BLOCKING OVERLAY */}
      {isBlockingOverlay && (
        <div className="overlay-blocking p-10 text-center">
          <div className="mb-8 p-6 bg-red-600/20 rounded-full border-2 border-red-500/50 animate-pulse">
            <ShieldAlert size={80} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 glitch-text">SECURITY BREACH DETECTED</h1>
          <p className="text-red-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            {blockingMessage}
          </p>
          <button 
            onClick={restoreFullscreen}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-900/40 flex items-center gap-3 transition-transform active:scale-95"
          >
            <Maximize size={22} /> RESTORE FULLSCREEN ACCESS
          </button>
        </div>
      )}

      {/* SIDEBAR: VIOLATIONS & PROCTORING */}
      <aside className="w-80 border-r border-gray-800 flex flex-col bg-gray-950/50 backdrop-blur-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="pulse-dot"></div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">LIVE PROCTORING ACTIVE</span>
          </div>
          
          <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Violations</p>
              <p className={`text-2xl font-black ${violations.length > 0 ? 'text-red-500' : 'text-emerald-400'}`}>{violations.length}</p>
            </div>
            <div className="w-px h-8 bg-gray-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Trust Score</p>
              <p className="text-2xl font-black text-cyan-400">{calculateIntegrity()}%</p>
            </div>
          </div>
        </div>

        {/* PROCTORING FEED MOCK */}
        <div className="p-6">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative mb-4">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <User size={64} className="text-gray-500" />
             </div>
             <div className="absolute top-2 left-2 flex gap-1">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               <span className="text-[8px] text-red-500 font-bold uppercase">REC</span>
             </div>
             <div className="absolute bottom-2 left-2 text-[9px] bg-black/60 px-2 py-1 rounded text-white font-mono">
               CAM_01_FEED_{proctorStatus.face ? 'STABLE' : 'LOST'}
             </div>
          </div>
          
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-2 rounded-lg text-[10px] font-bold ${proctorStatus.face ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
              <span>FACE DETECTION</span>
              <span>{proctorStatus.face ? '✓ DETECTED' : '⚠️ NOT FOUND'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg text-[10px] font-bold ${proctorStatus.attention ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
              <span>ATTENTION TRACKING</span>
              <span>{proctorStatus.attention ? '✓ STABLE' : '⚠️ DISTRACTED'}</span>
            </div>
            {proctorStatus.multipleFaces && (
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold animate-bounce text-center">
                🚨 MULTIPLE FACES DETECTED!
              </div>
            )}
          </div>
        </div>

        {/* LIVE LOG */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2">
            <Terminal size={12} /> System Activity Log
          </h4>
          {violations.map((v, i) => (
            <div key={v.id} className="violation-toast p-3 bg-gray-900 border-l-2 border-red-500 rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-red-500 uppercase">{v.type}</span>
                <span className="text-[8px] text-gray-600">{v.timestamp}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">{v.description}</p>
            </div>
          ))}
          {violations.length === 0 && (
             <div className="text-center py-10">
               <Shield className="mx-auto text-gray-800 mb-2" size={32} />
               <p className="text-[9px] text-gray-600 uppercase">Awaiting violations...</p>
             </div>
          )}
        </div>
      </aside>

      {/* MAIN EXAM AREA */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-br from-gray-950 to-black">
        {/* HEADER */}
        <header className="h-20 border-b border-gray-800 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Terminal size={24} /></div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tighter">CYBERSECURITY ASSESSMENT_2024</h2>
              <div className="flex gap-4 mt-1">
                <span className="text-[10px] text-gray-500">USER: STUDENT_ANON_X</span>
                <span className="text-[10px] text-gray-500">ID: #492-938-1</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className={`flex flex-col items-end ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Time Remaining</span>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-2xl font-black font-mono tracking-widest">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button 
              onClick={() => handleFinishTest()}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/20"
            >
              FINISH TEST
            </button>
          </div>
        </header>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-900 h-1">
          <div 
            className="h-full bg-cyan-500 transition-all duration-500" 
            style={{ width: `${(Object.keys(answers).length / 5) * 100}%` }}
          ></div>
        </div>

        {/* QUESTION AREA */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center">
           <div className="w-full max-w-3xl">
              <div className="mb-12">
                <div className="text-emerald-400 text-xs font-bold mb-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/30">QUESTION {currentQuestion + 1} OF 5</span>
                </div>
                <h3 className="text-2xl font-bold text-white leading-snug">
                  {SAMPLE_QUESTIONS[currentQuestion].question}
                </h3>
              </div>

              <div className="space-y-4 mb-12">
                {SAMPLE_QUESTIONS[currentQuestion].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({...answers, [currentQuestion]: i})}
                    className={`w-full p-6 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group
                      ${answers[currentQuestion] === i 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                        : 'border-gray-800 bg-gray-900/30 hover:border-gray-700 text-gray-400'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${answers[currentQuestion] === i ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'}`}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="font-medium">{opt}</span>
                    </div>
                    {answers[currentQuestion] === i && <CheckCircle2 className="text-emerald-500" size={24} />}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                <button 
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all disabled:opacity-20 flex items-center gap-2 text-sm"
                >
                  <ArrowLeft size={18} /> PREVIOUS
                </button>
                
                {currentQuestion === 4 ? (
                  <button 
                    onClick={() => handleFinishTest()}
                    className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2 text-sm"
                  >
                    SUBMIT FINAL <Send size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="px-10 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2 text-sm"
                  >
                    NEXT QUESTION <ChevronRight size={18} />
                  </button>
                )}
              </div>
           </div>
        </div>

        {/* BOTTOM NAVIGATOR */}
        <footer className="p-4 border-t border-gray-800 flex items-center justify-center gap-4 bg-black/40">
           {SAMPLE_QUESTIONS.map((_, i) => (
             <button
               key={i}
               onClick={() => setCurrentQuestion(i)}
               className={`w-10 h-10 rounded-lg font-bold text-xs transition-all border
                 ${currentQuestion === i ? 'bg-cyan-500 border-cyan-400 text-black scale-110' : 
                   answers[i] !== undefined ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 
                   'bg-gray-900 border-gray-800 text-gray-500'}`}
             >
               {i + 1}
             </button>
           ))}
        </footer>

        {/* WARNING BANNERS */}
        {violations.length > 0 && violations.length < 3 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-xl backdrop-blur-md flex items-center justify-center gap-3 text-yellow-500 font-bold text-xs uppercase tracking-tighter">
            <AlertTriangle size={18} /> YOU ARE BEING MONITORED BY AI PROCTORING
          </div>
        )}
        {violations.length >= 3 && violations.length < 5 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-orange-500/10 border border-orange-500/50 p-3 rounded-xl backdrop-blur-md flex items-center justify-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-tighter animate-bounce">
            <AlertTriangle size={18} /> MULTIPLE VIOLATIONS DETECTED. FINAL WARNING.
          </div>
        )}
        {violations.length >= 5 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-red-500/10 border border-red-500/50 p-3 rounded-xl backdrop-blur-md flex items-center justify-center gap-3 text-red-500 font-bold text-xs uppercase tracking-tighter glitch-text">
            <Zap size={18} /> CRITICAL SECURITY BREACH: AUTOMATIC DISQUALIFICATION RISK
          </div>
        )}

        {/* TOASTS CONTAINER */}
        <div className="absolute bottom-6 right-6 space-y-3 z-[1000]">
          {toasts.map(toast => (
            <div key={toast.id} className="violation-toast p-4 bg-gray-950 border border-red-500/50 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500"><XCircle /></div>
              <div>
                <p className="text-[10px] font-black text-red-500 uppercase">{toast.type}</p>
                <p className="text-xs text-white">{toast.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProctoringWrapper;
