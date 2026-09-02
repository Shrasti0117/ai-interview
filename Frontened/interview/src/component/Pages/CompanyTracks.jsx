import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, ChevronRight, ChevronLeft, Clock, Award, CheckCircle2, Code2,
  Users, Brain, ArrowLeft, Play, X, Timer, Target, TrendingUp, FileText,
  ListChecks, BarChart3, Sparkles, Flag, RotateCcw,
} from "lucide-react";
import "./CompanyTracks.css";

const COMPANIES = [
  { id: "amazon", name: "Amazon", category: "product", roles: ["SDE-1", "SDE-2"], mockTests: 12, questions: 520, initial: "A", color: "orange" },
  { id: "tcs", name: "TCS NQT", category: "service", roles: ["System Engineer", "Ninja"], mockTests: 8, questions: 340, initial: "T", color: "blue" },
  { id: "infosys", name: "Infosys", category: "service", roles: ["Digital Specialist", "SE"], mockTests: 9, questions: 410, initial: "I", color: "indigo" },
  { id: "google", name: "Google", category: "product", roles: ["SWE", "APM"], mockTests: 6, questions: 280, initial: "G", color: "green" },
  { id: "microsoft", name: "Microsoft", category: "product", roles: ["SDE"], mockTests: 7, questions: 300, initial: "M", color: "sky" },
  { id: "zoho", name: "Zoho", category: "startup", roles: ["Trainee Engineer"], mockTests: 5, questions: 180, initial: "Z", color: "rose" },
  { id: "wipro", name: "Wipro", category: "service", roles: ["Project Engineer"], mockTests: 6, questions: 220, initial: "W", color: "purple" },
  { id: "flipkart", name: "Flipkart", category: "startup", roles: ["SDE-1"], mockTests: 5, questions: 200, initial: "F", color: "amber" },
];

const CATEGORIES = [
  ["all", "All"], ["product", "Product-Based"], ["service", "Service-Based"], ["startup", "Startups"],
];

const PRACTICE_TOPICS = [
  ["dsa", "Data Structures & Algorithms", 140, Code2],
  ["core", "Core CS (OS, DBMS, CN)", 96, Brain],
  ["apti", "Aptitude & Reasoning", 80, Target],
  ["hr", "HR & Behavioral", 44, Users],
];

const MOCK_TESTS = [
  { id: "full-sde", label: "Full SDE Mock Assessment", sections: 3, duration: 60, difficulty: "Advanced", questionsCount: 5 },
  { id: "coding-round", label: "Coding Round Simulator", sections: 2, duration: 45, difficulty: "Intermediate", questionsCount: 4 },
  { id: "aptitude-round", label: "Aptitude Screening Test", sections: 1, duration: 20, difficulty: "Beginner", questionsCount: 5 },
];

