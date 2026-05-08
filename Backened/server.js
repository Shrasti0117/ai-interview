require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./Config/db");

const app = express();
connectDB();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ─── SCHEMAS & MODELS (New for Subjects/MCQ) ─────────────────

const OptionSchema = new mongoose.Schema({
  label: { type: String, enum: ["A","B","C","D"], required: true },
  text:  { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, uppercase: true, index: true },
  topic:       { type: String, required: true, index: true },
  question:    { type: String, required: true },
  options:     { type: [OptionSchema], validate: v => v.length === 4 },
  correct:     { type: String, enum: ["A","B","C","D"], required: true },
  explanation: { type: String, default: "" },
  difficulty:  { type: String, enum: ["Easy","Medium","Hard"], default: "Medium" },
  tags:        [String],
}, { timestamps: true });

const ProgressSchema = new mongoose.Schema({
  userId:         { type: String, default: "guest", index: true },
  subjectCode:    { type: String, required: true, index: true },
  topic:          { type: String, required: true },
  questionId:     { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  selectedOption: String,
  isCorrect:      { type: Boolean, required: true },
  answeredAt:     { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", QuestionSchema);
const Progress = mongoose.model("Progress", ProgressSchema);

// ─── SEED DATA ───────────────────────────────────────────────
const SEED_DATA = [
  // ── DSA — Arrays ──
  { subjectCode:"DSA", topic:"Arrays", question:"What is the time complexity of accessing an array element by index?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(n)"},{label:"C",text:"O(log n)"},{label:"D",text:"O(n²)"}], correct:"A", explanation:"Arrays store elements contiguously. Address = base + index × size is computed in constant time.", difficulty:"Easy" },
  { subjectCode:"DSA", topic:"Arrays", question:"Which algorithm finds the maximum subarray sum in O(n)?", options:[{label:"A",text:"Brute Force"},{label:"B",text:"Divide & Conquer"},{label:"C",text:"Kadane's Algorithm"},{label:"D",text:"Binary Search"}], correct:"C", explanation:"Kadane's algorithm scans once, maintaining current and global max sums. O(n) time, O(1) space.", difficulty:"Medium" },
  { subjectCode:"DSA", topic:"Arrays", question:"What is the result of rotating [1,2,3,4,5] right by 2?", options:[{label:"A",text:"[3,4,5,1,2]"},{label:"B",text:"[4,5,1,2,3]"},{label:"C",text:"[2,3,4,5,1]"},{label:"D",text:"[5,1,2,3,4]"}], correct:"B", explanation:"Right rotation by 2 moves last 2 elements [4,5] to front: [4,5,1,2,3].", difficulty:"Easy" },
  { subjectCode:"DSA", topic:"Arrays", question:"What does the Two Pointer technique primarily optimise?", options:[{label:"A",text:"Space complexity"},{label:"B",text:"Time for linear scans"},{label:"C",text:"Recursion depth"},{label:"D",text:"Cache misses"}], correct:"B", explanation:"Two pointers reduce O(n²) nested loops to O(n) by maintaining two strategic indices.", difficulty:"Medium" },
  { subjectCode:"DSA", topic:"Arrays", question:"What is the worst-case time of binary search on a sorted array?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(log n)"},{label:"C",text:"O(n)"},{label:"D",text:"O(n log n)"}], correct:"B", explanation:"Binary search halves the search space each step, giving O(log n) worst case.", difficulty:"Easy" },

  // ── DSA — Trees ──
  { subjectCode:"DSA", topic:"Trees", question:"Which traversal of a BST gives elements in sorted order?", options:[{label:"A",text:"Preorder"},{label:"B",text:"Postorder"},{label:"C",text:"Inorder"},{label:"D",text:"Level Order"}], correct:"C", explanation:"Inorder (Left→Root→Right) visits BST nodes in ascending sorted order.", difficulty:"Easy" },
  { subjectCode:"DSA", topic:"Trees", question:"What makes an AVL tree self-balancing?", options:[{label:"A",text:"All leaves at same level"},{label:"B",text:"Balance factor ≤1 at every node"},{label:"C",text:"All nodes have 2 children"},{label:"D",text:"Red-black coloring"}], correct:"B", explanation:"AVL trees maintain |height(left)−height(right)| ≤ 1 at every node via rotations.", difficulty:"Hard" },
  { subjectCode:"DSA", topic:"Trees", question:"What data structure does BFS use for tree traversal?", options:[{label:"A",text:"Stack"},{label:"B",text:"Queue"},{label:"C",text:"Priority Queue"},{label:"D",text:"Deque"}], correct:"B", explanation:"BFS uses a Queue (FIFO). Each level's nodes enqueue before moving deeper.", difficulty:"Easy" },

  // ── DSA — Dynamic Programming ──
  { subjectCode:"DSA", topic:"Dynamic Programming", question:"What is memoization in dynamic programming?", options:[{label:"A",text:"Using extra memory to speed up execution"},{label:"B",text:"Caching results of subproblems to avoid recomputation"},{label:"C",text:"Converting recursion to iteration"},{label:"D",text:"Sorting input before solving"}], correct:"B", explanation:"Memoization stores results of expensive function calls and returns the cached result for same inputs.", difficulty:"Medium" },
  { subjectCode:"DSA", topic:"Dynamic Programming", question:"Which property must a problem have for DP to apply?", options:[{label:"A",text:"Greedy choice property"},{label:"B",text:"Optimal substructure and overlapping subproblems"},{label:"C",text:"Sorted input"},{label:"D",text:"Graph structure"}], correct:"B", explanation:"DP requires: (1) optimal substructure — optimal solution built from optimal sub-solutions, (2) overlapping subproblems — same subproblems recur.", difficulty:"Hard" },

  // ── DBMS — SQL ──
  { subjectCode:"DBMS", topic:"SQL", question:"Which clause filters groups after GROUP BY?", options:[{label:"A",text:"WHERE"},{label:"B",text:"HAVING"},{label:"C",text:"FILTER"},{label:"D",text:"ON"}], correct:"B", explanation:"HAVING filters after grouping. WHERE filters before. Use HAVING with aggregate functions.", difficulty:"Easy" },
  { subjectCode:"DBMS", topic:"SQL", question:"Which join returns all rows from both tables with NULLs for no match?", options:[{label:"A",text:"INNER JOIN"},{label:"B",text:"LEFT JOIN"},{label:"C",text:"RIGHT JOIN"},{label:"D",text:"FULL OUTER JOIN"}], correct:"D", explanation:"FULL OUTER JOIN returns all rows from both tables, filling NULLs where no match exists.", difficulty:"Medium" },
  { subjectCode:"DBMS", topic:"SQL", question:"What is a correlated subquery?", options:[{label:"A",text:"A subquery that runs once"},{label:"B",text:"A subquery referencing the outer query's column"},{label:"C",text:"A subquery in FROM clause"},{label:"D",text:"A subquery returning multiple rows"}], correct:"B", explanation:"A correlated subquery references the outer query's column and re-executes for each outer row.", difficulty:"Hard" },
  { subjectCode:"DBMS", topic:"SQL", question:"Which index type is best for range queries?", options:[{label:"A",text:"Hash Index"},{label:"B",text:"Bitmap Index"},{label:"C",text:"B-Tree Index"},{label:"D",text:"Full-Text Index"}], correct:"C", explanation:"B-Tree indexes maintain sorted order, making range queries (BETWEEN, >, <) efficient with O(log n) traversal.", difficulty:"Hard" },

  // ── DBMS — Normalization ──
  { subjectCode:"DBMS", topic:"Normalization", question:"Which normal form eliminates transitive dependencies?", options:[{label:"A",text:"1NF"},{label:"B",text:"2NF"},{label:"C",text:"3NF"},{label:"D",text:"BCNF"}], correct:"C", explanation:"3NF ensures every non-prime attribute depends directly on primary key, not transitively.", difficulty:"Hard" },
  { subjectCode:"DBMS", topic:"Normalization", question:"What does 1NF require?", options:[{label:"A",text:"No partial dependencies"},{label:"B",text:"No transitive dependencies"},{label:"C",text:"Atomic column values, no repeating groups"},{label:"D",text:"Every determinant is a candidate key"}], correct:"C", explanation:"1NF requires all column values to be atomic (indivisible) with no repeating groups or arrays.", difficulty:"Easy" },

  // ── OS — Processes ──
  { subjectCode:"OS", topic:"Processes", question:"What is a zombie process?", options:[{label:"A",text:"Process consuming all CPU"},{label:"B",text:"Terminated process whose exit hasn't been read by parent"},{label:"C",text:"Process waiting for I/O"},{label:"D",text:"Background daemon"}], correct:"B", explanation:"Zombie: completed execution but stays in process table because parent hasn't called wait() to read exit status.", difficulty:"Hard" },
  { subjectCode:"OS", topic:"Processes", question:"Which system call creates a child process in Unix?", options:[{label:"A",text:"exec()"},{label:"B",text:"clone()"},{label:"C",text:"fork()"},{label:"D",text:"spawn()"}], correct:"C", explanation:"fork() creates an exact copy of the calling process. Child gets duplicate of parent's memory space.", difficulty:"Medium" },
  { subjectCode:"OS", topic:"Processes", question:"What is context switching?", options:[{label:"A",text:"Switching programming languages"},{label:"B",text:"Saving/restoring CPU state to switch between processes"},{label:"C",text:"Changing network context"},{label:"D",text:"Switching disk sectors"}], correct:"B", explanation:"Context switch saves the current process state (registers, PC, stack) and restores the saved state of the next process.", difficulty:"Medium" },

  // ── CN — OSI Model ──
  { subjectCode:"CN", topic:"OSI Model", question:"How many layers does the OSI model have?", options:[{label:"A",text:"5"},{label:"B",text:"6"},{label:"C",text:"7"},{label:"D",text:"4"}], correct:"C", explanation:"OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.", difficulty:"Easy" },
  { subjectCode:"CN", topic:"OSI Model", question:"Which OSI layer is responsible for routing packets?", options:[{label:"A",text:"Data Link"},{label:"B",text:"Transport"},{label:"C",text:"Network"},{label:"D",text:"Session"}], correct:"C", explanation:"Layer 3 (Network) handles logical addressing and routing. IP protocol operates here.", difficulty:"Medium" },
  { subjectCode:"CN", topic:"OSI Model", question:"TCP operates at which OSI layer?", options:[{label:"A",text:"Network"},{label:"B",text:"Transport"},{label:"C",text:"Session"},{label:"D",text:"Data Link"}], correct:"B", explanation:"TCP/UDP operate at Layer 4 (Transport), providing end-to-end communication services.", difficulty:"Easy" },

  // ── Python — Basics ──
  { subjectCode:"Python", topic:"Basics", question:"What is Python's GIL?", options:[{label:"A",text:"A security mechanism"},{label:"B",text:"A mutex preventing multiple threads executing bytecode simultaneously"},{label:"C",text:"A garbage collector lock"},{label:"D",text:"A module import lock"}], correct:"B", explanation:"GIL allows only one thread to execute Python bytecode at a time, limiting CPU-bound multi-threading in CPython.", difficulty:"Hard" },
  { subjectCode:"Python", topic:"Basics", question:"Which Python type is immutable?", options:[{label:"A",text:"List"},{label:"B",text:"Dictionary"},{label:"C",text:"Set"},{label:"D",text:"Tuple"}], correct:"D", explanation:"Tuples are immutable — once created, elements cannot be changed. Lists, dicts, sets are mutable.", difficulty:"Easy" },
  { subjectCode:"Python", topic:"Basics", question:"What is a Python decorator?", options:[{label:"A",text:"CSS-like styling"},{label:"B",text:"A function wrapping another function to add behavior"},{label:"C",text:"A class inheritance pattern"},{label:"D",text:"A type annotation"}], correct:"B", explanation:"Decorators (@name) wrap functions, adding behavior before/after without modifying the original function.", difficulty:"Medium" },
  { subjectCode:"Python", topic:"Basics", question:"What does list comprehension [x*2 for x in range(5)] produce?", options:[{label:"A",text:"[0,1,2,3,4]"},{label:"B",text:"[0,2,4,6,8]"},{label:"C",text:"[2,4,6,8,10]"},{label:"D",text:"[1,2,3,4,5]"}], correct:"B", explanation:"range(5) = [0,1,2,3,4]. Each multiplied by 2 = [0,2,4,6,8].", difficulty:"Easy" },

  // ── MERN — MongoDB ──
  { subjectCode:"MERN", topic:"MongoDB", question:"What type of database is MongoDB?", options:[{label:"A",text:"Relational"},{label:"B",text:"Document-Oriented NoSQL"},{label:"C",text:"Graph"},{label:"D",text:"Column-Store"}], correct:"B", explanation:"MongoDB is a document-oriented NoSQL database storing data in flexible JSON-like BSON documents.", difficulty:"Easy" },
  { subjectCode:"MERN", topic:"MongoDB", question:"What does the $lookup aggregation stage do?", options:[{label:"A",text:"Looks up a value in an array"},{label:"B",text:"Performs a LEFT JOIN with another collection"},{label:"C",text:"Searches text fields"},{label:"D",text:"Filters documents"}], correct:"B", explanation:"$lookup performs left outer join between collections, like SQL JOIN.", difficulty:"Hard" },
  { subjectCode:"MERN", topic:"MongoDB", question:"What is mongoose?", options:[{label:"A",text:"MongoDB client driver"},{label:"B",text:"ODM for MongoDB with schema validation and hooks"},{label:"C",text:"Database GUI tool"},{label:"D",text:"Test framework"}], correct:"B", explanation:"Mongoose is an ODM providing schema-based modeling, validation, and query building for MongoDB in Node.js.", difficulty:"Medium" },

  // ── WebDev — JavaScript ──
  { subjectCode:"WebDev", topic:"JavaScript", question:"What is the output of: typeof null?", options:[{label:"A",text:'"null"'},{label:"B",text:'"undefined"'},{label:"C",text:'"object"'},{label:"D",text:'"string"'}], correct:"C", explanation:"typeof null returns 'object' — a famous JS bug preserved for backward compatibility.", difficulty:"Easy" },
  { subjectCode:"WebDev", topic:"JavaScript", question:"What is a closure?", options:[{label:"A",text:"Closing a browser window"},{label:"B",text:"A function remembering its outer scope variables"},{label:"C",text:"An error handler"},{label:"D",text:"A loop terminator"}], correct:"B", explanation:"A closure is a function that retains access to its outer lexical scope after the outer function returns.", difficulty:"Medium" },
  { subjectCode:"WebDev", topic:"JavaScript", question:"What is event bubbling?", options:[{label:"A",text:"Events propagating child → parent"},{label:"B",text:"Events propagating parent → child"},{label:"C",text:"Async event execution"},{label:"D",text:"DOM event creation"}], correct:"A", explanation:"Event bubbling propagates events upward: target → parent → ... → root.", difficulty:"Medium" },
  { subjectCode:"WebDev", topic:"JavaScript", question:"What does Promise.all() do when one promise rejects?", options:[{label:"A",text:"Waits for other promises"},{label:"B",text:"Ignores rejection"},{label:"C",text:"Immediately rejects"},{label:"D",text:"Returns undefined"}], correct:"C", explanation:"Promise.all() short-circuits and immediately rejects if any promise rejects, discarding other results.", difficulty:"Hard" },

  // ── OOPS — Inheritance ──
  { subjectCode:"OOPS", topic:"Inheritance", question:"What is method overriding?", options:[{label:"A",text:"Multiple methods with same name different params"},{label:"B",text:"Child class providing different implementation of parent method"},{label:"C",text:"Calling parent constructor"},{label:"D",text:"Hiding instance variables"}], correct:"B", explanation:"Method overriding: child class redefines a method from parent class with same signature but different implementation.", difficulty:"Medium" },
  { subjectCode:"OOPS", topic:"Inheritance", question:"What is the diamond problem in OOP?", options:[{label:"A",text:"Drawing diamond shapes"},{label:"B",text:"Ambiguity when class inherits from two classes sharing a common parent"},{label:"C",text:"Performance issue in recursion"},{label:"D",text:"Memory fragmentation"}], correct:"B", explanation:"Diamond problem: if B and C inherit from A, and D inherits from B and C, it's unclear which version of A's method D inherits.", difficulty:"Hard" },

  // ── SD — Scalability ──
  { subjectCode:"SD", topic:"Scalability", question:"What is horizontal scaling?", options:[{label:"A",text:"Adding more CPU/RAM to existing machine"},{label:"B",text:"Adding more machines to distribute load"},{label:"C",text:"Increasing database storage"},{label:"D",text:"Adding more network bandwidth"}], correct:"B", explanation:"Horizontal scaling (scale-out) adds more servers to handle load. Vertical scaling (scale-up) adds resources to existing server.", difficulty:"Easy" },
  { subjectCode:"SD", topic:"Scalability", question:"What is CAP theorem?", options:[{label:"A",text:"Capacity, Availability, Performance"},{label:"B",text:"Consistency, Availability, Partition tolerance — can only guarantee 2"},{label:"C",text:"Cache, API, Protocol theorem"},{label:"D",text:"A database query optimization rule"}], correct:"B", explanation:"CAP: distributed systems can guarantee at most 2 of: Consistency (all nodes see same data), Availability (always responds), Partition tolerance (works despite network failures).", difficulty:"Hard" },
];

