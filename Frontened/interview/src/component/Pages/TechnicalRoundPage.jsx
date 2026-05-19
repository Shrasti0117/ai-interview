import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * TECHNICAL ROUND HUB - InterviewAce
 * A comprehensive, multi-modal hub for all technical interview types.
 */

// --- DATA: TECHNICAL CATEGORIES ---
const TECH_CATEGORIES = [
  {
    id: 'dsa',
    name: "Data Structures & Algorithms",
    short: "DSA",
    icon: "⚡",
    color: "#2563eb",
    bg: "#eff6ff",
    desc: "Core of technical rounds: Arrays, Strings, Trees, Graphs, DP, and Complexity Analysis.",
    features: ["LeetCode Style Problems", "Time/Space Complexity", "Optimal Solutions"]
  },
  {
    id: 'live-coding',
    name: "Live Coding Arena",
    short: "Coding",
    icon: "💻",
    color: "#7c3aed",
    bg: "#f5f3ff",
    desc: "Real-time coding sessions. Practice thinking out loud and approaching complex problems.",
    features: ["Shared Editor Mock", "Whiteboard Strategy", "Clean Code Focus"]
  },
  {
    id: 'system-design',
    name: "System Design Studio",
    short: "Design",
    icon: "🏗️",
    color: "#f59e0b",
    bg: "#fffbeb",
    desc: "Scalable architecture: Twitter, URL Shorteners, Load Balancing, Microservices.",
    features: ["High-Level Design", "SQL vs NoSQL", "Caching & CDN"]
  },
  {
    id: 'frameworks',
    name: "Language & Frameworks",
    short: "Stacks",
    icon: "🧩",
    color: "#16a34a",
    bg: "#f0fdf4",
    desc: "Deep dives into JS Closures, Python Decorators, Java GC, React Hooks, and more.",
    features: ["Promise/Async Flow", "Framework Internals", "Memory Management"]
  },
  {
    id: 'oops',
    name: "OOP & Design Patterns",
    short: "OOP",
    icon: "🔷",
    color: "#3b82f6",
    bg: "#eff6ff",
    desc: "SOLID principles, Inheritance, Polymorphism, and common Design Patterns.",
    features: ["SOLID Principles", "Singleton/Factory", "Observer Patterns"]
  },
  {
    id: 'databases',
    name: "Database & SQL Lab",
    short: "SQL",
    icon: "🗄️",
    color: "#059669",
    bg: "#ecfdf5",
    desc: "Complex Joins, Indexing, Normalization, and ACID property transactions.",
    features: ["Query Optimization", "Schema Design", "Transaction Logic"]
  },
  {
    id: 'os-networking',
    name: "OS & Networking Basics",
    short: "Fundamentals",
    icon: "🌐",
    color: "#d97706",
    bg: "#fff7ed",
    desc: "Processes, Threads, Deadlocks, HTTP/S, REST APIs, TCP/UDP, and DNS.",
    features: ["Concurrency Models", "REST vs GraphQL", "Network Layers"]
  },
  {
    id: 'debugging',
    name: "Code Review & Debugging",
    short: "Debug",
    icon: "🔍",
    color: "#dc2626",
    bg: "#fef2f2",
    desc: "Identify and fix bugs in existing code. Test your practical code review skills.",
    features: ["Bug Hunting", "Performance Fixes", "Refactoring Lab"]
  },
  {
    id: 'assignments',
    name: "Take-Home Project Lab",
    short: "Projects",
    icon: "📦",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    desc: "Mini-project simulations. Build, document, and prepare for code reviews.",
    features: ["2-3 Day Simulations", "Documentation Focus", "Architecture Review"]
  },
  {
    id: 'behavioral-tech',
    name: "Behavioral + Technical Mix",
    short: "STAR",
    icon: "🎯",
    color: "#10b981",
    bg: "#f0fdf4",
    desc: "Answering challenging problems using the STAR format with technical depth.",
    features: ["STAR Methodology", "Conflict Resolution", "Technical Leadership"]
  }
];

