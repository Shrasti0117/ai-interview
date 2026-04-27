import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * TECHNICAL ROUND PAGE - InterviewAce
 * A comprehensive, state-machine driven interview preparation component.
 */

// --- DATA: SUBJECTS ---
const SUBJECTS = [
  { id: 'dsa', name: 'Data Structures & Algorithms', short: 'DSA', icon: '⚡', difficulty: 'Hard', type: 'Core', progress: 50, color: '#3b82f6' },
  { id: 'dbms', name: 'Database Management Systems', short: 'DBMS', icon: '🗄️', difficulty: 'Medium', type: 'Core', progress: 35, color: '#10b981' },
  { id: 'os', name: 'Operating Systems', short: 'OS', icon: '⚙️', difficulty: 'Hard', type: 'Core', progress: 20, color: '#7c3aed' },
  { id: 'cn', name: 'Computer Networks', short: 'CN', icon: '🌐', difficulty: 'Medium', type: 'Core', progress: 15, color: '#ef4444' },
  { id: 'se', name: 'Software Engineering', short: 'SE', icon: '📐', difficulty: 'Easy', type: 'Core', progress: 40, color: '#06b6d4' },
  { id: 'sd', name: 'System Design', short: 'SD', icon: '🏗️', difficulty: 'Hard', type: 'Core', progress: 5, color: '#f59e0b' },
  { id: 'oops', name: 'Object-Oriented Programming', short: 'OOPS', icon: '🧩', difficulty: 'Medium', type: 'Core', progress: 30, color: '#ec4899' },
  { id: 'web', name: 'Web Development', short: 'WebDev', icon: '🌍', difficulty: 'Easy', type: 'Spec', progress: 60, color: '#6366f1' },
  { id: 'mern', name: 'Full Stack (MERN)', short: 'MERN', icon: '🔄', difficulty: 'Medium', type: 'Spec', progress: 25, color: '#8b5cf6' },
  { id: 'python', name: 'Python Programming', short: 'Python', icon: '🐍', difficulty: 'Easy', type: 'Spec', progress: 70, color: '#14b8a6' },
  { id: 'ds', name: 'Data Science', short: 'DS', icon: '📊', difficulty: 'Medium', type: 'Spec', progress: 10, color: '#f43f5e' },
  { id: 'cd', name: 'Compiler Design', short: 'CD', icon: '🔧', difficulty: 'Hard', type: 'Spec', progress: 0, color: '#4b5563' },
  { id: 'toc', name: 'Theory of Computation', short: 'TOC', icon: '🤖', difficulty: 'Hard', type: 'Spec', progress: 0, color: '#1e293b' },
];

