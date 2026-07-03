import React, { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

const SecurityWrapper = ({ children }) => {
  const [violations, setViolations] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");
  const [glitch, setGlitch] = useState(false);

  const addViolation = useCallback((type, desc) => {
    console.warn(`[SECURITY] ${type}: ${desc}`);
    setViolations(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsLocked(true);
        setLockMessage("🛑 SECURITY OVERRIDE: Multiple unauthorized attempts detected. System locked.");
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // Glitch effect interval
    const glitchInt = setInterval(() => setGlitch(prev => !prev), 1500);
    return () => clearInterval(glitchInt);
  }, []);

  useEffect(() => {
    // 1. Tab Monitoring (INSTANT LOCKOUT)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsLocked(true);
        setLockMessage("🛑 CRITICAL BREACH: Tab switching detected. Test Session Terminated.");
        addViolation('TAB_SWITCH', 'User switched tab - Immediate Lockout');
      }
    };

    // 1.1 Focus Monitoring (INSTANT LOCKOUT)
    const handleBlur = () => {
      setIsLocked(true);
      setLockMessage("🛑 FOCUS LOST: Window focus removed. Access Revoked.");
      addViolation('FOCUS_LOST', 'User left the window - Immediate Lockout');
    };

    // 2. Interaction Protections
    const handleContextMenu = (e) => e.preventDefault();
    const handleDrag = (e) => e.preventDefault();
    
    // 3. Keyboard Shortcuts
    const handleKeyDown = (e) => {
      const blocked = [
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'u' || e.key === 'p' || e.key === 's' || e.key === 'j')),
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')),
        (e.key === 'F12'),
        (e.key === 'PrintScreen'),
        (e.metaKey)
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        addViolation('KEYBOARD_RESTRICTION', `Blocked Key: ${e.key}`);
      }
    };

    // 4. Clipboard Events
    const handleClipboard = (e) => {
      e.preventDefault();
      addViolation('CLIPBOARD_ACCESS', 'Clipboard operation blocked');
    };

    // 5. DevTools Detection (Immediate Lockout)
    const dtInterval = setInterval(() => {
      const threshold = 160;
      const isDevToolsOpen = (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold);
      if (isDevToolsOpen) {
        setIsLocked(true);
        setLockMessage("🛑 SYSTEM ALERT: Developer Tools detected. Security Protocol Activated.");
        addViolation('DEVTOOLS', 'DevTools open detected');
      }
    }, 2000);

    // Apply Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('dragstart', handleDrag);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('dragstart', handleDrag);
      clearInterval(dtInterval);
    };
  }, [addViolation]);

  if (isLocked) {
    return (
      <div style={{ 
        position: 'fixed', inset: 0, zIndex: 99999, 
        backgroundColor: '#050a14', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        padding: '40px', textAlign: 'center', fontFamily: '"Courier New", Courier, monospace',
        color: '#00f2ff', overflow: 'hidden'
      }}>
        {/* Scanline Effect */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0, 242, 255, 0.05) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }}></div>
        
        <div style={{ 
          marginBottom: '32px', padding: '30px', 
          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
          borderRadius: '50%', border: `2px solid ${glitch ? '#ff0000' : '#00f2ff'}`,
          boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
          transition: 'all 0.1s ease'
        }}>
          <ShieldAlert size={80} color={glitch ? "#ff0000" : "#00f2ff"} />
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ff0055', textShadow: '0 0 10px #ff0055', letterSpacing: '2px', marginBottom: '16px' }}>
          {glitch ? "ACCESS DENIED" : "SYSTEM LOCKED"}
        </h1>

        <div style={{ border: '1px solid #00f2ff', padding: '20px', backgroundColor: 'rgba(0, 242, 255, 0.05)', borderRadius: '8px', maxWidth: '500px' }}>
          <p style={{ color: '#fff', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {lockMessage}
          </p>
          <div style={{ marginTop: '15px', fontSize: '11px', color: '#00f2ff', opacity: 0.7 }}>
            TRACE_ID: {Math.random().toString(36).substring(7).toUpperCase()} | PROTOCOL: ZERO_TRUST_v2.1
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{ 
            marginTop: '40px',
            padding: '14px 40px', 
            backgroundColor: 'transparent', 
            border: '2px solid #00f2ff', 
            color: '#00f2ff', 
            fontWeight: 'bold', 
            borderRadius: '4px', 
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#00f2ff';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#00f2ff';
          }}
        >
          RE-INITIALIZE SESSION
        </button>
      </div>
    );
  }

  return (
    <div style={{ userSelect: 'none', position: 'relative' }}>
      {children}
      {violations > 0 && violations < 5 && (
        <div style={{ 
          position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, 
          backgroundColor: '#050a14', color: '#ff0055', 
          padding: '10px 20px', borderRadius: '4px', 
          fontSize: '11px', fontWeight: 'bold', 
          border: '1px solid #ff0055',
          boxShadow: '0 0 15px rgba(255, 0, 85, 0.2)',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'monospace'
        }}>
          <Activity size={14} /> SECURITY LOG: {violations}/5 DETECTED | [STATUS: WARNING]
        </div>
      )}
    </div>
  );
};

export default SecurityWrapper;