const TechnicalRoundPage = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [activeSubPage, setActiveSubPage] = useState('hub'); // 'hub' or category id
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');

  // --- FILTERING ---
  const filteredCategories = useMemo(() => {
    const q = currentSearch.toLowerCase();
    return TECH_CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.desc.toLowerCase().includes(q) || 
      c.short.toLowerCase().includes(q)
    );
  }, [currentSearch]);

  // --- HANDLERS ---
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActiveSubPage(cat.id);
  };

  const handleBackToHub = () => {
    setActiveSubPage('hub');
    setSelectedCategory(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // --- SUB-PAGE COMPONENTS ---

  const SubPageHeader = ({ cat }) => (
    <div style={{ marginBottom: '32px', animation: 'ia-fadeUp 0.4s ease' }}>
      <button 
        onClick={handleBackToHub}
        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        ← Back to Technical Hub
      </button>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ fontSize: '48px', width: '80px', height: '80px', background: cat.bg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cat.icon}
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1d2e', marginBottom: '4px' }}>{cat.name}</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>{cat.desc}</p>
        </div>
      </div>
    </div>
  );

  const ComingSoon = () => (
    <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1d2e', marginBottom: '12px' }}>Interview Simulation Initializing...</h2>
      <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 32px' }}>
        We are preparing a high-fidelity AI-powered environment for your {selectedCategory?.short} preparation.
      </p>
      <button 
        onClick={() => navigate('/test')}
        style={{ padding: '12px 32px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
      >
        Go to Live Test Arena
      </button>
    </div>
  );

  // --- RENDER MAIN HUB ---

  const renderHub = () => (
    <div style={{ animation: 'ia-fadeUp 0.5s ease forwards' }}>
      {/* HUB HERO */}
      <div className="ia-hero">
        <div className="ia-hero-title">
          <div style={{ display: 'flex', gap: '4px' }}>
            {["#ef4444", "#f59e0b", "#3b82f6", "#10b981"].map(c => <span key={c} style={{ width: '12px', height: '24px', borderRadius: '3px', background: c }}></span>)}
          </div>
          Technical Round Hub
        </div>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '700px' }}>
          Master every dimension of the technical interview. Select a specialized module to begin your deep dive preparation.
        </p>

        {/* SEARCH & FILTERS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2.5rem' }}>
          <div className="ia-search-wrap" style={{ maxWidth: '400px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input 
              type="text" 
              placeholder="Search interview types (e.g. DSA, SQL)..." 
              value={currentSearch}
              onChange={e => setCurrentSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="ia-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredCategories.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No matching technical modules found.</p>
          </div>
        ) : (
          filteredCategories.map(cat => (
            <div 
              key={cat.id} 
              className="ia-tech-card"
              onClick={() => handleCategoryClick(cat)}
            >
              <div className="ia-tech-card-icon" style={{ background: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1a1d2e', marginBottom: '8px' }}>{cat.name}</h3>
                <p style={{ fontSize: '.88rem', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>{cat.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cat.features.map(f => (
                    <span key={f} className="ia-feat-tag">{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginLeft: '12px', color: '#cbd5e1' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="ia-technical-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .ia-technical-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          color: #1a1d2e;
        }

        .ia-nav {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .ia-hero { padding: 3rem 2.5rem 1.5rem; max-width: 1320px; margin: 0 auto; }
        .ia-hero-title { display: flex; align-items: center; gap: 12px; font-size: 2.2rem; font-weight: 800; color: #1a1d2e; margin-bottom: 8px; }

        .ia-search-wrap { 
          flex: 1; display: flex; align-items: center; gap: 10px; 
          border: 2px solid #e2e8f0; border-radius: 14px; padding: 10px 16px;
          background: #fff; transition: all 0.2s;
        }
        .ia-search-wrap:focus-within { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .ia-search-wrap input { border: none; outline: none; font-size: .95rem; color: #1a1d2e; width: 100%; font-weight: 500; }
        .ia-search-wrap svg { color: #94a3b8; }

        .ia-section { max-width: 1320px; margin: 0 auto; padding: 0 2.5rem 4rem; }

        .ia-tech-card { 
          background: #fff; border: 1px solid #e2e8f0; border-radius: 20px;
          padding: 1.5rem; display: flex; align-items: flex-start;
          gap: 1.25rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
          position: relative; overflow: hidden;
        }
        .ia-tech-card:hover { 
          transform: translateY(-5px); border-color: #2563eb; 
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02);
        }
        .ia-tech-card-icon { 
          width: 56px; height: 56px; border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 24px; flex-shrink: 0; 
        }
        .ia-feat-tag { 
          font-size: .72rem; font-weight: 700; padding: 4px 10px; 
          border-radius: 8px; background: #f1f5f9; color: #64748b; 
        }

        @keyframes ia-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media(max-width: 768px) {
          .ia-hero { padding: 2rem 1.5rem 1rem; }
          .ia-hero-title { font-size: 1.8rem; }
          .ia-section { padding: 0 1.5rem 3rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="ia-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", transition: "all 0.3s ease" }} 
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          <div style={{ fontWeight: '800', fontSize: '1.3rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
            Interview<span style={{ color: '#2563eb' }}>Ace</span>
          </div>
        </div>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {["Home", "Dashboard", "Technical Hub", "Progress"].map(n => (
            <li key={n}>
              <a href="#" onClick={(e) => { e.preventDefault(); if(n === 'Technical Hub') handleBackToHub(); else navigate(n === 'Home' ? '/' : `/${n.toLowerCase().replace(' ', '-')}`); }} 
                 style={{ textDecoration: 'none', fontSize: '.92rem', fontWeight: 600, color: (n === 'Technical Hub' && activeSubPage === 'hub') ? '#2563eb' : '#64748b', transition: 'color 0.2s' }}>
                {n}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '10px', fontSize: '.88rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}>Logout</button>
      </nav>

      <main>
        {activeSubPage === 'hub' ? renderHub() : (
          <div className="ia-section" style={{ paddingTop: '3rem' }}>
            <SubPageHeader cat={selectedCategory} />
            <ComingSoon />
            
            {/* Detailed Sub-Page Content Area */}
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: '800', marginBottom: '16px', color: '#1e293b' }}>Module Overview</h4>
                <p style={{ fontSize: '.95rem', color: '#64748b', lineHeight: '1.6' }}>
                  This specialized module covers all critical aspects of {selectedCategory?.name}. 
                  You will be tested on theoretical concepts, practical applications, and real-world scenarios.
                </p>
              </div>
              <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: '800', marginBottom: '16px', color: '#1e293b' }}>What to Expect</h4>
                <ul style={{ paddingLeft: '20px', color: '#64748b', fontSize: '.95rem', lineHeight: '2' }}>
                  {selectedCategory?.features.map(f => <li key={f}>{f}</li>)}
                  <li>AI-Driven Performance Review</li>
                  <li>Time-Bound Simulations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechnicalRoundPage;