// ─── SEED ENDPOINT ────────────────────────────────────────────
app.post("/api/seed", async (req, res) => {
  try {
    await Question.deleteMany({});
    await Question.insertMany(SEED_DATA);
    res.json({ message: `✅ Seeded ${SEED_DATA.length} questions`, count: SEED_DATA.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── NEW SUBJECTS & PROGRESS ROUTES ──────────────────────────

// GET /api/subjects/:code/topics
app.get("/api/subjects/:code/topics", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const topics = await Question.aggregate([
      { $match: { subjectCode: code } },
      { $group: { _id: "$topic", count: { $sum: 1 }, difficulties: { $addToSet: "$difficulty" } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      subjectCode: code,
      topics: topics.map(t => ({ name: t._id, questionCount: t.count, difficulties: t.difficulties })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subjects/:code/questions?topic=Arrays&limit=10&difficulty=Medium
app.get("/api/subjects/:code/questions", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { topic, limit = 10, difficulty } = req.query;
    const match = { subjectCode: code };
    if (topic)      match.topic      = topic;
    if (difficulty) match.difficulty = difficulty;
    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: parseInt(limit) } },
      { $project: { __v: 0 } },
    ]);
    res.json({ questions, total: questions.length, subjectCode: code, topic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/progress/submit
app.post("/api/progress/submit", async (req, res) => {
  try {
    const { subjectCode, questionId, selectedOption, isCorrect, userId = "guest" } = req.body;
    if (!subjectCode || isCorrect === undefined) return res.status(400).json({ error: "Missing required fields" });
    let topic = "";
    if (questionId && mongoose.Types.ObjectId.isValid(questionId)) {
      const q = await Question.findById(questionId).select("topic");
      if (q) topic = q.topic;
    }
    await Progress.create({ userId, subjectCode: subjectCode.toUpperCase(), topic, questionId: questionId || null, selectedOption, isCorrect });
    res.json({ message: "Recorded", isCorrect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/:code?userId=guest
app.get("/api/progress/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { userId = "guest" } = req.query;
    const stats = await Progress.aggregate([
      { $match: { subjectCode: code, userId } },
      { $group: { _id: "$topic", total: { $sum: 1 }, correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }, lastAttempt: { $max: "$answeredAt" } } },
      { $sort: { lastAttempt: -1 } },
    ]);
    const totalAnswered = stats.reduce((a, t) => a + t.total, 0);
    const totalCorrect  = stats.reduce((a, t) => a + t.correct, 0);
    res.json({
      subjectCode: code, userId,
      overallAccuracy: totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      totalAnswered, totalCorrect,
      byTopic: stats.map(t => ({ topic: t._id, total: t.total, correct: t.correct, accuracy: Math.round((t.correct / t.total) * 100), lastAttempt: t.lastAttempt })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/all/summary?userId=guest
app.get("/api/progress/all/summary", async (req, res) => {
  try {
    const { userId = "guest" } = req.query;
    const stats = await Progress.aggregate([
      { $match: { userId } },
      { $group: { _id: "$subjectCode", total: { $sum: 1 }, correct: { $sum: { $cond: ["$isCorrect", 1, 0] } } } },
    ]);
    res.json({
      userId,
      subjects: stats.map(s => ({ subjectCode: s._id, total: s.total, correct: s.correct, accuracy: Math.round((s.correct / s.total) * 100) })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── EXISTING ROUTES ─────────────────────────────────────────
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/interview", require("./routes/interviewroutes"));
app.use("/api/aptitude", require("./routes/aptituderoutes"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
