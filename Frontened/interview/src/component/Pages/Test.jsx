import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:#2563EB;--primary-dark:#1D4ED8;--primary-light:#EFF6FF;--primary-mid:#BFDBFE;
  --success:#16A34A;--success-light:#F0FDF4;--success-mid:#BBF7D0;
  --warning:#D97706;--warning-light:#FFFBEB;--warning-mid:#FDE68A;
  --danger:#DC2626;--danger-light:#FEF2F2;--danger-mid:#FECACA;
  --purple:#7C3AED;--purple-light:#F5F3FF;--purple-mid:#DDD6FE;
  --orange:#EA580C;--orange-light:#FFF7ED;
  --bg:#F1F5F9;--card:#FFFFFF;--border:#E2E8F0;--border-hover:#CBD5E1;
  --text:#0F172A;--text-2:#475569;--text-3:#94A3B8;
  --radius:10px;--radius-lg:16px;--radius-xl:22px;
  --shadow:0 1px 4px rgba(0,0,0,0.07),0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg:0 4px 24px rgba(0,0,0,0.10),0 1px 4px rgba(0,0,0,0.06);
}
.test-page-container {font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.test-page-container h1,.test-page-container h2,.test-page-container h3{font-family:'DM Serif Display',serif}
.test-page-container button{cursor:pointer;font-family:'DM Sans',sans-serif;border:none;outline:none;transition:all .18s ease}
.test-page-container button:disabled{opacity:.45;cursor:not-allowed}
.test-page-container input,.test-page-container select{font-family:'DM Sans',sans-serif}
.test-page-container ::-webkit-scrollbar{width:5px;height:5px}
.test-page-container ::-webkit-scrollbar-track{background:transparent}
.test-page-container ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes ringFill{from{stroke-dashoffset:283}to{stroke-dashoffset:var(--target)}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes glowBorder{0%,100%{box-shadow:0 0 0 2px #2563EB44}50%{box-shadow:0 0 0 4px #2563EB88}}
@keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}

.animate-up{animation:fadeUp .4s ease forwards}
.animate-in{animation:fadeIn .3s ease forwards}

/* ── NAVBAR ── */
.nav{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
.nav-brand{font-family:'DM Serif Display',serif;font-size:22px;color:var(--primary);letter-spacing:-.3px}
.nav-links{display:flex;gap:6px}
.nav-link{padding:7px 14px;border-radius:8px;font-size:14px;font-weight:500;color:var(--text-2);background:transparent;transition:all .15s}
.nav-link:hover{background:var(--bg);color:var(--text)}
.nav-link.active{background:var(--primary-light);color:var(--primary)}
.nav-logout{padding:7px 16px;border-radius:8px;background:var(--primary);color:#fff;font-size:14px;font-weight:600}
.nav-logout:hover{background:var(--primary-dark)}

/* ── CONFIGURATOR ── */
.config-layout{display:grid;grid-template-columns:340px 1fr;gap:20px;padding:24px 28px;max-width:1300px;margin:0 auto;min-height:calc(100vh - 60px)}
@media(max-width:900px){.config-layout{grid-template-columns:1fr;padding:16px}}
.config-panel{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;display:flex;flex-direction:column}
.panel-header{padding:18px 20px 14px;border-bottom:1px solid var(--border);background:var(--bg)}
.panel-header h2{font-size:17px;color:var(--text)}
.panel-header p{font-size:13px;color:var(--text-3);margin-top:3px}
.subjects-list{flex:1;overflow-y:auto;padding:12px}
.subject-card{border:1.5px solid var(--border);border-radius:var(--radius);padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:all .18s;position:relative;overflow:hidden}
.subject-card:hover{border-color:var(--primary-mid);background:var(--primary-light)}
.subject-card.selected{border-color:var(--primary);background:var(--primary-light)}
.subject-card.selected::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--primary);border-radius:3px 0 0 3px}
.sc-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.sc-icon{width:36px;height:36px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.sc-name{font-weight:600;font-size:13.5px;line-height:1.3}
.sc-abbr{font-size:11px;color:var(--text-3);margin-top:1px}
.sc-right{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.sc-progress{font-size:12px;font-weight:700;color:var(--primary)}
.badge{padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;line-height:1.5}
.badge-easy{background:#DCFCE7;color:#15803D}
.badge-medium{background:#FEF3C7;color:#B45309}
.badge-hard{background:#FEE2E2;color:#B91C1C}
.badge-advanced{background:var(--purple-mid);color:var(--purple)}
.badge-core{background:#E0F2FE;color:#0369A1}
.badge-trending{background:#FDF4FF;color:#86198F}
.badge-popular{background:#F0FDF4;color:#15803D}
.sc-bar{height:3px;background:var(--border);border-radius:99px;overflow:hidden}
.sc-bar-fill{height:100%;background:var(--primary);border-radius:99px;transition:width .4s ease}

/* ── CONFIG RIGHT PANEL ── */
.config-right{display:flex;flex-direction:column;gap:16px}
.config-section{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px}
.section-title{font-size:13px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px}
.topics-grid{display:flex;flex-wrap:wrap;gap:7px}
.topic-chip{padding:5px 12px;border-radius:99px;border:1.5px solid var(--border);font-size:12.5px;font-weight:500;background:#fff;color:var(--text-2);cursor:pointer;transition:all .15s}
.topic-chip:hover{border-color:var(--primary);color:var(--primary)}
.topic-chip.selected{background:var(--primary);border-color:var(--primary);color:#fff}
.empty-topics{text-align:center;padding:24px;color:var(--text-3);font-size:14px}
.chips-actions{display:flex;gap:12px;margin-top:8px}
.link-btn{background:none;border:none;font-size:12px;font-weight:600;color:var(--primary);padding:0;text-decoration:underline;text-underline-offset:2px}

.config-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.config-row:last-child{margin-bottom:0}
.config-label{font-size:14px;font-weight:500;color:var(--text)}
.config-label small{display:block;font-size:12px;font-weight:400;color:var(--text-3);margin-top:2px}
.slider-wrap{display:flex;align-items:center;gap:10px}
.slider-wrap input[type=range]{width:130px;accent-color:var(--primary)}
.slider-val{font-size:14px;font-weight:700;color:var(--primary);min-width:36px;text-align:right}

.diff-group{display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden}
.diff-btn{padding:6px 14px;font-size:13px;font-weight:500;background:#fff;color:var(--text-2);border:none;border-right:1.5px solid var(--border);transition:all .15s}
.diff-btn:last-child{border-right:none}
.diff-btn.active{background:var(--primary);color:#fff}
.diff-btn:hover:not(.active){background:var(--bg)}

.mode-toggle{display:flex;background:var(--bg);border-radius:99px;padding:3px;border:1.5px solid var(--border)}
.mode-btn{padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;background:transparent;color:var(--text-2);transition:all .2s;border:none}
.mode-btn.active{background:#fff;color:var(--primary);box-shadow:0 1px 4px rgba(0,0,0,0.10)}

.time-select{padding:6px 10px;border-radius:8px;border:1.5px solid var(--border);font-size:13px;color:var(--text);background:#fff}

.ai-card{background:linear-gradient(135deg,var(--primary-light),var(--purple-light));border:1.5px solid var(--primary-mid);border-radius:var(--radius-lg);padding:18px;position:relative;overflow:hidden;animation:glowBorder 2.5s ease infinite}
.ai-card-title{font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px;display:flex;align-items:center;gap:7px}
.ai-card p{font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:14px}
.ai-btn{background:linear-gradient(135deg,var(--primary),var(--purple));color:#fff;padding:9px 20px;border-radius:99px;font-size:13.5px;font-weight:700;border:none;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .2s}
.ai-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px #2563EB44}

.summary-card{background:linear-gradient(135deg,#F8FAFC,#EFF6FF);border:1.5px solid var(--primary-mid);border-radius:var(--radius-lg);padding:18px}
.summary-card h3{font-size:16px;margin-bottom:12px;color:var(--primary)}
.summary-item{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:13.5px}
.summary-label{color:var(--text-3);min-width:100px;font-weight:500}
.summary-value{color:var(--text);font-weight:600;flex:1}

.start-btn{background:var(--primary);color:#fff;width:100%;padding:14px;border-radius:var(--radius-lg);font-size:16px;font-weight:700;letter-spacing:.2px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 4px 12px #2563EB33}
.start-btn:hover:not(:disabled){background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 6px 20px #2563EB44}
.start-btn:disabled{background:#94A3B8;box-shadow:none}

/* ── ARENA ── */
.arena-header{background:#fff;border-bottom:1px solid var(--border);padding:0 24px;height:58px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.arena-brand{font-family:'DM Serif Display',serif;font-size:18px;color:var(--primary);white-space:nowrap}
.arena-breadcrumb{font-size:12px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.arena-progress-wrap{flex:1;display:flex;align-items:center;gap:10px}
.arena-progress-bar{flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden;min-width:80px}
.arena-progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),#60A5FA);border-radius:99px;transition:width .4s ease}
.arena-q-count{font-size:13px;font-weight:700;color:var(--text-2);white-space:nowrap}
.arena-timer{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;padding:5px 12px;border-radius:8px;background:var(--bg);color:var(--text);white-space:nowrap;min-width:80px;text-align:center}
.arena-timer.warning{background:var(--warning-light);color:var(--warning);animation:timerPulse 1s ease infinite}
.arena-timer.danger{background:var(--danger-light);color:var(--danger);animation:timerPulse .6s ease infinite}
.arena-exit{padding:6px 14px;border-radius:8px;background:var(--bg);border:1.5px solid var(--border);font-size:13px;font-weight:600;color:var(--text-2)}
.arena-exit:hover{background:var(--danger-light);border-color:var(--danger-mid);color:var(--danger)}
.practice-badge{background:var(--success-light);color:var(--success);border:1.5px solid var(--success-mid);border-radius:8px;font-size:12px;font-weight:700;padding:5px 10px;white-space:nowrap}

.arena-layout{display:grid;grid-template-columns:1fr 240px;gap:16px;padding:18px 20px;max-width:1200px;margin:0 auto;padding-bottom:90px}
@media(max-width:900px){.arena-layout{grid-template-columns:1fr;padding:12px 14px;padding-bottom:180px}}

.question-canvas{animation:fadeUp .35s ease}
.q-meta{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.q-num{font-size:12px;font-weight:700;color:var(--text-3);background:var(--bg);border:1px solid var(--border);padding:3px 10px;border-radius:99px}
.q-topic-chip{font-size:12px;font-weight:600;background:var(--primary-light);color:var(--primary);padding:3px 10px;border-radius:99px}
.q-diff-chip{font-size:12px;font-weight:600;padding:3px 10px;border-radius:99px}
.q-diff-easy{background:var(--success-light);color:var(--success)}
.q-diff-medium{background:var(--warning-light);color:var(--warning)}
.q-diff-hard{background:var(--danger-light);color:var(--danger)}
.q-type-chip{font-size:11px;font-weight:600;background:var(--purple-light);color:var(--purple);padding:3px 8px;border-radius:99px}

.question-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:16px;box-shadow:var(--shadow)}
.question-text{font-size:17px;line-height:1.75;color:var(--text);font-weight:500}

.code-block{background:#1E1B4B;color:#C4B5FD;font-family:'JetBrains Mono',monospace;font-size:13.5px;padding:18px 20px;border-radius:var(--radius);overflow-x:auto;line-height:1.65;margin-top:16px;border:1px solid #312E81}
.code-block .kw{color:#F472B6}
.code-block .fn{color:#60A5FA}
.code-block .str{color:#4ADE80}
.code-block .num{color:#FB923C}
.code-block .cm{color:#6B7280}

.options-grid{display:flex;flex-direction:column;gap:10px}
.option-card{background:var(--card);border:2px solid var(--border);border-radius:var(--radius);padding:13px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .18s;user-select:none}
.option-card:hover{border-color:var(--primary-mid);background:var(--primary-light);transform:translateX(3px)}
.option-card.selected{border-color:var(--primary);background:var(--primary-light)}
.option-card.correct{border-color:var(--success);background:var(--success-light);pointer-events:none}
.option-card.wrong{border-color:var(--danger);background:var(--danger-light);pointer-events:none}
.option-card.disabled{pointer-events:none}
.option-letter{width:30px;height:30px;border-radius:50%;background:var(--bg);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text-2);flex-shrink:0;transition:all .18s}
.option-card.selected .option-letter{background:var(--primary);border-color:var(--primary);color:#fff}
.option-card.correct .option-letter{background:var(--success);border-color:var(--success);color:#fff}
.option-card.wrong .option-letter{background:var(--danger);border-color:var(--danger);color:#fff}
.option-text{font-size:14.5px;flex:1;line-height:1.4;color:var(--text)}
.option-indicator{font-size:16px;margin-left:auto}
.shortcut-hint{font-size:11px;color:var(--text-3);text-align:right;margin-top:6px}

.explanation-panel{background:linear-gradient(135deg,#F0FDF4,#ECFDF5);border:1.5px solid var(--success-mid);border-radius:var(--radius-lg);padding:18px;margin-top:16px;animation:fadeUp .3s ease}
.exp-header{font-size:16px;font-weight:700;margin-bottom:8px}
.exp-header.correct{color:var(--success)}
.exp-header.wrong{color:var(--danger)}
.exp-text{font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:14px}
.next-practice-btn{background:var(--primary);color:#fff;padding:9px 20px;border-radius:99px;font-size:14px;font-weight:700;display:inline-flex;align-items:center;gap:6px}
.next-practice-btn:hover{background:var(--primary-dark)}

/* ── PALETTE ── */
.palette{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;position:sticky;top:76px;max-height:calc(100vh - 100px);overflow-y:auto;box-shadow:var(--shadow)}
.palette h3{font-size:13px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px}
.palette-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:14px}
.p-btn{aspect-ratio:1;border-radius:7px;border:none;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.p-btn.not-visited{background:var(--bg);color:var(--text-3);border:1px solid var(--border)}
.p-btn.answered{background:var(--success);color:#fff}
.p-btn.marked{background:var(--warning);color:#fff}
.p-btn.answered-marked{background:linear-gradient(135deg,var(--success),var(--warning));color:#fff}
.p-btn.current{background:var(--primary);color:#fff;box-shadow:0 0 0 3px var(--primary-mid)}
.p-btn:hover{transform:scale(1.1)}

.palette-legend{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;font-size:11.5px}
.legend-item{display:flex;align-items:center;gap:7px;color:var(--text-2)}
.legend-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.legend-dot.answered{background:var(--success)}
.legend-dot.marked{background:var(--warning)}
.legend-dot.not-visited{background:var(--border);border:1px solid var(--border-hover)}
.legend-dot.current{background:var(--primary)}

.palette-stats{background:var(--bg);border-radius:var(--radius);padding:10px 12px;margin-bottom:12px;display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--text-2)}
.palette-stat{display:flex;justify-content:space-between}
.palette-stat span:last-child{font-weight:700;color:var(--text)}

.submit-test-btn{width:100%;padding:11px;background:linear-gradient(135deg,var(--primary),#1E40AF);color:#fff;border-radius:var(--radius);font-size:14px;font-weight:700;border:none;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.submit-test-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px #2563EB44}

/* ── BOTTOM BAR ── */
.bottom-bar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);padding:12px 28px;display:flex;align-items:center;justify-content:space-between;z-index:99;box-shadow:0 -2px 12px rgba(0,0,0,0.06)}
.mark-btn{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:99px;font-size:13px;font-weight:600;background:var(--warning-light);color:var(--warning);border:1.5px solid var(--warning-mid);transition:all .18s}
.mark-btn.marked{background:var(--warning);color:#fff}
.mark-btn:hover{transform:scale(1.03)}
.nav-btns{display:flex;gap:10px}
.prev-btn,.next-btn{padding:9px 20px;border-radius:99px;font-size:14px;font-weight:600;transition:all .18s}
.prev-btn{background:var(--bg);color:var(--text-2);border:1.5px solid var(--border)}
.prev-btn:hover:not(:disabled){background:var(--border);color:var(--text)}
.next-btn{background:var(--primary);color:#fff}
.next-btn:hover:not(:disabled){background:var(--primary-dark);transform:translateY(-1px)}
.q-indicator-bottom{font-size:13px;font-weight:600;color:var(--text-3)}

/* ── MODALS ── */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
.modal-box{background:#fff;border-radius:var(--radius-xl);padding:32px;max-width:420px;width:90%;box-shadow:var(--shadow-lg);animation:fadeUp .3s ease;text-align:center}
.modal-icon{font-size:40px;margin-bottom:14px}
.modal-box h3{font-size:20px;margin-bottom:10px}
.modal-box p{font-size:14px;color:var(--text-2);line-height:1.6;margin-bottom:20px}
.modal-actions{display:flex;gap:10px;justify-content:center}
.btn-primary-modal{background:var(--primary);color:#fff;padding:10px 24px;border-radius:99px;font-size:14px;font-weight:700}
.btn-primary-modal:hover{background:var(--primary-dark)}
.btn-secondary-modal{background:var(--bg);color:var(--text-2);padding:10px 24px;border-radius:99px;font-size:14px;font-weight:600;border:1.5px solid var(--border)}
.btn-danger-modal{background:var(--danger);color:#fff;padding:10px 24px;border-radius:99px;font-size:14px;font-weight:700}

/* ── REPORT ── */
.report-page{max-width:960px;margin:0 auto;padding:24px 20px}
.report-hero{border-radius:var(--radius-xl);padding:36px 32px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden}
.report-hero.excellent{background:linear-gradient(135deg,#ECFDF5,#D1FAE5,#A7F3D0)}
.report-hero.good{background:linear-gradient(135deg,#EFF6FF,#DBEAFE,#BFDBFE)}
.report-hero.poor{background:linear-gradient(135deg,#FFFBEB,#FEF3C7,#FDE68A)}
.score-circle-wrap{position:relative;width:130px;height:130px;flex-shrink:0}
.score-circle-wrap svg{transform:rotate(-90deg)}
.score-ring-bg{fill:none;stroke:#E2E8F0;stroke-width:10}
.score-ring-fill{fill:none;stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset 1.2s ease}
.score-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.score-num{font-size:26px;font-weight:700;color:var(--text)}
.score-denom{font-size:12px;color:var(--text-3)}
.hero-text h2{font-size:28px;color:var(--text);margin-bottom:6px}
.hero-text .tagline{font-size:15px;color:var(--text-2);margin-bottom:16px}
.hero-pills{display:flex;gap:8px;flex-wrap:wrap}
.hero-pill{padding:5px 14px;border-radius:99px;font-size:13px;font-weight:700;background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);color:var(--text)}

.report-section{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;margin-bottom:20px;box-shadow:var(--shadow)}
.report-section-title{font-size:17px;margin-bottom:16px;color:var(--text);display:flex;align-items:center;gap:8px}

.heatmap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.heat-card{border-radius:var(--radius);padding:14px;border:1.5px solid var(--border);position:relative;overflow:hidden}
.heat-card.master{border-color:var(--success-mid);background:var(--success-light)}
.heat-card.good{border-color:var(--primary-mid);background:var(--primary-light)}
.heat-card.weak{border-color:var(--danger-mid);background:var(--danger-light)}
.heat-topic{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.heat-subject{font-size:11px;color:var(--text-3);margin-bottom:8px}
.heat-score-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.heat-pct{font-size:16px;font-weight:800}
.heat-card.master .heat-pct{color:var(--success)}
.heat-card.good .heat-pct{color:var(--primary)}
.heat-card.weak .heat-pct{color:var(--danger)}
.heat-bar{height:4px;background:var(--border);border-radius:99px;overflow:hidden;margin-bottom:8px}
.heat-fill{height:100%;border-radius:99px}
.heat-card.master .heat-fill{background:var(--success)}
.heat-card.good .heat-fill{background:var(--primary)}
.heat-card.weak .heat-fill{background:var(--danger)}
.heat-label{font-size:11px;font-weight:700}
.heat-card.master .heat-label{color:var(--success)}
.heat-card.good .heat-label{color:var(--primary)}
.heat-card.weak .heat-label{color:var(--danger)}
.practice-link-btn{display:block;margin-top:8px;font-size:11px;font-weight:700;color:var(--primary);background:var(--primary-light);border:1px solid var(--primary-mid);border-radius:6px;padding:4px 8px;text-align:center;cursor:pointer;transition:all .15s}
.practice-link-btn:hover{background:var(--primary);color:#fff}

.review-card{border:1px solid var(--border);border-radius:var(--radius);margin-bottom:8px;overflow:hidden}
.review-card.correct .review-header{border-left:3px solid var(--success)}
.review-card.wrong .review-header{border-left:3px solid var(--danger)}
.review-header{padding:12px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;background:var(--card);transition:background .15s}
.review-header:hover{background:var(--bg)}
.review-qnum{font-size:12px;font-weight:700;color:var(--text-3);background:var(--bg);border:1px solid var(--border);padding:2px 8px;border-radius:99px}
.review-qtopic{font-size:13px;font-weight:600;color:var(--text-2);flex:1}
.review-qstatus{font-size:16px}
.review-chevron{font-size:12px;color:var(--text-3);margin-left:auto}
.review-body{padding:16px;border-top:1px solid var(--border);background:#FAFAFA;animation:fadeIn .25s ease}
.review-qtext{font-size:14px;color:var(--text);line-height:1.6;margin-bottom:12px;font-weight:500}
.review-options{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.review-opt{padding:8px 12px;border-radius:8px;font-size:13px;display:flex;align-items:center;gap:8px;border:1.5px solid var(--border);background:#fff}
.review-opt.correct{border-color:var(--success-mid);background:var(--success-light);color:var(--success)}
.review-opt.wrong{border-color:var(--danger-mid);background:var(--danger-light);color:var(--danger)}
.review-opt .opt-tag{font-size:11px;font-weight:700;margin-left:auto;padding:2px 6px;border-radius:4px}
.review-opt.correct .opt-tag{background:var(--success);color:#fff}
.review-opt.wrong .opt-tag{background:var(--danger);color:#fff}
.review-exp{background:#fff;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:13px;color:var(--text-2);line-height:1.65}
.review-exp strong{color:var(--primary)}

.ai-insight-card{background:linear-gradient(135deg,var(--primary-light),var(--purple-light));border:1.5px solid var(--primary-mid);border-radius:var(--radius-lg);padding:20px}
.ai-title{font-size:16px;font-weight:700;color:var(--primary);margin-bottom:10px;display:flex;align-items:center;gap:7px}
.ai-text{font-size:14px;color:var(--text-2);line-height:1.7;margin-bottom:14px}
.rec-chips{display:flex;flex-wrap:wrap;gap:7px}
.rec-chip{display:flex;align-items:center;gap:6px;background:#fff;border:1.5px solid var(--primary-mid);border-radius:99px;padding:5px 14px;font-size:12.5px;font-weight:600;color:var(--primary)}
.rec-practice-btn{font-size:11.5px;font-weight:700;background:var(--primary);color:#fff;border:none;border-radius:99px;padding:3px 8px;cursor:pointer}
.rec-practice-btn:hover{background:var(--primary-dark)}

.report-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:10px 0 30px}
.report-actions button{padding:11px 24px;border-radius:99px;font-size:14px;font-weight:700;transition:all .2s}
.btn-primary-rep{background:var(--primary);color:#fff}
.btn-primary-rep:hover{background:var(--primary-dark);transform:translateY(-1px)}
.btn-secondary-rep{background:var(--bg);color:var(--text-2);border:1.5px solid var(--border)}
.btn-secondary-rep:hover{background:var(--border)}
.btn-outline-rep{background:#fff;color:var(--primary);border:2px solid var(--primary)}
.btn-outline-rep:hover{background:var(--primary-light)}

/* ── CONFETTI ── */
.confetti-wrap{position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden}
.confetti-piece{position:absolute;top:-20px;animation:confettiFall linear forwards}

/* ── MOBILE PALETTE STRIP ── */
@media(max-width:900px){
  .palette{position:fixed;bottom:70px;left:0;right:0;border-radius:0;border-left:none;border-right:none;border-bottom:none;max-height:160px;overflow-y:auto;z-index:90}
  .palette-legend,.palette-stats{display:none}
  .palette-grid{grid-template-columns:repeat(auto-fill,minmax(32px,1fr))}
  .palette h3{margin-bottom:8px;font-size:12px}
  .submit-test-btn{display:none}
  .bottom-bar{padding:10px 14px}
  .mark-btn span.mark-text{display:none}
  .prev-btn,.next-btn{padding:8px 14px;font-size:13px}
  .arena-breadcrumb{display:none}
  .arena-layout{padding-bottom:240px}
  .report-hero{flex-direction:column;align-items:center;text-align:center}
}
`;

const SUBJECTS = [
  {id:1,name:"Data Structures & Algorithms",abbr:"DSA",icon:"⚡",difficulty:"Hard",category:"Core",progress:50,questions:320,topics:["Arrays","Linked Lists","Trees","Graphs","Sorting","Dynamic Programming"]},
  {id:2,name:"Database Management Systems",abbr:"DBMS",icon:"🗄️",difficulty:"Medium",category:"Core",progress:35,questions:180,topics:["SQL","Normalization","Transactions","Indexing","ER Diagrams","ACID"]},
  {id:3,name:"Operating Systems",abbr:"OS",icon:"⚙️",difficulty:"Hard",category:"Core",progress:20,questions:210,topics:["Processes","Threads","Memory Management","Scheduling","Deadlocks","File Systems"]},
  {id:4,name:"Computer Networks",abbr:"CN",icon:"🌐",difficulty:"Medium",category:"Core",progress:10,questions:160,topics:["OSI Model","TCP/IP","HTTP/HTTPS","DNS","Routing","Subnetting"]},
  {id:5,name:"Software Engineering",abbr:"SE",icon:"🔧",difficulty:"Easy",category:"Core",progress:15,questions:120,topics:["SDLC","Agile","Testing","Design Patterns","UML","CI/CD"]},
  {id:6,name:"System Design",abbr:"SD",icon:"🏗️",difficulty:"Hard",category:"Advanced",progress:5,questions:140,topics:["Scalability","Load Balancing","Caching","Microservices","CAP Theorem","Sharding"]},
  {id:7,name:"Object-Oriented Programming",abbr:"OOPS",icon:"🧩",difficulty:"Medium",category:"Core",progress:60,questions:150,topics:["Inheritance","Polymorphism","Encapsulation","Abstraction","Design Patterns","SOLID"]},
  {id:8,name:"Python Programming",abbr:"Python",icon:"🐍",difficulty:"Easy",category:"Popular",progress:55,questions:190,topics:["Basics","OOP","Libraries","File I/O","Decorators","Generators"]},
  {id:9,name:"Web Development",abbr:"WebDev",icon:"💻",difficulty:"Easy",category:"Trending",progress:45,questions:200,topics:["HTML/CSS","JavaScript","React","REST APIs","Webpack","Authentication"]},
  {id:10,name:"Full Stack (MERN)",abbr:"MERN",icon:"🚀",difficulty:"Hard",category:"Trending",progress:30,questions:250,topics:["MongoDB","Express.js","React","Node.js","Authentication","Deployment"]},
  {id:11,name:"Data Science",abbr:"DS",icon:"📊",difficulty:"Hard",category:"Trending",progress:25,questions:170,topics:["NumPy","Pandas","ML Basics","Visualization","Statistics","Feature Engineering"]},
  {id:12,name:"Compiler Design",abbr:"CD",icon:"🔬",difficulty:"Hard",category:"Advanced",progress:8,questions:110,topics:["Lexical Analysis","Parsing","Syntax Trees","Code Generation","Optimization","Semantic Analysis"]},
  {id:13,name:"Theory of Computation",abbr:"TOC",icon:"🤖",difficulty:"Hard",category:"Advanced",progress:12,questions:130,topics:["Automata","DFA/NFA","Context-Free Grammars","Turing Machines","Decidability","Complexity"]},
];

const QUESTION_POOL = [
  {id:1,subject:"DBMS",topic:"SQL",difficulty:"Medium",type:"mcq",question:"Which SQL clause is used to filter groups based on a condition after GROUP BY?",code:null,options:["WHERE","HAVING","FILTER","SELECT"],correct:1,explanation:"HAVING filters groups after GROUP BY. WHERE filters individual rows before grouping."},
  {id:2,subject:"DSA",topic:"Arrays",difficulty:"Hard",type:"code",question:"What is the time complexity of Kadane's Algorithm for Maximum Subarray Sum?",code:`def kadane(arr):
    max_sum = arr[0]
    current = arr[0]
    for num in arr[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    return max_sum`,options:["O(n²)","O(n log n)","O(n)","O(1)"],correct:2,explanation:"Kadane's traverses the array once making it O(n) time with O(1) space."},
  {id:3,subject:"OS",topic:"Scheduling",difficulty:"Medium",type:"mcq",question:"Which CPU scheduling algorithm can cause starvation of low-priority processes?",code:null,options:["Round Robin","FCFS","Priority Scheduling","SRTF"],correct:2,explanation:"Priority Scheduling can starve low-priority processes if high-priority processes keep arriving."},
  {id:4,subject:"CN",topic:"OSI Model",difficulty:"Easy",type:"mcq",question:"Which OSI layer is responsible for end-to-end error recovery and flow control?",code:null,options:["Network Layer","Session Layer","Transport Layer","Data Link Layer"],correct:2,explanation:"Transport Layer (Layer 4) provides end-to-end reliable data delivery and flow control."},
  {id:5,subject:"OOPS",topic:"Polymorphism",difficulty:"Medium",type:"mcq",question:"Which type of polymorphism is resolved at compile time in Java/C++?",code:null,options:["Runtime Polymorphism","Dynamic Polymorphism","Static Polymorphism","Late Binding"],correct:2,explanation:"Static polymorphism (method overloading) is resolved at compile time; dynamic (overriding) at runtime."},
  {id:6,subject:"DBMS",topic:"Normalization",difficulty:"Hard",type:"mcq",question:"A relation is in 3NF if it is in 2NF and has no:",code:null,options:["Partial dependencies","Transitive dependencies","Multi-valued dependencies","Redundant attributes"],correct:1,explanation:"3NF = 2NF + no transitive dependencies (non-prime attributes depending on other non-prime attributes)."},
  {id:7,subject:"DSA",topic:"Trees",difficulty:"Medium",type:"code",question:"What is the output of inorder traversal on a BST containing [4,2,6,1,3,5,7]?",code:`def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=' ')
        inorder(root.right)`,options:["4 2 6 1 3 5 7","1 2 3 4 5 6 7","4 2 1 3 6 5 7","7 6 5 4 3 2 1"],correct:1,explanation:"Inorder traversal of a BST always produces sorted ascending output."},
  {id:8,subject:"Python",topic:"Decorators",difficulty:"Hard",type:"code",question:"What does this decorator-based code print when greet('Alice') is called?",code:`def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper

@decorator
def greet(name):
    print(f"Hello {name}")

greet("Alice")`,options:["Hello Alice","Before\nHello Alice\nAfter","Before\nAfter","Before\nHello Alice"],correct:1,explanation:"Decorator wraps greet: prints Before → calls greet (Hello Alice) → prints After."},
  {id:9,subject:"OS",topic:"Memory Management",difficulty:"Hard",type:"mcq",question:"What is thrashing in an operating system?",code:null,options:["Excessive CPU usage by one process","High overhead from excessive page faults","Memory overflow error","Cache miss rate exceeds threshold"],correct:1,explanation:"Thrashing = process spends more time on page swapping than actual execution due to too many page faults."},
  {id:10,subject:"SD",topic:"Caching",difficulty:"Hard",type:"mcq",question:"Which caching strategy writes data to cache AND backing store simultaneously?",code:null,options:["Cache-Aside","Write-Through","Write-Back","Read-Through"],correct:1,explanation:"Write-Through writes to both cache and storage simultaneously, ensuring consistency at cost of latency."},
  {id:11,subject:"DSA",topic:"Graphs",difficulty:"Hard",type:"mcq",question:"Which algorithm guarantees the shortest path in an UNWEIGHTED graph?",code:null,options:["DFS","BFS","Dijkstra's","A*"],correct:1,explanation:"BFS explores nodes level by level, guaranteeing shortest path (fewest edges) in unweighted graphs."},
  {id:12,subject:"DBMS",topic:"Transactions",difficulty:"Medium",type:"mcq",question:"What does 'Isolation' in ACID properties ensure?",code:null,options:["Data is never lost","Concurrent transactions don't interfere","Data is always correct","Transactions are fast"],correct:1,explanation:"Isolation ensures concurrent transactions execute independently, as if running serially."},
  {id:13,subject:"WebDev",topic:"JavaScript",difficulty:"Medium",type:"code",question:"What is the output of this JavaScript snippet?",code:`console.log(typeof null);
console.log(null instanceof Object);`,options:["'object'\ntrue","'null'\nfalse","'object'\nfalse","'undefined'\nfalse"],correct:2,explanation:"typeof null = 'object' (historical JS bug). But null instanceof Object = false since null has no prototype."},
  {id:14,subject:"MERN",topic:"React",difficulty:"Medium",type:"mcq",question:"Which React hook is used to perform side effects after rendering?",code:null,options:["useState","useCallback","useEffect","useMemo"],correct:2,explanation:"useEffect runs after every render and is used for data fetching, subscriptions, and DOM manipulation."},
  {id:15,subject:"SE",topic:"Agile",difficulty:"Easy",type:"mcq",question:"What is the typical recommended Sprint length in Scrum?",code:null,options:["1 week","1–4 weeks","1 month","Unlimited"],correct:1,explanation:"Scrum Sprints are 1–4 weeks, with 2 weeks being most common in practice."},
  {id:16,subject:"DS",topic:"ML Basics",difficulty:"Medium",type:"mcq",question:"Which of these is an UNSUPERVISED learning algorithm?",code:null,options:["Linear Regression","K-Means Clustering","Decision Tree","Random Forest"],correct:1,explanation:"K-Means is unsupervised—it finds patterns without labeled data. Others require labeled training sets."},
  {id:17,subject:"TOC",topic:"Automata",difficulty:"Hard",type:"mcq",question:"What is the minimum number of states required in a DFA accepting strings ending in '01'?",code:null,options:["2","3","4","5"],correct:1,explanation:"3 states needed: start state, state after '0', accepting state after '01'."},
  {id:18,subject:"OOPS",topic:"Inheritance",difficulty:"Easy",type:"mcq",question:"The diamond problem in OOP refers to ambiguity arising from:",code:null,options:["Deep inheritance chains","Multiple inheritance of same method via two paths","Overriding too many methods","Circular class dependencies"],correct:1,explanation:"Diamond problem = class C inherits from A and B, both inheriting from D, causing ambiguous method resolution."},
  {id:19,subject:"DSA",topic:"Sorting",difficulty:"Medium",type:"mcq",question:"Which sorting algorithm has O(n log n) guaranteed worst-case complexity?",code:null,options:["Quick Sort","Merge Sort","Bubble Sort","Heap Sort"],correct:1,explanation:"Merge Sort is always O(n log n). Quick Sort can degrade to O(n²) in worst case without randomization."},
  {id:20,subject:"CN",topic:"TCP/IP",difficulty:"Easy",type:"mcq",question:"How many layers does the TCP/IP model have?",code:null,options:["7","4","5","3"],correct:1,explanation:"TCP/IP has 4 layers: Application, Transport, Internet, and Network Access (Link)."},
];

function highlightCode(code) {
  const keywords = ["def ","return ","for ","if ","in ","print","class ","import ","from ","True","False","None","const ","let ","var ","function ","console"];
  let result = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  keywords.forEach(kw => {
    result = result.split(kw.trim()).join(`<span class="kw">${kw.trim()}</span>`);
  });
  result = result.replace(/(["'`])(.*?)\1/g, '<span class="str">$1$2$1</span>');
  result = result.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
  result = result.replace(/#(.*)$/gm, '<span class="cm"># $1</span>');
  return result;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function Badge({type,children}) {
  const cls = {
    Easy:"badge badge-easy",Medium:"badge badge-medium",Hard:"badge badge-hard",
    Core:"badge badge-core",Advanced:"badge badge-advanced",Trending:"badge badge-trending",Popular:"badge badge-popular"
  };
  return <span className={cls[type]||"badge"}>{children}</span>;
}

function Confetti() {
  const pieces = Array.from({length:50}).map((_,i) => ({
    id:i,
    left:`${Math.random()*100}%`,
    delay:`${Math.random()*2}s`,
    dur:`${2.5+Math.random()*2.5}s`,
    color:["#2563EB","#16A34A","#D97706","#7C3AED","#DC2626","#0891B2"][i%6],
    size:`${6+Math.random()*8}px`,
    round:Math.random()>.5,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left:p.left,animationDelay:p.delay,animationDuration:p.dur,
          background:p.color,width:p.size,height:p.size,borderRadius:p.round?"50%":"3px",
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   STAGE 1: TEST CONFIGURATOR
═══════════════════════════════════════ */
function TestConfigurator({onStart}) {
  const [selSubjects,setSelSubjects] = useState([]);
  const [selTopics,setSelTopics] = useState([]);
  const [difficulty,setDifficulty] = useState("All");
  const [mode,setMode] = useState("exam");
  const [qCount,setQCount] = useState(20);
  const [tpq,setTpq] = useState(60);
  const [aiLoading,setAiLoading] = useState(false);

  const allTopics = selSubjects.flatMap(id => SUBJECTS.find(s=>s.id===id)?.topics||[]);
  const uniqueTopics = [...new Set(allTopics)];

  const toggleSubject = id => {
    setSelSubjects(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    setSelTopics([]);
  };
  const toggleTopic = t => setSelTopics(prev=>prev.includes(t)?prev.filter(x=>x!==t):[...prev,t]);
  const selectAllTopics = () => setSelTopics([...uniqueTopics]);
  const clearTopics = () => setSelTopics([]);

  const handleSmartAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      const weak = SUBJECTS.filter(s=>s.progress<30);
      setSelSubjects(weak.map(s=>s.id));
      setSelTopics([]);
      setDifficulty("All");
      setAiLoading(false);
    },1400);
  };

  const canStart = selSubjects.length>0;
  const selSubjectNames = selSubjects.map(id=>SUBJECTS.find(s=>s.id===id)?.abbr).join(", ");

  const handleStart = () => {
    const questions = QUESTION_POOL.filter(q => {
      const subjectMatch = selSubjects.some(id => {
        const sub = SUBJECTS.find(s=>s.id===id);
        return sub && sub.abbr===q.subject;
      });
      const diffMatch = difficulty==="All" || q.difficulty===difficulty;
      const topicMatch = selTopics.length===0 || selTopics.includes(q.topic);
      return subjectMatch && diffMatch && topicMatch;
    }).slice(0,qCount);
    const finalQ = questions.length>0?questions:QUESTION_POOL.slice(0,Math.min(qCount,QUESTION_POOL.length));
    onStart({questions:finalQ,mode,tpq,qCount:finalQ.length});
  };

  return (
    <div style={{background:"var(--bg)",minHeight:"calc(100vh - 60px)"}}>
      <div style={{padding:"20px 28px 8px",maxWidth:"1300px",margin:"0 auto"}}>
        <h1 style={{fontSize:"28px",color:"var(--text)",marginBottom:"4px"}}>🎯 Configure Your Test</h1>
        <p style={{fontSize:"14px",color:"var(--text-3)"}}>Select subjects, topics, and customize your test experience</p>
      </div>
      <div className="config-layout">
        {/* LEFT: Subject Selector */}
        <div className="config-panel">
          <div className="panel-header">
            <h2>📚 Choose Subjects</h2>
            <p>{selSubjects.length} selected · {SUBJECTS.length} available</p>
          </div>
          <div className="subjects-list">
            {SUBJECTS.map(s => (
              <div key={s.id} className={`subject-card ${selSubjects.includes(s.id)?"selected":""}`} onClick={()=>toggleSubject(s.id)}>
                <div className="sc-top">
                  <div className="sc-icon">{s.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="sc-name">{s.name}</div>
                    <div className="sc-abbr">{s.abbr}</div>
                  </div>
                  <div className="sc-right">
                    <span className="sc-progress">{s.progress}%</span>
                    <Badge type={s.difficulty}>{s.difficulty}</Badge>
                  </div>
                </div>
                <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${s.progress}%`}}/></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Configuration */}
        <div className="config-right">
          {/* Topics */}
          <div className="config-section">
            <div className="section-title">Select Topics</div>
            {uniqueTopics.length>0?(
              <>
                <div className="topics-grid">
                  {uniqueTopics.map(t=>(
                    <span key={t} className={`topic-chip ${selTopics.includes(t)?"selected":""}`} onClick={()=>toggleTopic(t)}>{t}</span>
                  ))}
                </div>
                <div className="chips-actions">
                  <button className="link-btn" onClick={selectAllTopics}>Select All</button>
                  <button className="link-btn" onClick={clearTopics}>Clear</button>
                  <span style={{fontSize:"12px",color:"var(--text-3)",marginLeft:"auto"}}>{selTopics.length||"All"} topics selected</span>
                </div>
              </>
            ):(
              <div className="empty-topics">← Select a subject to see topics</div>
            )}
          </div>

          {/* Test Settings */}
          <div className="config-section">
            <div className="section-title">Test Settings</div>
            <div className="config-row">
              <div className="config-label">Number of Questions</div>
              <div className="slider-wrap">
                <input type="range" min="5" max="20" step="1" value={qCount} onChange={e=>setQCount(+e.target.value)}/>
                <span className="slider-val">{qCount}</span>
              </div>
            </div>
            <div className="config-row">
              <div className="config-label">Difficulty Level</div>
              <div className="diff-group">
                {["All","Easy","Medium","Hard"].map(d=>(
                  <button key={d} className={`diff-btn ${difficulty===d?"active":""}`} onClick={()=>setDifficulty(d)}>{d}</button>
                ))}
              </div>
            </div>
            <div className="config-row">
              <div className="config-label">Test Mode</div>
              <div className="mode-toggle">
                <button className={`mode-btn ${mode==="exam"?"active":""}`} onClick={()=>setMode("exam")}>⏱ Exam</button>
                <button className={`mode-btn ${mode==="practice"?"active":""}`} onClick={()=>setMode("practice")}>📖 Practice</button>
              </div>
            </div>
            {mode==="exam"&&(
              <div className="config-row">
                <div className="config-label"><span>Time per Question</span><small>Seconds per question</small></div>
                <select className="time-select" value={tpq} onChange={e=>setTpq(+e.target.value)}>
                  {[30,45,60,90,120].map(t=><option key={t} value={t}>{t}s</option>)}
                </select>
              </div>
            )}
          </div>

          {/* AI Smart Test */}
          <div className="ai-card">
            <div className="ai-card-title">🧠 AI-Powered Weak Spot Test</div>
            <p>Let AI analyze your progress and auto-generate a personalized test targeting your weakest topics (below 30% progress).</p>
            <button className="ai-btn" onClick={handleSmartAI} disabled={aiLoading}>
              {aiLoading?(
                <><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Analyzing progress...</>
              ):(
                <>✨ Generate Smart Test</>
              )}
            </button>
          </div>

          {/* Summary */}
          <div className="summary-card">
            <h3>📋 Test Summary</h3>
            <div className="summary-item"><span className="summary-label">Subjects</span><span className="summary-value">{selSubjects.length>0?selSubjectNames:"None selected"}</span></div>
            <div className="summary-item"><span className="summary-label">Topics</span><span className="summary-value">{selTopics.length>0?selTopics.slice(0,4).join(", ")+(selTopics.length>4?` +${selTopics.length-4} more`:""):"All Topics"}</span></div>
            <div className="summary-item"><span className="summary-label">Questions</span><span className="summary-value">{qCount} questions · {difficulty} difficulty</span></div>
            <div className="summary-item"><span className="summary-label">Mode</span><span className="summary-value">{mode==="exam"?`⏱ Exam Mode (${tpq}s/question)`:"📖 Practice Mode (no timer)"}</span></div>
            {mode==="exam"&&<div className="summary-item"><span className="summary-label">Total Time</span><span className="summary-value">{formatTime(qCount*tpq)}</span></div>}
          </div>

          <button className="start-btn" disabled={!canStart} onClick={handleStart}>
            🚀 Start Test
          </button>
          {!canStart&&<p style={{textAlign:"center",fontSize:"12px",color:"var(--text-3)",marginTop:"6px"}}>Select at least one subject to continue</p>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STAGE 2: TESTING ARENA
═══════════════════════════════════════ */
function TestArena({config,onComplete}) {
  const {questions,mode,tpq,qCount} = config;
  const total = questions.length;
  const [currentQ,setCurrentQ] = useState(0);
  const [answers,setAnswers] = useState({});
  const [marked,setMarked] = useState({});
  const [timeLeft,setTimeLeft] = useState(mode==="exam"?total*tpq:null);
  const [showExp,setShowExp] = useState(false);
  const [showTabWarn,setShowTabWarn] = useState(false);
  const [tabSwitches,setTabSwitches] = useState(0);
  const [showExitModal,setShowExitModal] = useState(false);
  const [showSubmitModal,setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);
  const startTime = useRef(Date.now());

  const q = questions[currentQ];
  const timeWarning = mode==="exam" && timeLeft !== null && timeLeft < total*tpq*0.20 && timeLeft>0;
  const timeDanger = mode==="exam" && timeLeft !== null && timeLeft < total*tpq*0.10;
  const selectedAnswer = answers[currentQ] ?? null;

  // Timer
  useEffect(() => {
    if(mode!=="exam") return;
    timerRef.current = setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev<=1){clearInterval(timerRef.current);handleFinalSubmit();return 0;}
        return prev-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[]);

  // Tab switch
  useEffect(()=>{
    const fn = ()=>{if(document.hidden){setTabSwitches(p=>p+1);setShowTabWarn(true);}};
    document.addEventListener("visibilitychange",fn);
    return ()=>document.removeEventListener("visibilitychange",fn);
  },[]);

  // Right click
  useEffect(()=>{
    const fn=e=>e.preventDefault();
    document.addEventListener("contextmenu",fn);
    return()=>document.removeEventListener("contextmenu",fn);
  },[]);

  // Keyboard shortcuts
  useEffect(()=>{
    const fn=e=>{
      if(showExp&&mode==="practice") return;
      const keyMap={a:0,b:1,c:2,d:3};
      if(keyMap[e.key]!==undefined && answers[currentQ]===undefined) {
        handleSelect(keyMap[e.key]);
      }
      if(e.key==="ArrowRight"||e.key==="n") goNext();
      if(e.key==="ArrowLeft"||e.key==="p") goPrev();
      if(e.key==="m") toggleMark();
    };
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[currentQ,answers,showExp]);

  const handleSelect = i => {
    if(answers[currentQ]!==undefined) return;
    setAnswers(p=>({...p,[currentQ]:i}));
    if(mode==="practice") setShowExp(true);
  };

  const goNext = () => {
    if(currentQ<total-1){setCurrentQ(p=>p+1);setShowExp(false);}
  };
  const goPrev = () => {
    if(currentQ>0){setCurrentQ(p=>p-1);setShowExp(false);}
  };
  const toggleMark = () => setMarked(p=>({...p,[currentQ]:!p[currentQ]}));

  const handleFinalSubmit = () => {
    const timeTaken = Math.floor((Date.now()-startTime.current)/1000);
    onComplete({questions,answers,timeTaken});
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const progress = Math.round((currentQ+1)/total*100);

  const getPaletteClass = i => {
    if(i===currentQ) return "current";
    if(answers[i]!==undefined&&marked[i]) return "answered-marked";
    if(answers[i]!==undefined) return "answered";
    if(marked[i]) return "marked";
    return "not-visited";
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      {/* Header */}
      <header className="arena-header">
        <div className="arena-brand">⚡</div>
        <div className="arena-breadcrumb">Subjects › {q.subject} › {q.topic}</div>
        <div className="arena-progress-wrap">
          <div className="arena-progress-bar"><div className="arena-progress-fill" style={{width:`${progress}%`}}/></div>
          <div className="arena-q-count">{currentQ+1}/{total}</div>
        </div>
        {mode==="exam"?(
          <div className={`arena-timer ${timeDanger?"danger":timeWarning?"warning":""}`}>⏱ {formatTime(timeLeft)}</div>
        ):(
          <div className="practice-badge">📖 Practice Mode</div>
        )}
        <button className="arena-exit" onClick={()=>setShowExitModal(true)}>✕ Exit</button>
      </header>

      <div className="arena-layout">
        {/* Question Canvas */}
        <div className="question-canvas">
          <div className="q-meta">
            <span className="q-num">Q {currentQ+1}</span>
            <span className="q-topic-chip">{q.subject} › {q.topic}</span>
            <span className={`q-diff-chip q-diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
            {q.type==="code"&&<span className="q-type-chip">💻 Code</span>}
          </div>
          <div className="question-card">
            <div className="question-text">{q.question}</div>
            {q.code&&(
              <pre className="code-block" dangerouslySetInnerHTML={{__html:highlightCode(q.code)}}/>
            )}
          </div>
          <div className="options-grid">
            {q.options.map((opt,i)=>{
              let cls = "option-card";
              const isAnswered = selectedAnswer!==null || showExp;
              if(isAnswered){
                if(i===q.correct) cls+=" correct";
                else if(i===selectedAnswer&&i!==q.correct) cls+=" wrong";
                else cls+=" disabled";
              }else if(selectedAnswer===i) cls+=" selected";
              return (
                <div key={i} className={cls} onClick={()=>handleSelect(i)}>
                  <div className="option-letter">{["A","B","C","D"][i]}</div>
                  <div className="option-text">{opt}</div>
                  {isAnswered&&i===q.correct&&<span className="option-indicator">✅</span>}
                  {isAnswered&&i===selectedAnswer&&i!==q.correct&&<span className="option-indicator">❌</span>}
                </div>
              );
            })}
          </div>
          <div className="shortcut-hint">Keyboard: A·B·C·D to select · ← → to navigate · M to mark</div>
          {showExp&&mode==="practice"&&selectedAnswer!==null&&(
            <div className="explanation-panel">
              <div className={`exp-header ${selectedAnswer===q.correct?"correct":"wrong"}`}>
                {selectedAnswer===q.correct?"🎉 Correct! Well done!":"❌ Incorrect — Here's why:"}
              </div>
              <div className="exp-text">{q.explanation}</div>
              {currentQ<total-1?(
                <button className="next-practice-btn" onClick={goNext}>Next Question →</button>
              ):(
                <button className="next-practice-btn" onClick={()=>setShowSubmitModal(true)}>Submit Test 🏁</button>
              )}
            </div>
          )}
        </div>

        {/* Right Palette */}
        <aside className="palette">
          <h3>Navigator</h3>
          <div className="palette-grid">
            {questions.map((_,i)=>(
              <button key={i} className={`p-btn ${getPaletteClass(i)}`} onClick={()=>{setCurrentQ(i);setShowExp(false);}}>{i+1}</button>
            ))}
          </div>
          <div className="palette-legend">
            {[["answered","Answered"],["marked","Marked"],["not-visited","Not Visited"],["current","Current"]].map(([c,l])=>(
              <div key={c} className="legend-item"><span className={`legend-dot ${c}`}/>{l}</div>
            ))}
          </div>
          <div className="palette-stats">
            <div className="palette-stat"><span>✅ Answered</span><span>{answeredCount}</span></div>
            <div className="palette-stat"><span>🔖 Marked</span><span>{markedCount}</span></div>
            <div className="palette-stat"><span>⚪ Remaining</span><span>{total-answeredCount}</span></div>
          </div>
          <button className="submit-test-btn" onClick={()=>setShowSubmitModal(true)}>🏁 Submit Test</button>
        </aside>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <button className={`mark-btn ${marked[currentQ]?"marked":""}`} onClick={toggleMark}>
          🔖 <span className="mark-text">{marked[currentQ]?"Unmark":"Mark Review"}</span>
        </button>
        <div className="nav-btns">
          <button className="prev-btn" onClick={goPrev} disabled={currentQ===0}>← Prev</button>
          <button className="next-btn" onClick={currentQ===total-1?()=>setShowSubmitModal(true):goNext}>
            {currentQ===total-1?"Submit 🏁":"Next →"}
          </button>
        </div>
        <div className="q-indicator-bottom">{currentQ+1} / {total}</div>
      </div>

      {/* Tab Warning Modal */}
      {showTabWarn&&(
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>
            <h3>Tab Switch Detected!</h3>
            <p>You've switched tabs {tabSwitches} time(s). In a real interview exam this would be flagged as suspicious activity.</p>
            <div className="modal-actions">
              <button className="btn-primary-modal" onClick={()=>setShowTabWarn(false)}>Resume Test</button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal&&(
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-icon">🚪</div>
            <h3>Exit Test?</h3>
            <p>Your progress will be lost. Are you sure you want to exit?</p>
            <div className="modal-actions">
              <button className="btn-secondary-modal" onClick={()=>setShowExitModal(false)}>Continue Test</button>
              <button className="btn-danger-modal" onClick={()=>onComplete(null)}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirm Modal */}
      {showSubmitModal&&(
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-icon">🏁</div>
            <h3>Submit Test?</h3>
            <p>You've answered {answeredCount} of {total} questions. {total-answeredCount>0?`${total-answeredCount} questions are unattempted.`:""} Submit now?</p>
            <div className="modal-actions">
              <button className="btn-secondary-modal" onClick={()=>setShowSubmitModal(false)}>Review More</button>
              <button className="btn-primary-modal" onClick={handleFinalSubmit}>Submit ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   STAGE 3: MASTERY REPORT
═══════════════════════════════════════ */
function MasteryReport({data,onRetake,onPracticeWeak}) {
  const {questions,answers,timeTaken} = data;
  const [expandedQ,setExpandedQ] = useState({});
  const [showConfetti,setShowConfetti] = useState(false);

  const results = questions.map((q,i)=>({
    q,idx:i,
    userAnswer:answers[i]??-1,
    isCorrect:answers[i]===q.correct,
  }));
  const score = results.filter(r=>r.isCorrect).length;
  const total = results.length;
  const pct = Math.round(score/total*100);
  const attempted = Object.keys(answers).length;

  useEffect(()=>{if(pct>=70)setShowConfetti(true);},[]);

  const topicStats = {};
  results.forEach(r=>{
    const t=r.q.topic;
    if(!topicStats[t]) topicStats[t]={correct:0,total:0,subject:r.q.subject};
    topicStats[t].total++;
    if(r.isCorrect) topicStats[t].correct++;
  });

  const heroClass = pct>=80?"excellent":pct>=50?"good":"poor";
  const heroMsg = pct>=80?"🏆 Outstanding!":pct>=50?"💪 Good Effort!":"📚 Keep Practicing!";
  const heroSub = pct>=80?"You're interview-ready! Excellent performance across topics.":pct>=50?"Solid attempt. Review weak areas and you'll ace it!":"Don't give up — review fundamentals and try again!";

  const circumference = 2*Math.PI*45;
  const offset = circumference - (pct/100)*circumference;

  const generateInsight = () => {
    const weak = Object.entries(topicStats).filter(([,s])=>s.correct/s.total<0.5).map(([t])=>t);
    const strong = Object.entries(topicStats).filter(([,s])=>s.correct/s.total>=0.8).map(([t])=>t);
    if(pct>=80) return `Excellent work! Your strongest areas are ${strong.slice(0,2).join(" and ")||"all topics"}. ${weak.length>0?`Focus next on: ${weak.join(", ")} to reach mastery.`:"You've mastered all covered topics!"}`;
    if(pct>=50) return `Good attempt! ${strong.length>0?`You performed well in ${strong.slice(0,2).join(", ")}.`:""} Spend more time on ${weak.slice(0,3).join(", ")||"weak areas"} — revisit the fundamentals and attempt practice tests.`;
    return `Don't be discouraged! Focus on rebuilding ${weak.slice(0,3).join(", ")||"core concepts"} from scratch. Start with easy questions and build confidence gradually.`;
  };

  const weakTopics = Object.entries(topicStats).filter(([,s])=>s.correct/s.total<0.5).map(([t])=>t);

  return (
    <div style={{background:"var(--bg)",minHeight:"calc(100vh - 60px)"}}>
      {showConfetti&&<Confetti/>}
      <div className="report-page animate-up">
        {/* Hero */}
        <div className={`report-hero ${heroClass}`}>
          <div className="score-circle-wrap">
            <svg width="130" height="130" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="score-ring-bg"/>
              <circle cx="50" cy="50" r="45" className="score-ring-fill"
                stroke={pct>=80?"#16A34A":pct>=50?"#2563EB":"#D97706"}
                strokeDasharray={`${circumference}`}
                strokeDashoffset={offset}
                style={{transition:"stroke-dashoffset 1.2s ease"}}
                fill="none" strokeLinecap="round"/>
            </svg>
            <div className="score-center">
              <div className="score-num">{score}/{total}</div>
              <div className="score-denom">{pct}%</div>
            </div>
          </div>
          <div className="hero-text">
            <h2>{heroMsg}</h2>
            <div className="tagline">{heroSub}</div>
            <div className="hero-pills">
              <span className="hero-pill">✅ {score} Correct</span>
              <span className="hero-pill">❌ {total-score} Wrong</span>
              <span className="hero-pill">📝 {attempted} Attempted</span>
              <span className="hero-pill">⏱ {formatTime(timeTaken)}</span>
            </div>
          </div>
        </div>

        {/* Topic Heatmap */}
        <div className="report-section">
          <div className="report-section-title">📊 Topic Breakdown</div>
          <div className="heatmap-grid">
            {Object.entries(topicStats).map(([topic,stats])=>{
              const p=Math.round(stats.correct/stats.total*100);
              const lvl=p>=80?"master":p>=50?"good":"weak";
              return (
                <div key={topic} className={`heat-card ${lvl}`}>
                  <div className="heat-topic">{topic}</div>
                  <div className="heat-subject">{stats.subject}</div>
                  <div className="heat-score-row">
                    <span className="heat-pct">{p}%</span>
                    <span style={{fontSize:"12px",color:"var(--text-3)"}}>{stats.correct}/{stats.total}</span>
                  </div>
                  <div className="heat-bar"><div className="heat-fill" style={{width:`${p}%`}}/></div>
                  <div className="heat-label">{lvl==="master"?"🔥 Master":lvl==="good"?"👍 Good":"📚 Needs Work"}</div>
                  {lvl==="weak"&&(
                    <div className="practice-link-btn" onClick={()=>onPracticeWeak(topic)}>Practice This →</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div className="report-section">
          <div className="ai-insight-card">
            <div className="ai-title">🧠 AI Performance Insight</div>
            <div className="ai-text">{generateInsight()}</div>
            {weakTopics.length>0&&(
              <>
                <div style={{fontSize:"13px",fontWeight:"700",color:"var(--text-2)",marginBottom:"10px"}}>📌 Recommended Practice:</div>
                <div className="rec-chips">
                  {weakTopics.map(t=>(
                    <div key={t} className="rec-chip">
                      📚 {t}
                      <button className="rec-practice-btn" onClick={()=>onPracticeWeak(t)}>Practice →</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Question Review */}
        <div className="report-section">
          <div className="report-section-title">📝 Question Review</div>
          {results.map((r,i)=>(
            <div key={i} className={`review-card ${r.isCorrect?"correct":"wrong"}`}>
              <div className="review-header" onClick={()=>setExpandedQ(p=>({...p,[i]:!p[i]}))}>
                <span className="review-qnum">Q{i+1}</span>
                <span className="review-qtopic">{r.q.subject} › {r.q.topic}</span>
                <Badge type={r.q.difficulty}>{r.q.difficulty}</Badge>
                <span className="review-qstatus">{r.isCorrect?"✅":"❌"}</span>
                <span className="review-chevron">{expandedQ[i]?"▲":"▼"}</span>
              </div>
              {expandedQ[i]&&(
                <div className="review-body">
                  <div className="review-qtext">{r.q.question}</div>
                  {r.q.code&&<pre className="code-block" style={{marginBottom:"12px"}} dangerouslySetInnerHTML={{__html:highlightCode(r.q.code)}}/>}
                  <div className="review-options">
                    {r.q.options.map((opt,j)=>{
                      let cls="review-opt";
                      if(j===r.q.correct) cls+=" correct";
                      else if(j===r.userAnswer&&j!==r.q.correct) cls+=" wrong";
                      return (
                        <div key={j} className={cls}>
                          <span style={{fontWeight:"700",minWidth:"16px"}}>{"ABCD"[j]}.</span>
                          <span style={{flex:1}}>{opt}</span>
                          {j===r.q.correct&&<span className="opt-tag">✓ Correct</span>}
                          {j===r.userAnswer&&j!==r.q.correct&&<span className="opt-tag">✗ Yours</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="review-exp"><strong>💡 Explanation: </strong>{r.q.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="report-actions">
          <button className="btn-secondary-rep" onClick={onRetake}>🔄 Retake Test</button>
          {weakTopics.length>0&&<button className="btn-primary-rep" onClick={()=>onPracticeWeak(weakTopics[0])}>📚 Practice Weak Topics</button>}
          <button className="btn-outline-rep" onClick={onRetake}>🏠 New Test</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
export default function TestPage() {
  const [stage,setStage] = useState("configurator");
  const [testConfig,setTestConfig] = useState(null);
  const [testResult,setTestResult] = useState(null);

  const handleStart = config => {
    setTestConfig(config);
    setStage("arena");
  };

  const handleComplete = result => {
    if(!result){setStage("configurator");return;}
    setTestResult(result);
    setStage("report");
  };

  const handleRetake = () => {
    setTestResult(null);
    setTestConfig(null);
    setStage("configurator");
  };

  const handlePracticeWeak = topic => {
    setTestResult(null);
    setTestConfig(null);
    setStage("configurator");
  };

  return (
    <div className="test-page-container">
      <style>{STYLES}</style>
      {stage!=="arena"&&<Navbar stage={stage}/>}
      {stage==="configurator"&&<TestConfigurator onStart={handleStart}/>}
      {stage==="arena"&&testConfig&&<TestArena config={testConfig} onComplete={handleComplete}/>}
      {stage==="report"&&testResult&&(
        <>
          <Navbar stage={stage}/>
          <MasteryReport data={testResult} onRetake={handleRetake} onPracticeWeak={handlePracticeWeak}/>
        </>
      )}
    </div>
  );
}