// --- DATA: QUESTION BANK ---
const QUESTION_BANK = {
  dsa: {
    mcq: [
      { q: "What is the time complexity of searching an element in a balanced BST?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: 1, explanation: "In a balanced Binary Search Tree, the height is log n, so searching takes O(log n) time." },
      { q: "Which data structure is typically used for implementing BFS?", options: ["Stack", "Queue", "Priority Queue", "Linked List"], correct: 1, explanation: "Breadth-First Search uses a Queue (FIFO) to explore nodes level by level." },
      { q: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], correct: 1, explanation: "QuickSort's worst case is O(n^2) when the pivot is consistently the smallest or largest element." },
      { q: "Is MergeSort a stable sorting algorithm?", options: ["Yes", "No", "Only for small arrays", "Depends on implementation"], correct: 0, explanation: "Yes, MergeSort is stable as it preserves the relative order of equal elements." },
      { q: "What is the result of an inorder traversal of a BST?", options: ["Descending order", "Ascending order", "Random order", "Root first"], correct: 1, explanation: "Inorder traversal of a BST always yields elements in non-decreasing (ascending) order." }
    ],
    coding: [{ q: "Write a function to reverse a linked list.", starter: "def reverse_linked_list(head):\n    # Write your code here\n    pass", hint: "Use three pointers: prev, curr, and next." }],
    conceptual: [{ q: "Explain the difference between a Hash Table and a BST.", hint: "Think about time complexities, ordering, and memory usage." }]
  },
  dbms: {
    mcq: [
      { q: "A relation is in 3NF if it is in 2NF and has no:", options: ["Partial dependencies", "Transitive dependencies", "Multivalued dependencies", "Join dependencies"], correct: 1, explanation: "3NF removes transitive dependencies where a non-prime attribute depends on another non-prime attribute." },
      { q: "What does the 'I' in ACID stand for?", options: ["Integrity", "Isolation", "Index", "Idempotency"], correct: 1, explanation: "Isolation ensures that concurrent transactions do not interfere with each other." },
      { q: "Which join returns all records when there is a match in either left or right table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correct: 3, explanation: "FULL OUTER JOIN returns all records from both tables, filling with NULL where matches are missing." },
      { q: "Why are B+ Trees preferred over B-Trees for database indexing?", options: ["Faster single searches", "Range queries are more efficient", "Use less memory", "Simpler to implement"], correct: 1, explanation: "B+ Trees store all data in leaf nodes which are linked, making range scans very fast." },
      { q: "Which isolation level prevents 'Dirty Reads' but allows 'Non-repeatable Reads'?", options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"], correct: 1, explanation: "Read Committed ensures only committed data is read, preventing dirty reads." }
    ],
    coding: [{ q: "Write a SQL query to find the second highest salary from an Employee table.", starter: "SELECT MAX(Salary) FROM Employee \nWHERE Salary < (SELECT MAX(Salary) FROM Employee);", hint: "You can use a subquery or the OFFSET clause." }],
    conceptual: [{ q: "Explain the concept of Normalization and its benefits.", hint: "Mention data redundancy, anomalies (Insert, Update, Delete), and data integrity." }]
  },
  os: {
    mcq: [
      { q: "Which CPU scheduling algorithm can suffer from Belady's Anomaly?", options: ["LRU", "Optimal", "FIFO", "SJF"], correct: 2, explanation: "FIFO (First-In-First-Out) page replacement can result in more page faults even when page frames increase." },
      { q: "Which of these is NOT a necessary condition for a Deadlock?", options: ["Mutual Exclusion", "No Preemption", "Circular Wait", "Preemption"], correct: 3, explanation: "The four conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait." },
      { q: "Shortest Remaining Time First (SRTF) is a preemptive version of:", options: ["FIFO", "SJF", "Round Robin", "Priority Scheduling"], correct: 1, explanation: "SRTF preempts the current process if a new process arrives with a shorter remaining time than the current one." },
      { q: "Where does the OS load a page from when a 'Page Fault' occurs?", options: ["Cache", "Main Memory", "Secondary Disk", "Registers"], correct: 2, explanation: "A page fault occurs when a requested page is not in RAM, requiring a fetch from the disk." },
      { q: "Which IPC mechanism involves a shared region of memory between processes?", options: ["Message Passing", "Pipes", "Shared Memory", "Sockets"], correct: 2, explanation: "Shared Memory allows multiple processes to access the same physical memory segment for high-speed communication." }
    ],
    coding: [{ q: "Implement a safety check for Banker's Algorithm.", starter: "def is_safe(available, max_req, allocation):\n    # available: list, max_req: 2D list, allocation: 2D list\n    pass", hint: "Check if there exists a sequence of processes that can finish given current resources." }],
    conceptual: [{ q: "Compare Monolithic vs Microkernel architectures.", hint: "Focus on performance, security, and maintenance." }]
  },
  cn: {
    mcq: [
      { q: "Which layer of the OSI model handles logical addressing (IP addresses)?", options: ["Data Link", "Network", "Transport", "Session"], correct: 1, explanation: "The Network layer (Layer 3) is responsible for routing and logical addressing." },
      { q: "TCP ensures reliability primarily through:", options: ["Checksums", "Three-way handshake", "Acknowledgements and Retransmissions", "Flow control"], correct: 2, explanation: "TCP tracks segments and retransmits them if an ACK is not received within a timeout." },
      { q: "Which port is used by DNS by default?", options: ["80", "443", "53", "22"], correct: 2, explanation: "Port 53 is the standard port for DNS queries." },
      { q: "What is the default subnet mask for a /24 CIDR block?", options: ["255.255.0.0", "255.255.255.0", "255.0.0.0", "255.255.255.255"], correct: 1, explanation: "/24 means the first 24 bits are 1, resulting in 255.255.255.0." },
      { q: "UDP is considered a 'Best Effort' protocol because it is:", options: ["Fast", "Connectionless", "Ordered", "Reliable"], correct: 1, explanation: "UDP is connectionless and doesn't guarantee delivery or ordering." }
    ],
    coding: [{ q: "Write a simple parser for an HTTP GET request.", starter: "def parse_http_get(request_string):\n    # Extract method, path, and version\n    pass", hint: "Split the first line of the request string by whitespace." }],
    conceptual: [{ q: "Explain the process of a DNS lookup.", hint: "Recursive vs Iterative, Root servers, TLD servers, Authoritative servers." }]
  },
  se: {
    mcq: [
      { q: "Which SDLC model is best suited for projects with very clear and stable requirements?", options: ["Spiral", "Agile", "Waterfall", "V-Model"], correct: 2, explanation: "Waterfall is linear and works well when requirements are unlikely to change." },
      { q: "In the SOLID principles, what does the 'L' stand for?", options: ["Layered Design", "Liskov Substitution", "Logic Separation", "Loose Coupling"], correct: 1, explanation: "Liskov Substitution Principle: Objects of a superclass should be replaceable with objects of its subclasses." },
      { q: "How long is a typical Scrum Sprint?", options: ["1-4 weeks", "1-4 months", "6 months", "1 year"], correct: 0, explanation: "Sprints are short, fixed-length cycles, usually between 1 to 4 weeks." },
      { q: "What is the primary goal of User Acceptance Testing (UAT)?", options: ["Find technical bugs", "Verify performance", "Validate business requirements", "Check code coverage"], correct: 2, explanation: "UAT is done by users to ensure the software meets their business needs." },
      { q: "Which design pattern is used to create objects without specifying the exact class?", options: ["Singleton", "Observer", "Factory Method", "Strategy"], correct: 2, explanation: "The Factory Method pattern defines an interface for creating objects but lets subclasses decide which class to instantiate." }
    ],
    coding: [{ q: "Implement the Singleton pattern in Python.", starter: "class Singleton:\n    _instance = None\n    def __new__(cls):\n        # Implementation here\n        pass", hint: "Use a class variable to store the single instance." }],
    conceptual: [{ q: "Describe the differences between Agile and Waterfall methodologies.", hint: "Flexibility, feedback loops, documentation, and phases." }]
  },
  sd: {
    mcq: [
      { q: "Which component distributes incoming network traffic across multiple servers?", options: ["Reverse Proxy", "Load Balancer", "API Gateway", "CDN"], correct: 1, explanation: "Load Balancers ensure no single server becomes a bottleneck." },
      { q: "According to the CAP theorem, which two can a distributed system guarantee simultaneously?", options: ["C, A, and P", "Only P", "Any two of C, A, or P", "None"], correct: 2, explanation: "Consistency, Availability, Partition Tolerance - you can only have 2 in a partition-prone network." },
      { q: "Where is it best to store session data in a horizontally scaled app?", options: ["Local Server Memory", "The Database", "Redis or Memcached", "User's Browser only"], correct: 2, explanation: "External distributed caches like Redis allow any server instance to access session data." },
      { q: "What is the main benefit of Microservices?", options: ["Simplicity", "Independent Scaling", "Lower Latency", "Less Code"], correct: 1, explanation: "Each service can be developed, deployed, and scaled independently." },
      { q: "A CDN is primarily used for serving:", options: ["Dynamic HTML", "Static Assets", "User Databases", "API logic"], correct: 1, explanation: "CDNs cache static assets (images, CSS, JS) at edge locations near users." }
    ],
    coding: [{ q: "Design a simple Rate Limiter (Token Bucket).", starter: "class RateLimiter:\n    def __init__(self, capacity, fill_rate):\n        pass\n    def allow_request(self):\n        pass", hint: "Track tokens and last refill time." }],
    conceptual: [{ q: "Explain Vertical vs Horizontal scaling.", hint: "CPU/RAM vs Number of servers, cost, and complexity." }]
  },
  oops: {
    mcq: [
      { q: "Which OOPS concept involves wrapping data and methods into a single unit?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], correct: 2, explanation: "Encapsulation hides internal state and requires all interaction through methods." },
      { q: "Method Overloading is an example of:", options: ["Compile-time polymorphism", "Run-time polymorphism", "Inheritance", "Encapsulation"], correct: 0, explanation: "The compiler determines which method to call based on the signature." },
      { q: "In Java/Python, what does the 'final' or lack of 'open' prevent?", options: ["Instantiation", "Subclassing", "Accessing", "Overloading"], correct: 1, explanation: "A final class cannot be extended." },
      { q: "An abstract class is used as a:", options: ["Concrete instance", "Blueprint for subclasses", "Static helper", "Final product"], correct: 1, explanation: "Abstract classes cannot be instantiated and must be implemented by children." },
      { q: "What is the relationship in Composition?", options: ["Is-a", "Has-a", "Uses-a", "Inherits-from"], correct: 1, explanation: "Composition implies a strong 'Has-a' relationship (e.g., a Car has an Engine)." }
    ],
    coding: [{ q: "Create an abstract Shape class with area() method and two subclasses.", starter: "class Shape:\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    pass", hint: "Subclasses must implement the area method." }],
    conceptual: [{ q: "Inheritance vs Composition: When to use which?", hint: "Loose coupling, 'is-a' vs 'has-a', and flexibility." }]
  },
  web: {
    mcq: [
      { q: "Which CSS property is used to create flexible layouts?", options: ["display: block", "display: flex", "position: absolute", "float: left"], correct: 1, explanation: "Flexbox provides a powerful way to align and distribute space." },
      { q: "The 'async' attribute on a script tag means:", options: ["Script loads while parsing", "Script blocks parsing", "Script loads after DOM", "Script runs in worker"], correct: 0, explanation: "Async scripts download in the background without blocking the parser." },
      { q: "Which HTTP method is idempotent?", options: ["POST", "PUT", "PATCH", "None"], correct: 1, explanation: "PUT (and GET, DELETE) should yield the same result if called multiple times." },
      { q: "What handles asynchronous callbacks in JavaScript?", options: ["The Thread", "Event Loop", "CPU", "DOM"], correct: 1, explanation: "The Event Loop continuously checks the task queue and executes callbacks." },
      { q: "In React, which hook is used for side effects?", options: ["useState", "useContext", "useEffect", "useMemo"], correct: 2, explanation: "useEffect runs code after rendering, perfect for API calls or subscriptions." }
    ],
    coding: [{ q: "Implement a debounce function in JavaScript.", starter: "function debounce(func, wait) {\n    let timeout;\n    return function(...args) {\n        # Implementation here\n    };\n}", hint: "Use setTimeout and clearTimeout." }],
    conceptual: [{ q: "How does the browser render a web page? (CRP)", hint: "DOM, CSSOM, Render Tree, Layout, Paint." }]
  },
  mern: {
    mcq: [
      { q: "In MongoDB, what is the equivalent of a Table?", options: ["Database", "Collection", "Document", "Field"], correct: 1, explanation: "Collections group documents together, similar to tables in SQL." },
      { q: "What is app.use() used for in Express?", options: ["Defining routes", "Adding Middleware", "Starting server", "Connecting DB"], correct: 1, explanation: "Middleware functions execute during the lifecycle of a request." },
      { q: "JWT is used for:", options: ["Styling", "Data fetching", "Authentication/Authorization", "State management"], correct: 2, explanation: "JSON Web Tokens securely transmit user identity information." },
      { q: "In React, changes to which two things trigger a re-render?", options: ["State and Props", "Refs and Vars", "URL only", "Local Storage"], correct: 0, explanation: "React reacts to state and props updates." },
      { q: "Which Node.js module is used for file system operations?", options: ["http", "path", "fs", "os"], correct: 2, explanation: "The 'fs' module provides APIs for interacting with the file system." }
    ],
    coding: [{ q: "Write an Express middleware to check for a valid API Key.", starter: "const apiKeyAuth = (req, res, next) => {\n    # Check req.headers['x-api-key']\n    next();\n};", hint: "Return 401 if key is missing or invalid." }],
    conceptual: [{ q: "Explain Redux vs React Context API.", hint: "Complexity, use cases, performance, and boilerplate." }]
  },
  python: {
    mcq: [
      { q: "What is the output of range(2, 10, 3)?", options: ["[2, 3, 10]", "[2, 5, 8]", "[2, 5, 8, 11]", "[0, 3, 6, 9]"], correct: 1, explanation: "Starts at 2, ends before 10, increments by 3." },
      { q: "What keyword is used to create a generator in Python?", options: ["return", "emit", "yield", "gen"], correct: 2, explanation: "yield pauses the function and returns a value, resuming on next call." },
      { q: "Which decorator is used to define a getter for a private variable?", options: ["@static", "@classmethod", "@property", "@getter"], correct: 2, explanation: "@property allows calling a method like an attribute." },
      { q: "Average time complexity of looking up a key in a Python dict?", options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"], correct: 2, explanation: "Dictionaries use hash tables, providing O(1) average lookup." },
      { q: "Which of these is a mutable data type?", options: ["Tuple", "String", "List", "Integer"], correct: 2, explanation: "Lists can be modified after creation." }
    ],
    coding: [{ q: "Write a decorator that logs the execution time of a function.", starter: "import time\ndef timer_logger(func):\n    def wrapper(*args, **kwargs):\n        # Implementation\n        pass\n    return wrapper", hint: "Use time.time() before and after the function call." }],
    conceptual: [{ q: "Deep Copy vs Shallow Copy in Python.", hint: "Nested objects, 'copy' module, and memory references." }]
  },
  ds: {
    mcq: [
      { q: "Which Pandas function is used to fill missing values?", options: ["dropna()", "fillna()", "drop()", "replace()"], correct: 1, explanation: "fillna() replaces NaN values with a specific value or method." },
      { q: "Overfitting in machine learning means:", options: ["Poor training accuracy", "Poor generalization to new data", "Too much data", "Fast training"], correct: 1, explanation: "The model learns the noise in training data instead of the pattern." },
      { q: "Which metric combines Precision and Recall?", options: ["Accuracy", "F1-Score", "ROC-AUC", "MAE"], correct: 1, explanation: "F1-Score is the harmonic mean of precision and recall." },
      { q: "Principal Component Analysis (PCA) is used for:", options: ["Classification", "Regression", "Dimensionality Reduction", "Clustering"], correct: 2, explanation: "PCA projects data onto a lower-dimensional space while preserving variance." },
      { q: "Which NumPy function performs a matrix dot product?", options: ["np.dot()", "np.multiply()", "np.add()", "np.matmul()"], correct: 0, explanation: "np.dot() (or @ operator) is used for dot products." }
    ],
    coding: [{ q: "Write a function to perform Min-Max normalization on a list.", starter: "def min_max_normalize(data):\n    # (x - min) / (max - min)\n    pass", hint: "Find min and max values first." }],
    conceptual: [{ q: "Bias vs Variance tradeoff.", hint: "Underfitting, Overfitting, and model complexity." }]
  },
  cd: {
    mcq: [
      { q: "Which phase of compiler is responsible for creating tokens?", options: ["Syntax Analysis", "Lexical Analysis", "Semantic Analysis", "Optimization"], correct: 1, explanation: "Lexical Analysis (Scanner) converts stream of characters into tokens." },
      { q: "Syntax Analysis primarily uses:", options: ["Finite Automata", "Context-Free Grammars", "Pushdown Automata", "Both B and C"], correct: 3, explanation: "Syntactic structure is defined by CFGs and parsed by PDAs." },
      { q: "What does an AST represent?", options: ["Linear code", "Syntactic structure of source code", "Memory layout", "Machine instructions"], correct: 1, explanation: "Abstract Syntax Tree (AST) captures the hierarchy of code constructs." },
      { q: "Is CFG more powerful than Regular Grammars?", options: ["Yes", "No", "Equivalent", "Only for LR parsers"], correct: 0, explanation: "CFGs can describe nested structures (like brackets) that Regular Grammars cannot." },
      { q: "The Symbol Table stores information about:", options: ["Tokens only", "Machine addresses", "Identifiers and their attributes", "Error logs"], correct: 2, explanation: "It tracks names, types, and scopes during compilation." }
    ],
    coding: [{ q: "Implement a basic arithmetic expression tokenizer.", starter: "def tokenize(expr):\n    # Return list of numbers and operators\n    pass", hint: "Use regular expressions or iterate through characters." }],
    conceptual: [{ q: "Phases of a Compiler (Frontend vs Backend).", hint: "Analysis vs Synthesis." }]
  },
  toc: {
    mcq: [
      { q: "In a DFA, for each state and input symbol, there is/are:", options: ["At least one transition", "Exactly one transition", "Zero or more transitions", "Only self-loops"], correct: 1, explanation: "DFA (Deterministic Finite Automata) must have exactly one path for every input." },
      { q: "Which machine recognizes Context-Free Languages (CFL)?", options: ["Finite Automata", "Pushdown Automata", "Turing Machine", "Linear Bounded Automata"], correct: 1, explanation: "PDA adds a stack to a finite state machine to recognize CFLs." },
      { q: "The Halting Problem is:", options: ["Decidable", "Undecidable", "Polynomial time", "Context-free"], correct: 1, explanation: "There is no general algorithm to determine if any program halts on an input." },
      { q: "Regular Expressions cannot recognize:", options: ["Keywords", "Balanced parentheses", "Phone numbers", "Email addresses"], correct: 1, explanation: "Counting/nesting requires memory (stack), which Regular languages lack." },
      { q: "The P class of languages refers to those solvable in:", options: ["Linear time", "Polynomial time", "Exponential time", "Logarithmic time"], correct: 1, explanation: "P contains problems that can be solved by a Deterministic Turing Machine in polynomial time." }
    ],
    coding: [{ q: "Construct a DFA state-transition logic for even number of 'a's.", starter: "def dfa_even_a(s):\n    state = 'EVEN'\n    for char in s:\n        # logic\n        pass\n    return state == 'EVEN'", hint: "Toggle state between EVEN and ODD when an 'a' is encountered." }],
    conceptual: [{ q: "Explain the Chomsky Hierarchy.", hint: "Regular, Context-Free, Context-Sensitive, Recursively Enumerable." }]
  }
};

const TechnicalRoundPage = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [screen, setScreen] = useState('selection'); // selection, config, interface, results
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [config, setConfig] = useState({ type: 'mcq', difficulty: 'Medium', count: 5 });
  
  // Interface states
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { index: answer }
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Ref for timer
  const timerRef = useRef(null);

  // --- HELPERS ---
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const startRound = () => {
    const bank = QUESTION_BANK[selectedSubject.id];
    let pool = [];
    if (config.type === 'mcq') pool = bank.mcq;
    else if (config.type === 'coding') pool = bank.coding;
    else pool = bank.conceptual;

    // Shuffle and pick
    const selectedQs = [...pool].sort(() => 0.5 - Math.random()).slice(0, config.count);
    setQuestions(selectedQs);
    
    // Set timer based on type
    let timePerQ = 90; // seconds
    if (config.type === 'coding') timePerQ = 300;
    if (config.type === 'conceptual') timePerQ = 180;
    
    setTimeLeft(selectedQs.length * timePerQ);
    setStartTime(Date.now());
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setScreen('interface');
  };

  const submitRound = useCallback(() => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);
    setScreen('results');
  }, []);

  // Timer logic
  useEffect(() => {
    if (screen === 'interface' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, timeLeft, submitRound]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDERS ---

  // SCREEN 1: SELECTION
  const renderSelection = () => (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>💻 Technical Round</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Select a core or specialization subject to begin your deep dive preparation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Subjects', val: '13', icon: '📚', color: '#3b82f6' },
          { label: 'Question Types', val: '3', icon: '📂', color: '#7c3aed' },
          { label: 'Difficulty Levels', val: '3', icon: '📊', color: '#10b981' },
          { label: 'AI Review', val: 'Active', icon: '🤖', color: '#f59e0b' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '24px' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: stat.color }}>{stat.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {['Core', 'Spec'].map((type) => (
        <div key={type} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '18px', background: type === 'Core' ? '#3b82f6' : '#7c3aed', borderRadius: '2px' }}></div>
            {type === 'Core' ? 'Core Engineering Subjects (7)' : 'Specialization Subjects (6)'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
            {SUBJECTS.filter(s => s.type === type.toLowerCase()).map(subject => (
              <div 
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  background: '#fff',
                  padding: '24px',
                  borderRadius: '16px',
                  border: selectedSubject?.id === subject.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: '0.2s',
                  position: 'relative',
                  boxShadow: selectedSubject?.id === subject.id ? '0 10px 25px rgba(59, 130, 246, 0.15)' : 'none'
                }}
              >
                {selectedSubject?.id === subject.id && <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#3b82f6', fontSize: '20px' }}>✓</div>}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', width: '56px', height: '56px', background: subject.color + '15', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {subject.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{subject.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{subject.short}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: subject.difficulty === 'Hard' ? '#fee2e2' : subject.difficulty === 'Medium' ? '#fef3c7' : '#d1fae5', color: subject.difficulty === 'Hard' ? '#ef4444' : subject.difficulty === 'Medium' ? '#f59e0b' : '#10b981' }}>
                    {subject.difficulty}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', background: subject.type === 'core' ? '#f3e8fd' : '#e0e7ff', color: subject.type === 'core' ? '#7c3aed' : '#3b82f6' }}>
                    {subject.type === 'core' ? 'Core' : 'Specialization'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                  <span>Readiness</span>
                  <span>{subject.progress}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${subject.progress}%`, height: '100%', background: subject.color, borderRadius: '99px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedSubject && (
        <div style={{ position: 'sticky', bottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => setScreen('config')}
            style={{ padding: '14px 40px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)', transform: 'translateY(0)', transition: '0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Configure Round for {selectedSubject.short} →
          </button>
        </div>
      )}
    </div>
  );

  // SCREEN 2: CONFIGURATION
  const renderConfig = () => (
    <div style={{ animation: 'fadeUp 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => setScreen('selection')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ← Back to Subjects
      </button>

      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', width: '80px', height: '80px', background: selectedSubject.color + '15', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedSubject.icon}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>{selectedSubject.name}</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: '#f3f4f6', color: '#64748b' }}>{selectedSubject.difficulty}</span>
              <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', background: '#f3f4f6', color: '#64748b' }}>{selectedSubject.type}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Choose Question Type</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { id: 'mcq', label: 'MCQ', icon: '✅', desc: 'Multiple choice questions. Test conceptual understanding with 4 options.' },
              { id: 'coding', label: 'Coding Challenge', icon: '💻', desc: 'Write actual code in the editor. Solve algorithmic problems with hints.' },
              { id: 'conceptual', label: 'Conceptual', icon: '🧠', desc: 'Open-ended written questions. Explain concepts and design decisions.' }
            ].map(type => (
              <div 
                key={type.id}
                onClick={() => setConfig({ ...config, type: type.id })}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: config.type === type.id ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  background: config.type === type.id ? '#f5f3ff' : '#fff',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{type.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{type.label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{type.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Difficulty Level</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Easy', 'Medium', 'Hard'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setConfig({ ...config, difficulty: lvl })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: config.difficulty === lvl ? `2px solid ${lvl === 'Hard' ? '#ef4444' : lvl === 'Medium' ? '#f59e0b' : '#10b981'}` : '1.5px solid #e2e8f0',
                    background: config.difficulty === lvl ? (lvl === 'Hard' ? '#fee2e2' : lvl === 'Medium' ? '#fef3c7' : '#d1fae5') : '#fff',
                    color: config.difficulty === lvl ? (lvl === 'Hard' ? '#ef4444' : lvl === 'Medium' ? '#b45309' : '#059669') : '#64748b',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Number of Questions</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[3, 5, 7, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setConfig({ ...config, count: n })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: config.count === n ? '2px solid #3b82f6' : '1.5px solid #e2e8f0',
                    background: config.count === n ? '#eff6ff' : '#fff',
                    color: config.count === n ? '#3b82f6' : '#64748b',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Est. Time</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                ~{Math.round((config.count * (config.type === 'coding' ? 5 : config.type === 'conceptual' ? 3 : 1.5)))} mins
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Count</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{config.count} Questions</div>
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#7c3aed' }}>{config.type.toUpperCase()} Mode</div>
        </div>

        <button 
          onClick={startRound}
          style={{ width: '100%', padding: '16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)' }}
        >
          🚀 Start Technical Round
        </button>
      </div>
    </div>
  );

  // SCREEN 3: INTERFACE
  const renderInterface = () => {
    const q = questions[currentIndex];
    const isAnswered = userAnswers[currentIndex] !== undefined;
    const answer = userAnswers[currentIndex];

    return (
      <div style={{ animation: 'fadeUp 0.5s ease', height: 'calc(100vh - 120px)' }}>
        {/* Sub-Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '24px' }}>{selectedSubject.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{selectedSubject.short} Round</div>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: '#f3f4f6', color: '#64748b' }}>{config.difficulty}</span>
            </div>
            <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }}></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', 
                    background: currentIndex === i ? '#3b82f6' : (userAnswers[i] !== undefined ? '#10b981' : '#e2e8f0'),
                    transition: '0.3s'
                  }} 
                />
              ))}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>Question {currentIndex + 1} of {questions.length}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ 
              padding: '8px 16px', borderRadius: '10px', background: timeLeft < 60 ? '#fee2e2' : timeLeft < 120 ? '#fef3c7' : '#f1f5f9',
              color: timeLeft < 60 ? '#ef4444' : timeLeft < 120 ? '#b45309' : '#64748b',
              fontWeight: '800', fontSize: '16px', fontFamily: 'monospace'
            }}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <button onClick={() => { if(window.confirm("Submit round?")) submitRound(); }} style={{ padding: '8px 20px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
              Submit Round
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', height: '100%' }}>
          
          {/* Left: Question Area */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#7c3aed', background: '#f5f3ff', padding: '4px 10px', borderRadius: '6px' }}>{config.type}</span>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px' }}>{config.difficulty}</span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '32px', lineHeight: '1.5' }}>
              {q.q}
            </h2>

            {/* MCQ INTERFACE */}
            {config.type === 'mcq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correct;
                  const isSelected = answer === idx;
                  let bg = '#fff';
                  let border = '#e2e8f0';
                  if (isSelected) {
                    bg = isCorrect ? '#d1fae5' : '#fee2e2';
                    border = isCorrect ? '#10b981' : '#ef4444';
                  } else if (isAnswered && isCorrect) {
                    bg = '#d1fae5';
                    border = '#10b981';
                  }

                  return (
                    <div 
                      key={idx}
                      onClick={() => !isAnswered && setUserAnswers({ ...userAnswers, [currentIndex]: idx })}
                      style={{
                        padding: '16px 24px', borderRadius: '12px', border: `2px solid ${border}`,
                        background: bg, cursor: isAnswered ? 'default' : 'pointer', transition: '0.2s',
                        display: 'flex', alignItems: 'center', gap: '16px'
                      }}
                    >
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.5)' : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', color: '#64748b'
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{opt}</div>
                    </div>
                  );
                })}

                {isAnswered && (
                  <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6', animation: 'fadeUp 0.3s ease' }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>💡 Explanation</div>
                    <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{q.explanation}</div>
                  </div>
                )}
              </div>
            )}

            {/* CODING INTERFACE */}
            {config.type === 'coding' && (
              <div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Editor: Python 3</div>
                  <button onClick={() => setUserAnswers({ ...userAnswers, [currentIndex]: q.starter })} style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Reset Starter Code</button>
                </div>
                <textarea 
                  value={answer || q.starter}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [currentIndex]: e.target.value })}
                  spellCheck="false"
                  style={{
                    width: '100%', height: '300px', background: '#0f172a', color: '#f8fafc', padding: '24px',
                    borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', lineHeight: '1.6',
                    border: 'none', outline: 'none', resize: 'none'
                  }}
                />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => {
                      const feedback = `[AI Review] Complexity: O(n), Space: O(1). \nOutput: Success. \nLogic looks sound for ${selectedSubject.short}.`;
                      alert(feedback);
                    }}
                    style={{ padding: '12px 30px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    ▶ Run & Submit
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPTUAL INTERFACE */}
            {config.type === 'conceptual' && (
              <div>
                <textarea 
                  value={answer || ''}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [currentIndex]: e.target.value })}
                  placeholder="Explain your approach here..."
                  style={{
                    width: '100%', height: '300px', background: '#fff', color: '#1e293b', padding: '24px',
                    borderRadius: '12px', fontFamily: 'inherit', fontSize: '15px', lineHeight: '1.6',
                    border: '1.5px solid #e2e8f0', outline: 'none', resize: 'none'
                  }}
                />
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: (answer?.length || 0) < 150 ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                    {(answer?.length || 0)} / 150+ characters
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Aim for a detailed explanation.</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>📌 Subject Info</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Fundamentals', 'Core Concepts', 'Common Interviews', 'AI Review'].map(t => (
                  <span key={t} style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', background: '#eff6ff', color: '#3b82f6' }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>💡 Hint</div>
              <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{q.hint}</div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>📊 Round Progress</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Answered</span>
                  <span style={{ color: '#1e293b', fontWeight: '800' }}>{Object.keys(userAnswers).length} / {questions.length}</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%`, height: '100%', background: '#3b82f6', transition: '0.3s' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px' }}>
                  <span style={{ color: '#64748b' }}>Time Left</span>
                  <span style={{ color: timeLeft < 60 ? '#ef4444' : '#1e293b', fontWeight: '800' }}>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
              <button 
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: '700', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1 }}
              >Previous</button>
              <button 
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: '700', cursor: currentIndex === questions.length - 1 ? 'not-allowed' : 'pointer', opacity: currentIndex === questions.length - 1 ? 0.5 : 1 }}
              >Next</button>
            </div>
            
            <button 
              onClick={() => { if(window.confirm("Submit all answers?")) submitRound(); }}
              style={{ padding: '14px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}
            >Submit All Answers</button>
          </div>
        </div>
      </div>
    );
  };

  // SCREEN 4: RESULTS
  const renderResults = () => {
    let score = 0;
    if (config.type === 'mcq') {
      questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
      });
    } else {
      // Mock score for coding/conceptual
      score = Math.floor(Math.random() * (questions.length - 1)) + 1;
    }
    
    const pct = Math.round((score / questions.length) * 100);
    let grade = 'Needs Practice';
    let gColor = '#ef4444';
    if (pct >= 80) { grade = 'Excellent'; gColor = '#10b981'; }
    else if (pct >= 60) { grade = 'Good'; gColor = '#3b82f6'; }
    else if (pct >= 40) { grade = 'Average'; gColor = '#f59e0b'; }

    return (
      <div style={{ animation: 'fadeUp 0.5s ease', maxWidth: '760px', margin: '0 auto', paddingBottom: '60px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '32px' }}>🎯 Round Complete!</h1>
          
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="80" cy="80" r="70" fill="none" stroke={gColor} strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (440 * pct / 100)} strokeLinecap="round" style={{ transition: '2s ease-out' }} />
            </svg>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: '900', color: gColor }}>{pct}%</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: gColor, textTransform: 'uppercase' }}>{grade}</div>
            </div>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', marginBottom: '40px' }}>
            {selectedSubject.name} • {config.type.toUpperCase()} • {config.difficulty}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Correct', val: score, color: '#10b981', bg: '#d1fae5' },
              { label: 'Wrong', val: questions.length - score, color: '#ef4444', bg: '#fee2e2' },
              { label: 'Total', val: questions.length, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Accuracy', val: pct + '%', color: '#7c3aed', bg: '#f5f3ff' }
            ].map((stat, i) => (
              <div key={i} style={{ background: stat.bg, padding: '16px 8px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: stat.color }}>{stat.val}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: stat.color, marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' }}>📋 Question Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questions.map((q, i) => {
              const ans = userAnswers[i];
              const correct = config.type === 'mcq' ? (ans === q.correct) : (ans !== undefined);
              return (
                <div key={i} style={{ padding: '20px', borderRadius: '14px', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>Question {i + 1}</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: correct ? '#10b981' : '#ef4444', background: correct ? '#d1fae5' : '#fee2e2', padding: '3px 10px', borderRadius: '99px' }}>
                      {correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', lineHeight: '1.5' }}>{q.q}</div>
                  
                  {config.type === 'mcq' && (
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <div style={{ marginBottom: '4px' }}>Your Answer: <span style={{ color: ans === q.correct ? '#10b981' : '#ef4444', fontWeight: '700' }}>{ans !== undefined ? q.options[ans] : 'Skipped'}</span></div>
                      <div>Correct Answer: <span style={{ color: '#10b981', fontWeight: '700' }}>{q.options[q.correct]}</span></div>
                    </div>
                  )}

                  {config.type !== 'mcq' && (
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <div style={{ marginBottom: '8px' }}>Your Response: <span style={{ color: '#1e293b', fontWeight: '600' }}>{ans || 'Skipped'}</span></div>
                      <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                        <span style={{ fontWeight: '800', color: '#3b82f6' }}>Key points to cover:</span> {q.hint}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px' }}>
          <button onClick={() => setScreen('selection')} style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#1e293b', fontWeight: '800', cursor: 'pointer' }}>← Choose Subject</button>
          <button onClick={() => setScreen('config')} style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#1e293b', fontWeight: '800', cursor: 'pointer' }}>⚙️ Change Config</button>
          <button onClick={startRound} style={{ padding: '14px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>🔄 Retry Round</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff', fontFamily: '"Sora", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.location.href="/"}>
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
          <div style={{ fontWeight: '800', fontSize: '20px', color: '#3b82f6' }}>InterviewAce</div>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Home', 'Dashboard', 'Subjects', 'Progress', 'Interview Rounds', 'Test'].map(tab => (
            <div 
              key={tab} 
              onClick={() => navigate(tab === 'Home' ? '/' : `/${tab.toLowerCase().replace(' ', '-')}`)}
              style={{ 
                fontSize: '14px', fontWeight: tab === 'Interview Rounds' ? '700' : '500', color: tab === 'Interview Rounds' ? '#3b82f6' : '#64748b', 
                borderBottom: tab === 'Interview Rounds' ? '2px solid #3b82f6' : 'none', padding: '20px 0', cursor: 'pointer' 
              }}
            >
              {tab}
            </div>
          ))}
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {screen === 'selection' && renderSelection()}
        {screen === 'config' && renderConfig()}
        {screen === 'interface' && renderInterface()}
        {screen === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default TechnicalRoundPage;