const QUESTION_BANK = [
  { id: 1, type: "mcq", section: "Aptitude", prompt: "A train 120m long crosses a pole in 6 seconds. What is its speed?", options: ["20 m/s", "72 km/h", "18 km/h", "None"], correct: 1 },
  { id: 2, type: "mcq", section: "Core CS", prompt: "Which scheduling algorithm can cause starvation?", options: ["Round Robin", "FCFS", "Priority Scheduling", "SJF (non-preemptive, fair queue)"], correct: 2 },
  { id: 3, type: "code", section: "DSA", prompt: "Given an array of integers, return the two indices whose values add up to a target sum.", constraints: ["1 ≤ n ≤ 10^5", "Exactly one valid answer exists", "Return 0-indexed positions"], sample: { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }, starter: "function twoSum(nums, target) {\n  // your code here\n}" },
  { id: 4, type: "mcq", section: "DBMS", prompt: "Which normal form removes transitive dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 2 },
  { id: 5, type: "mcq", section: "Networks", prompt: "Which layer of the OSI model handles routing?", options: ["Data Link", "Network", "Transport", "Session"], correct: 1 },
];

function Pill({ active, children, onClick }) {
  return <button className={`company-pill ${active ? "is-active" : ""}`} onClick={onClick}>{children}</button>;
}

function CompanyCard({ company, onSelect }) {
  return (
    <article className="company-card">
      <div className="company-card-top">
        <div className={`company-mark company-${company.color}`}>{company.initial}</div>
        <span className={`company-category category-${company.color}`}>{company.category}</span>
      </div>
      <h2>{company.name}</h2>
      <p>{company.roles.join(" · ")}</p>
      <div className="company-stats">
        <div><FileText /><strong>{company.mockTests}</strong><span>Company Mock Tests</span></div>
        <div><ListChecks /><strong>{company.questions}+</strong><span>Tagged Questions</span></div>
      </div>
      <div className="company-actions">
        <button className="button button-outline" onClick={() => onSelect(company, "practice")}>Explore Questions</button>
        <button className="button button-primary" onClick={() => onSelect(company, "mocks")}>Start Mock</button>
      </div>
    </article>
  );
}

function HubView({ onSelectCompany }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => COMPANIES.filter((company) =>
    (category === "all" || company.category === category) && company.name.toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  return <>
    <section className="tracks-hero"><div className="tracks-container">
      <div className="eyebrow"><Sparkles /> Company Tracks</div>
      <h1>Practice for the company that's <em>actually hiring you</em></h1>
      <p>Real hiring patterns, tagged past questions, and timed mock assessments built around each company's actual interview process.</p>
      <label className="company-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by company (e.g., Amazon, TCS, Infosys)" /></label>
      <div className="company-pills">{CATEGORIES.map(([id, label]) => <Pill key={id} active={category === id} onClick={() => setCategory(id)}>{label}</Pill>)}</div>
    </div></section>
    <main className="tracks-container company-grid">
      {filtered.length ? filtered.map((company) => <CompanyCard key={company.id} company={company} onSelect={onSelectCompany} />) : <div className="empty-state">No companies match "{query}". Try a different search.</div>}
    </main>
  </>;
}

function DetailView({ company, initialTab, onBack, onStartTest }) {
  const [tab, setTab] = useState(initialTab || "practice");
  const [configTest, setConfigTest] = useState(null);
  const [difficulty, setDifficulty] = useState("Intermediate");
  return <>
    <section className={`track-banner banner-${company.color}`}><div className="tracks-container">
      <button className="back-link" onClick={onBack}><ArrowLeft /> All companies</button>
      <div className="track-title"><div className="company-mark">{company.initial}</div><div><h1>{company.name} Interview Track</h1><p>{company.roles.join(" · ")}</p></div></div>
      <div className="track-stats">{[[ListChecks, "3", "Rounds"], [Clock, "60 min", "Avg. Duration"], [Award, "65%", "Passing Score"], [TrendingUp, "1,240+", "Hired last 6mo"]].map(([Icon, value, label]) => <div key={label}><Icon /><strong>{value}</strong><span>{label}</span></div>)}</div>
    </div></section>
    <main className="tracks-container detail-content">
      <div className="detail-tabs"><button className={tab === "practice" ? "active" : ""} onClick={() => setTab("practice")}>Practice Questions</button><button className={tab === "mocks" ? "active" : ""} onClick={() => setTab("mocks")}>Full Mock Assessments</button></div>
      {tab === "practice" ? <div className="topic-grid">{PRACTICE_TOPICS.map(([id, label, count, Icon]) => <button className="topic-card" key={id}><span className={`topic-icon category-${company.color}`}><Icon /></span><span><strong>{label}</strong><small>{count} questions asked previously</small></span><ChevronRight /></button>)}</div> : <div className="mock-list">{MOCK_TESTS.map((test) => <div className="mock-card" key={test.id}><div><strong>{test.label}</strong><div className="mock-meta"><span><Clock /> {test.duration} min</span><span><ListChecks /> {test.sections} sections</span><b>{test.difficulty}</b></div></div><button className="button button-primary" onClick={() => { setConfigTest(test); setDifficulty(test.difficulty); }}><Play /> Configure & Start</button></div>)}</div>}
    </main>
    {configTest && <div className="modal-backdrop"><div className="configure-modal"><header><div><h2>Configure test</h2><p>{configTest.label}</p></div><button className="icon-button" onClick={() => setConfigTest(null)}><X /></button></header><div className="config-row"><small>Duration</small><strong><Timer /> {configTest.duration} minutes · {configTest.sections} sections</strong></div><div className="config-row"><small>Difficulty</small><div className="difficulty-options">{["Beginner", "Intermediate", "Advanced"].map((level) => <button key={level} className={difficulty === level ? "active" : ""} onClick={() => setDifficulty(level)}>{level}</button>)}</div></div><button className="button button-primary begin-button" onClick={() => onStartTest(configTest, difficulty)}><Play /> Begin Assessment</button></div></div>}
  </>;
}

function AssessmentView({ company, test, onSubmit, onExit }) {
  const questions = QUESTION_BANK.slice(0, test.questionsCount);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(test.duration * 60);
  const submittedRef = useRef(false);
  const handleSubmit = () => { if (!submittedRef.current) { submittedRef.current = true; onSubmit(questions, answers); } };
  useEffect(() => { if (secondsLeft <= 0) { handleSubmit(); return undefined; } const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000); return () => clearTimeout(timer); });
  const question = questions[index];
  const answeredCount = Object.keys(answers).length;
  return <div className="assessment"><header className="assessment-header"><button className="icon-button" onClick={onExit}><X /></button><strong>{company.name} · {test.label}</strong><div className={`timer ${secondsLeft < 60 ? "urgent" : ""}`}><Clock /> {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}</div><button className="button button-primary" onClick={handleSubmit}>Submit Test</button></header><div className="assessment-layout"><section className="question-panel"><div className="question-meta"><span>{question.section}</span><button className={flagged[question.id] ? "flagged" : ""} onClick={() => setFlagged((value) => ({ ...value, [question.id]: !value[question.id] }))}><Flag /> {flagged[question.id] ? "Flagged" : "Flag"}</button></div><h2>{question.prompt}</h2>{question.type === "code" && <div className="question-info"><strong>Constraints</strong><ul>{question.constraints.map((item) => <li key={item}>{item}</li>)}</ul><strong>Sample</strong><code>Input: {question.sample.input}<br />Output: {question.sample.output}</code></div>}{question.type === "mcq" ? <div className="options">{question.options.map((option, optionIndex) => <button key={option} className={answers[question.id] === optionIndex ? "selected" : ""} onClick={() => setAnswers((value) => ({ ...value, [question.id]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div> : <textarea defaultValue={question.starter} onChange={(event) => setAnswers((value) => ({ ...value, [question.id]: event.target.value }))} spellCheck={false} /> }<div className="question-navigation"><button disabled={!index} onClick={() => setIndex((value) => value - 1)}><ChevronLeft /> Previous</button><button className="button button-dark" onClick={() => index === questions.length - 1 ? handleSubmit() : setIndex((value) => value + 1)}>{index === questions.length - 1 ? "Finish" : "Next"}<ChevronRight /></button></div></section><aside className="progress-panel"><strong>Progress</strong><small>{answeredCount} / {questions.length} answered</small><div className="question-map">{questions.map((item, itemIndex) => <button key={item.id} className={`${itemIndex === index ? "current" : ""} ${answers[item.id] !== undefined ? "answered" : ""} ${flagged[item.id] ? "flagged" : ""}`} onClick={() => setIndex(itemIndex)}>{itemIndex + 1}</button>)}</div></aside></div></div>;
}

function ReportView({ company, test, questions, answers, onBackToDetail, onBackToHub }) {
  const results = questions.map((question) => ({ ...question, correctAnswer: question.type === "mcq" ? answers[question.id] === question.correct : answers[question.id] ? true : null }));
  const scored = results.filter((result) => result.type === "mcq");
  const correctCount = scored.filter((result) => result.correctAnswer).length;
  const scorePct = scored.length ? Math.round((correctCount / scored.length) * 100) : 0;
  const sections = results.reduce((all, result) => { all[result.section] = all[result.section] || { total: 0, correct: 0 }; all[result.section].total += 1; if (result.correctAnswer) all[result.section].correct += 1; return all; }, {});
  return <main className="report-page"><div className="report-card report-summary"><Award /><h1>Assessment complete</h1><p>{company.name} · {test.label}</p><strong>{scorePct}%</strong><span>{correctCount} of {scored.length} scored questions correct</span></div><div className="report-card"><h2><BarChart3 /> Section-wise breakdown</h2>{Object.entries(sections).map(([section, value]) => <div className="section-result" key={section}><div><span>{section}</span><b>{value.correct}/{value.total}</b></div><div className="progress-bar"><i style={{ width: `${Math.round((value.correct / value.total) * 100)}%` }} /></div></div>)}</div><div className="report-card"><h2>AI diagnostic notes</h2><ul className="diagnostic-list"><li><CheckCircle2 /> Strong grasp of core CS fundamentals.</li><li><Target /> Revisit array and two-pointer patterns before the real {company.name} round.</li><li><TrendingUp /> Pace was good across the assessment.</li></ul></div><div className="report-actions"><button className="button button-outline" onClick={onBackToDetail}><RotateCcw /> Try another test</button><button className="button button-primary" onClick={onBackToHub}>Back to Company Tracks</button></div></main>;
}

export default function CompanyTracks() {
  const [view, setView] = useState("hub");
  const [company, setCompany] = useState(null);
  const [detailTab, setDetailTab] = useState("practice");
  const [activeTest, setActiveTest] = useState(null);
  const [reportData, setReportData] = useState(null);
  const goHub = () => { setView("hub"); setCompany(null); };
  const selectCompany = (selectedCompany, tab) => { setCompany(selectedCompany); setDetailTab(tab); setView("detail"); };
  const startTest = (test) => { setActiveTest(test); setView("assessment"); };
  const submitTest = (questions, answers) => { setReportData({ questions, answers }); setView("report"); };
  return <div className="company-tracks-app">{view !== "assessment" && <div className="tracks-breadcrumb"><div className="tracks-container"><button onClick={goHub}>Company Tracks</button>{company && view !== "hub" && <><ChevronRight /><span>{company.name}</span></>}{view === "report" && <><ChevronRight /><span>Report</span></>}</div></div>}{view === "hub" && <HubView onSelectCompany={selectCompany} />}{view === "detail" && company && <DetailView company={company} initialTab={detailTab} onBack={goHub} onStartTest={startTest} />}{view === "assessment" && company && activeTest && <AssessmentView company={company} test={activeTest} onSubmit={submitTest} onExit={() => setView("detail")} />}{view === "report" && company && activeTest && reportData && <ReportView company={company} test={activeTest} questions={reportData.questions} answers={reportData.answers} onBackToDetail={() => setView("detail")} onBackToHub={goHub} />}</div>;
}
