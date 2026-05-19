import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

/* ═══════════════════════════════════════════════════════════════════
   INTERVIEWACE — Complete Frontend
   • Works standalone with mock data (no backend needed)
   • Connects to Express+MongoDB when API_BASE is set correctly
   • All 13 subjects, topic-wise MCQ, timer, results, progress tracking
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = "http://localhost:5001/api";   // Updated to match project backend port

// ────────────────────────────────────────────────────────────────────
// GLOBAL STYLES  (injected once)
// ────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────
// GLOBAL STYLES  (injected once)
// ────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4ff;color:#111}
  button{font-family:inherit;cursor:pointer}
  input{font-family:inherit}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .fade-in{animation:fadeIn .35s ease both}
  .slide-up{animation:slideUp .4s ease both}
  .spin{animation:spin 1s linear infinite}
  .row-hover{transition:all .2s}
  .row-hover:hover{transform:translateX(3px)}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#f0f4ff}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  
  /* 📱 Phone Responsive: up to 767px */
  @media (max-width: 767px) {
    body{font-size:14px}
    h1{font-size:20px !important}
    h2{font-size:16px !important}
    h3{font-size:14px !important}
    p{font-size:12px !important}
    
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; padding: 0 8px !important; }
    .subject-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; padding: 12px 14px !important; }
    .subject-row-progress { width: 100% !important; justify-content: space-between !important; flex-wrap: wrap !important; }
    .topic-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
    .navbar-links { display: none !important; }
    
    /* Navbar adjustments */
    nav { padding: 0 12px !important; height: 50px !important; }
    
    /* Card and container adjustments */
    [style*="maxWidth: 1100"] { padding: 16px 12px !important; }
    [style*="maxWidth: 720"] { padding: 16px 12px !important; }
    [style*="maxWidth: 700"] { padding: 16px 12px !important; }
    [style*="maxWidth: 600"] { padding: 16px 12px !important; }
    [style*="maxWidth: 490"] { padding: 20px 16px !important; }
    
    /* Button and input adjustments */
    button { font-size: 12px !important; padding: 8px 12px !important; }
    input { font-size: 12px !important; padding: 8px 10px !important; }
    
    /* Filter bar flex wrap */
    [style*="display: flex"] [style*="gap: 12px"] { flex-wrap: wrap !important; }
  }
  
  /* 📲 Tablet Responsive: 768px – 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    body{font-size:14px}
    h1{font-size:22px !important}
    h2{font-size:17px !important}
    h3{font-size:15px !important}
    p{font-size:13px !important}
    
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
    .subject-row { gap: 14px !important; padding: 16px 18px !important; }
    .subject-row-progress { width: 100% !important; }
    .topic-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
    .navbar-links { display: flex !important; gap: 12px !important; font-size: 12px !important; }
    
    /* Container padding */
    [style*="maxWidth: 1100"] { padding: 24px 18px !important; }
    [style*="maxWidth: 720"] { padding: 20px 16px !important; }
    [style*="maxWidth: 700"] { padding: 20px 16px !important; }
    
    /* Button adjustments */
    button { font-size: 13px !important; padding: 10px 14px !important; }
    input { font-size: 13px !important; padding: 10px 12px !important; }
  }
  
  /* 💻 Desktop Responsive: 1024px and above */
  @media (min-width: 1024px) {
    body{font-size:15px}
    h1{font-size:28px !important}
    h2{font-size:19px !important}
    h3{font-size:16px !important}
    p{font-size:14px !important}
    
    .stats-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 14px !important; }
    .subject-row { gap: 16px !important; padding: 18px 20px !important; }
    .subject-row-progress { width: auto !important; }
    .topic-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
    .navbar-links { display: flex !important; gap: 8px !important; font-size: 14px !important; }
    
    /* Container padding */
    [style*="maxWidth: 1100"] { padding: 32px 24px !important; }
    [style*="maxWidth: 720"] { padding: 24px 20px !important; }
    [style*="maxWidth: 700"] { padding: 24px 20px !important; }
  }
`;

const GLOBAL_CSS_DARK = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#1a1a2e;color:#e0e0e0}
  button{font-family:inherit;cursor:pointer}
  input{font-family:inherit;background:#16213e;color:#e0e0e0;border:1px solid #2d3561;padding:8px 12px;border-radius:6px}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .fade-in{animation:fadeIn .35s ease both}
  .slide-up{animation:slideUp .4s ease both}
  .spin{animation:spin 1s linear infinite}
  .row-hover{transition:all .2s}
  .row-hover:hover{transform:translateX(3px)}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#1a1a2e}
  ::-webkit-scrollbar-thumb{background:#2d3561;border-radius:3px}
  
  /* 📱 Phone Responsive: up to 767px */
  @media (max-width: 767px) {
    body{font-size:14px}
    h1{font-size:20px !important}
    h2{font-size:16px !important}
    h3{font-size:14px !important}
    p{font-size:12px !important}
    
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; padding: 0 8px !important; }
    .subject-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; padding: 12px 14px !important; }
    .subject-row-progress { width: 100% !important; justify-content: space-between !important; flex-wrap: wrap !important; }
    .topic-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
    .navbar-links { display: none !important; }
    
    /* Navbar adjustments */
    nav { padding: 0 12px !important; height: 50px !important; }
    
    /* Card and container adjustments */
    [style*="maxWidth: 1100"] { padding: 16px 12px !important; }
    [style*="maxWidth: 720"] { padding: 16px 12px !important; }
    [style*="maxWidth: 700"] { padding: 16px 12px !important; }
    [style*="maxWidth: 600"] { padding: 16px 12px !important; }
    [style*="maxWidth: 490"] { padding: 20px 16px !important; }
    
    /* Button and input adjustments */
    button { font-size: 12px !important; padding: 8px 12px !important; }
    input { font-size: 12px !important; padding: 8px 10px !important; }
    
    /* Filter bar flex wrap */
    [style*="display: flex"] [style*="gap: 12px"] { flex-wrap: wrap !important; }
  }
  
  /* 📲 Tablet Responsive: 768px – 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    body{font-size:14px}
    h1{font-size:22px !important}
    h2{font-size:17px !important}
    h3{font-size:15px !important}
    p{font-size:13px !important}
    
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
    .subject-row { gap: 14px !important; padding: 16px 18px !important; }
    .subject-row-progress { width: 100% !important; }
    .topic-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
    .navbar-links { display: flex !important; gap: 12px !important; font-size: 12px !important; }
    
    /* Container padding */
    [style*="maxWidth: 1100"] { padding: 24px 18px !important; }
    [style*="maxWidth: 720"] { padding: 20px 16px !important; }
    [style*="maxWidth: 700"] { padding: 20px 16px !important; }
    
    /* Button adjustments */
    button { font-size: 13px !important; padding: 10px 14px !important; }
    input { font-size: 13px !important; padding: 10px 12px !important; }
  }
  
  /* 💻 Desktop Responsive: 1024px and above */
  @media (min-width: 1024px) {
    body{font-size:15px}
    h1{font-size:28px !important}
    h2{font-size:19px !important}
    h3{font-size:16px !important}
    p{font-size:14px !important}
    
    .stats-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 14px !important; }
    .subject-row { gap: 16px !important; padding: 18px 20px !important; }
    .subject-row-progress { width: auto !important; }
    .topic-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
    .navbar-links { display: flex !important; gap: 8px !important; font-size: 14px !important; }
    
    /* Container padding */
    [style*="maxWidth: 1100"] { padding: 32px 24px !important; }
    [style*="maxWidth: 720"] { padding: 24px 20px !important; }
    [style*="maxWidth: 700"] { padding: 24px 20px !important; }
  }
`;

// ────────────────────────────────────────────────────────────────────
// SUBJECTS  (all 13 subjects with full topic data)
// ────────────────────────────────────────────────────────────────────
const SUBJECTS = {
  core: [
    {
      id:"DSA", code:"DSA", name:"Data Structures & Algorithms",
      questions:320, difficulty:"Hard", tags:["Most Asked"], topics:48, done:24, progress:50,
      color:"#2563eb", bg:"#eff6ff", emoji:"⚡",
      topics_list:[
        { name:"Arrays",             count:30, done:true  },
        { name:"Linked Lists",       count:28, done:true  },
        { name:"Trees",              count:35, done:false },
        { name:"Graphs",             count:32, done:false },
        { name:"Dynamic Programming",count:40, done:false },
        { name:"Sorting",            count:22, done:false },
      ],
    },
    {
      id:"DBMS", code:"DBMS", name:"Database Management Systems",
      questions:180, difficulty:"Medium", tags:["Core"], topics:32, done:11, progress:35,
      color:"#16a34a", bg:"#f0fdf4", emoji:"🗄️",
      topics_list:[
        { name:"SQL",           count:28, done:true  },
        { name:"Normalization", count:20, done:true  },
        { name:"Transactions",  count:18, done:false },
        { name:"Indexing",      count:22, done:false },
        { name:"ER Diagrams",   count:15, done:false },
        { name:"NoSQL",         count:25, done:false },
      ],
    },
    {
      id:"OS", code:"OS", name:"Operating Systems",
      questions:210, difficulty:"Hard", tags:["Core"], topics:36, done:7, progress:20,
      color:"#7c3aed", bg:"#faf5ff", emoji:"⚙️",
      topics_list:[
        { name:"Processes",         count:30, done:true  },
        { name:"Threads",           count:22, done:false },
        { name:"Memory Management", count:28, done:false },
        { name:"Scheduling",        count:25, done:false },
        { name:"Deadlocks",         count:18, done:false },
        { name:"File Systems",      count:20, done:false },
      ],
    },
    {
      id:"CN", code:"CN", name:"Computer Networks",
      questions:160, difficulty:"Medium", tags:["Core"], topics:28, done:3, progress:10,
      color:"#dc2626", bg:"#fff5f5", emoji:"🌐",
      topics_list:[
        { name:"OSI Model",   count:20, done:true  },
        { name:"TCP/IP",      count:25, done:false },
        { name:"HTTP/HTTPS",  count:18, done:false },
        { name:"DNS",         count:15, done:false },
        { name:"Routing",     count:20, done:false },
        { name:"Security",    count:22, done:false },
      ],
    },
    {
      id:"SE", code:"SE", name:"Software Engineering",
      questions:120, difficulty:"Easy", tags:["Core"], topics:24, done:4, progress:15,
      color:"#0284c7", bg:"#f0f9ff", emoji:"🔧",
      topics_list:[
        { name:"SDLC",           count:18, done:true  },
        { name:"Agile",          count:20, done:false },
        { name:"Testing",        count:22, done:false },
        { name:"Design Patterns",count:25, done:false },
        { name:"UML",            count:15, done:false },
        { name:"DevOps",         count:20, done:false },
      ],
    },
    {
      id:"SD", code:"SD", name:"System Design",
      questions:90, difficulty:"Hard", tags:["Advanced"], topics:20, done:1, progress:5,
      color:"#d97706", bg:"#fffbeb", emoji:"🏗️",
      topics_list:[
        { name:"Scalability",    count:15, done:true  },
        { name:"Load Balancing", count:12, done:false },
        { name:"Caching",        count:14, done:false },
        { name:"Microservices",  count:18, done:false },
        { name:"Databases",      count:16, done:false },
        { name:"APIs",           count:15, done:false },
      ],
    },
    {
      id:"OOPS", code:"OOPS", name:"Object-Oriented Programming",
      questions:150, difficulty:"Medium", tags:["Core"], topics:22, done:13, progress:60,
      color:"#7c3aed", bg:"#faf5ff", emoji:"🧩",
      topics_list:[
        { name:"Inheritance",    count:22, done:true  },
        { name:"Polymorphism",   count:20, done:true  },
        { name:"Encapsulation",  count:18, done:true  },
        { name:"Abstraction",    count:16, done:false },
        { name:"Interfaces",     count:20, done:false },
        { name:"Design Patterns",count:25, done:false },
      ],
    },
  ],
  specialization: [
    {
      id:"WebDev", code:"WebDev", name:"Web Development",
      questions:200, difficulty:"Easy", tags:["Trending"], topics:40, done:18, progress:45,
      color:"#2563eb", bg:"#eff6ff", emoji:"💻",
      topics_list:[
        { name:"HTML/CSS",       count:30, done:true  },
        { name:"JavaScript",     count:35, done:true  },
        { name:"React",          count:32, done:false },
        { name:"REST APIs",      count:25, done:false },
        { name:"Authentication", count:20, done:false },
        { name:"Deployment",     count:18, done:false },
      ],
    },
    {
      id:"MERN", code:"MERN", name:"Full Stack Development (MERN)",
      questions:250, difficulty:"Hard", tags:["Trending"], topics:50, done:15, progress:30,
      color:"#16a34a", bg:"#f0fdf4", emoji:"🚀",
      topics_list:[
        { name:"MongoDB",    count:35, done:true  },
        { name:"Express.js", count:30, done:false },
        { name:"React",      count:40, done:false },
        { name:"Node.js",    count:38, done:false },
        { name:"JWT Auth",   count:25, done:false },
        { name:"Deployment", count:22, done:false },
      ],
    },
    {
      id:"Python", code:"Python", name:"Python Programming",
      questions:190, difficulty:"Easy", tags:["Popular"], topics:35, done:19, progress:55,
      color:"#d97706", bg:"#fffbeb", emoji:"🐍",
      topics_list:[
        { name:"Basics",     count:28, done:true  },
        { name:"OOP",        count:25, done:true  },
        { name:"Libraries",  count:30, done:true  },
        { name:"File I/O",   count:20, done:false },
        { name:"Decorators", count:22, done:false },
        { name:"Generators", count:18, done:false },
      ],
    },
    {
      id:"DS", code:"DS", name:"Data Science",
      questions:175, difficulty:"Hard", tags:["Trending"], topics:38, done:10, progress:25,
      color:"#db2777", bg:"#fdf2f8", emoji:"📊",
      topics_list:[
        { name:"NumPy",       count:22, done:true  },
        { name:"Pandas",      count:28, done:false },
        { name:"ML Basics",   count:30, done:false },
        { name:"Visualization",count:20, done:false },
        { name:"Statistics",  count:25, done:false },
        { name:"Sklearn",     count:28, done:false },
      ],
    },
    {
      id:"CD", code:"CD", name:"Compiler Design",
      questions:110, difficulty:"Hard", tags:["Advanced"], topics:26, done:2, progress:8,
      color:"#16a34a", bg:"#f0fdf4", emoji:"🔩",
      topics_list:[
        { name:"Lexical Analysis", count:18, done:true  },
        { name:"Parsing",          count:20, done:false },
        { name:"Syntax Trees",     count:16, done:false },
        { name:"Code Generation",  count:18, done:false },
        { name:"Optimization",     count:20, done:false },
        { name:"Grammars",         count:18, done:false },
      ],
    },
    {
      id:"TOC", code:"TOC", name:"Theory of Computation",
      questions:95, difficulty:"Hard", tags:["Advanced"], topics:22, done:3, progress:12,
      color:"#7c3aed", bg:"#faf5ff", emoji:"🧮",
      topics_list:[
        { name:"Automata",              count:15, done:true  },
        { name:"DFA/NFA",              count:18, done:false },
        { name:"Context-Free Grammars",count:16, done:false },
        { name:"Turing Machines",      count:14, done:false },
        { name:"Decidability",         count:16, done:false },
        { name:"Complexity",           count:16, done:false },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────
// COMPREHENSIVE MOCK QUESTION BANK  (works with no backend)
// ────────────────────────────────────────────────────────────────────
const MOCK_QUESTIONS = {
  Arrays: [
    { _id:"a1", question:"What is the time complexity of accessing an element in an array by index?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(n)"},{label:"C",text:"O(log n)"},{label:"D",text:"O(n²)"}], correct:"A", explanation:"Arrays store elements in contiguous memory. Index-based access is O(1) because we compute address = base + index × size directly.", difficulty:"Easy" },
    { _id:"a2", question:"Which operation is most expensive on a dynamic array (like ArrayList)?", options:[{label:"A",text:"Random access"},{label:"B",text:"Append at end"},{label:"C",text:"Insert at beginning"},{label:"D",text:"Get length"}], correct:"C", explanation:"Inserting at beginning shifts all n elements right, making it O(n). Random access is O(1), amortized append is O(1), length is O(1).", difficulty:"Medium" },
    { _id:"a3", question:"What is the space complexity of a 2D array of size m×n?", options:[{label:"A",text:"O(m+n)"},{label:"B",text:"O(m×n)"},{label:"C",text:"O(m²)"},{label:"D",text:"O(1)"}], correct:"B", explanation:"A 2D array has m rows and n columns, so it stores m×n elements total, giving O(m×n) space complexity.", difficulty:"Easy" },
    { _id:"a4", question:"Which sorting algorithm is best suited for nearly-sorted arrays?", options:[{label:"A",text:"Quick Sort"},{label:"B",text:"Merge Sort"},{label:"C",text:"Insertion Sort"},{label:"D",text:"Heap Sort"}], correct:"C", explanation:"Insertion Sort performs O(n) on nearly-sorted data because each element is close to its final position, requiring minimal swaps.", difficulty:"Medium" },
    { _id:"a5", question:"What does 'Two Pointer' technique primarily optimize?", options:[{label:"A",text:"Space complexity"},{label:"B",text:"Time complexity for linear scans"},{label:"C",text:"Recursion depth"},{label:"D",text:"Cache misses"}], correct:"B", explanation:"Two pointers reduce O(n²) nested loops to O(n) by maintaining two indices that move strategically through the array.", difficulty:"Medium" },
    { _id:"a6", question:"What is the result of rotating an array [1,2,3,4,5] right by 2 positions?", options:[{label:"A",text:"[3,4,5,1,2]"},{label:"B",text:"[4,5,1,2,3]"},{label:"C",text:"[2,3,4,5,1]"},{label:"D",text:"[5,1,2,3,4]"}], correct:"B", explanation:"Right rotation by 2: last 2 elements [4,5] come to front. Result: [4,5,1,2,3].", difficulty:"Easy" },
    { _id:"a7", question:"Which algorithm finds the maximum subarray sum in O(n)?", options:[{label:"A",text:"Brute Force"},{label:"B",text:"Divide and Conquer"},{label:"C",text:"Kadane's Algorithm"},{label:"D",text:"Binary Search"}], correct:"C", explanation:"Kadane's Algorithm scans the array once, maintaining current and global maximum sums, achieving O(n) time with O(1) space.", difficulty:"Medium" },
    { _id:"a8", question:"What is the worst-case time complexity of binary search on a sorted array?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(log n)"},{label:"C",text:"O(n)"},{label:"D",text:"O(n log n)"}], correct:"B", explanation:"Binary search halves the search space each step. Worst case is when element is not present: log₂(n) comparisons.", difficulty:"Easy" },
  ],
  Trees: [
    { _id:"t1", question:"What is the maximum number of nodes in a binary tree of height h?", options:[{label:"A",text:"2h"},{label:"B",text:"2h+1 - 1"},{label:"C",text:"h²"},{label:"D",text:"2h - 1"}], correct:"B", explanation:"A complete binary tree of height h has 2⁰+2¹+...+2ʰ = 2ʰ⁺¹-1 nodes at maximum.", difficulty:"Medium" },
    { _id:"t2", question:"Which traversal of a BST gives elements in sorted order?", options:[{label:"A",text:"Preorder"},{label:"B",text:"Postorder"},{label:"C",text:"Inorder"},{label:"D",text:"Level Order"}], correct:"C", explanation:"Inorder traversal (Left → Root → Right) of a BST visits nodes in ascending sorted order.", difficulty:"Easy" },
    { _id:"t3", question:"What is the height of a balanced BST with n nodes?", options:[{label:"A",text:"O(log n)"},{label:"B",text:"O(n)"},{label:"C",text:"O(√n)"},{label:"D",text:"O(n log n)"}], correct:"A", explanation:"A balanced BST maintains O(log n) height by keeping height difference ≤1 at every node.", difficulty:"Easy" },
    { _id:"t4", question:"What is the time complexity of LCA (Lowest Common Ancestor) in a binary tree?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(log n)"},{label:"C",text:"O(n)"},{label:"D",text:"O(n²)"}], correct:"C", explanation:"Finding LCA requires traversing the tree in worst case visiting all n nodes.", difficulty:"Medium" },
    { _id:"t5", question:"Which data structure is used for BFS traversal of a tree?", options:[{label:"A",text:"Stack"},{label:"B",text:"Queue"},{label:"C",text:"Priority Queue"},{label:"D",text:"Deque"}], correct:"B", explanation:"BFS uses a Queue (FIFO). Each level's nodes are enqueued and processed before the next level.", difficulty:"Easy" },
    { _id:"t6", question:"What makes an AVL tree self-balancing?", options:[{label:"A",text:"All leaves at same level"},{label:"B",text:"Balance factor ≤1 at every node"},{label:"C",text:"All nodes have 2 children"},{label:"D",text:"Red-black coloring"}], correct:"B", explanation:"AVL trees maintain balance factor (|height(left) - height(right)| ≤ 1) at every node, performing rotations when violated.", difficulty:"Hard" },
    { _id:"t7", question:"What is the space complexity of DFS on a tree with n nodes?", options:[{label:"A",text:"O(1)"},{label:"B",text:"O(log n)"},{label:"C",text:"O(h) where h is height"},{label:"D",text:"O(n²)"}], correct:"C", explanation:"DFS uses recursion stack proportional to tree height h. For balanced tree h=O(log n), for skewed tree h=O(n).", difficulty:"Medium" },
    { _id:"t8", question:"In a Trie, what does each node represent?", options:[{label:"A",text:"A complete word"},{label:"B",text:"A character of the key"},{label:"C",text:"A word frequency"},{label:"D",text:"A hash bucket"}], correct:"B", explanation:"Each Trie node represents a single character. A path from root to a marked node spells out a complete word.", difficulty:"Medium" },
  ],
  SQL: [
    { _id:"s1", question:"Which SQL clause is used to filter groups after GROUP BY?", options:[{label:"A",text:"WHERE"},{label:"B",text:"HAVING"},{label:"C",text:"FILTER"},{label:"D",text:"ON"}], correct:"B", explanation:"HAVING filters grouped records. WHERE filters before grouping, HAVING filters after. Use HAVING with aggregate functions.", difficulty:"Easy" },
    { _id:"s2", question:"What type of join returns all rows from both tables, filling NULL for no match?", options:[{label:"A",text:"INNER JOIN"},{label:"B",text:"LEFT JOIN"},{label:"C",text:"RIGHT JOIN"},{label:"D",text:"FULL OUTER JOIN"}], correct:"D", explanation:"FULL OUTER JOIN returns all rows from both tables. Where no match exists on either side, NULLs are filled.", difficulty:"Medium" },
    { _id:"s3", question:"What is the difference between DELETE and TRUNCATE?", options:[{label:"A",text:"No difference"},{label:"B",text:"DELETE is DDL, TRUNCATE is DML"},{label:"C",text:"DELETE can use WHERE, TRUNCATE removes all rows"},{label:"D",text:"TRUNCATE can be rolled back, DELETE cannot"}], correct:"C", explanation:"DELETE is DML — uses WHERE, fires triggers, can rollback. TRUNCATE is DDL — removes all rows faster, minimal logging.", difficulty:"Medium" },
    { _id:"s4", question:"Which normal form eliminates transitive dependencies?", options:[{label:"A",text:"1NF"},{label:"B",text:"2NF"},{label:"C",text:"3NF"},{label:"D",text:"BCNF"}], correct:"C", explanation:"3NF requires every non-prime attribute to be directly dependent on the primary key, not transitively through another non-prime attribute.", difficulty:"Hard" },
    { _id:"s5", question:"What does the ACID property 'Isolation' ensure?", options:[{label:"A",text:"Data is saved permanently"},{label:"B",text:"Concurrent transactions don't interfere"},{label:"C",text:"Transaction is all-or-nothing"},{label:"D",text:"Data remains consistent"}], correct:"B", explanation:"Isolation ensures concurrent transactions execute as if serially — one transaction's intermediate state is hidden from others.", difficulty:"Medium" },
    { _id:"s6", question:"Which index type is most efficient for range queries?", options:[{label:"A",text:"Hash Index"},{label:"B",text:"Bitmap Index"},{label:"C",text:"B-Tree Index"},{label:"D",text:"Full-Text Index"}], correct:"C", explanation:"B-Tree indexes maintain sorted order, making range queries (BETWEEN, >, <) very efficient with O(log n) traversal.", difficulty:"Hard" },
    { _id:"s7", question:"What does SELECT DISTINCT do?", options:[{label:"A",text:"Sorts the result set"},{label:"B",text:"Returns unique rows eliminating duplicates"},{label:"C",text:"Selects all columns"},{label:"D",text:"Joins two tables"}], correct:"B", explanation:"SELECT DISTINCT removes duplicate rows from the result set, returning only unique combinations of the selected columns.", difficulty:"Easy" },
    { _id:"s8", question:"What is a correlated subquery?", options:[{label:"A",text:"A subquery that runs once"},{label:"B",text:"A subquery referencing the outer query's column"},{label:"C",text:"A subquery in the FROM clause"},{label:"D",text:"A subquery with multiple results"}], correct:"B", explanation:"A correlated subquery references a column from the outer query and is re-executed for each row of the outer query.", difficulty:"Hard" },
  ],
  Processes: [
    { _id:"p1", question:"What is a process in Operating Systems?", options:[{label:"A",text:"A program stored on disk"},{label:"B",text:"A program in execution with its own memory space"},{label:"C",text:"A CPU instruction"},{label:"D",text:"A kernel thread"}], correct:"B", explanation:"A process is a program in execution. It includes the program code, current activity (PC, registers), and its own memory space.", difficulty:"Easy" },
    { _id:"p2", question:"Which process state comes after the 'Running' state when a process is preempted?", options:[{label:"A",text:"Terminated"},{label:"B",text:"Waiting"},{label:"C",text:"Ready"},{label:"D",text:"New"}], correct:"C", explanation:"When preempted by scheduler, process moves from Running → Ready (still in memory, not waiting for I/O).", difficulty:"Medium" },
    { _id:"p3", question:"What is a zombie process?", options:[{label:"A",text:"A process consuming all CPU"},{label:"B",text:"A terminated process whose exit status hasn't been read by parent"},{label:"C",text:"A process waiting for I/O"},{label:"D",text:"A background daemon process"}], correct:"B", explanation:"A zombie process has completed execution but stays in the process table because its parent hasn't called wait() to read its exit status.", difficulty:"Hard" },
    { _id:"p4", question:"What system call creates a child process in Unix?", options:[{label:"A",text:"exec()"},{label:"B",text:"clone()"},{label:"C",text:"fork()"},{label:"D",text:"spawn()"}], correct:"C", explanation:"fork() creates an exact copy of the calling process. The child gets a duplicate of the parent's memory space. exec() replaces process image.", difficulty:"Medium" },
    { _id:"p5", question:"What is the difference between a process and a thread?", options:[{label:"A",text:"Threads have separate memory space"},{label:"B",text:"Processes share memory, threads don't"},{label:"C",text:"Threads share process memory, processes don't"},{label:"D",text:"No difference"}], correct:"C", explanation:"Threads share the same address space (heap, global vars) within a process. Processes have separate memory spaces with IPC for communication.", difficulty:"Medium" },
    { _id:"p6", question:"What is context switching?", options:[{label:"A",text:"Switching between programming languages"},{label:"B",text:"Saving and restoring CPU state to switch between processes"},{label:"C",text:"Changing network context"},{label:"D",text:"Switching disk sectors"}], correct:"B", explanation:"Context switch saves the state (registers, PC, stack) of the current process and restores the saved state of the next process to run.", difficulty:"Medium" },
    { _id:"p7", question:"Which scheduling algorithm may cause starvation?", options:[{label:"A",text:"Round Robin"},{label:"B",text:"FCFS"},{label:"C",text:"Priority Scheduling"},{label:"D",text:"Multilevel Queue"}], correct:"C", explanation:"Priority Scheduling can starve low-priority processes if high-priority processes continuously arrive. Solution: aging (gradually increase priority).", difficulty:"Hard" },
    { _id:"p8", question:"What is an orphan process?", options:[{label:"A",text:"A process with no children"},{label:"B",text:"A process whose parent has terminated"},{label:"C",text:"A process waiting for input"},{label:"D",text:"A newly created process"}], correct:"B", explanation:"An orphan process is one whose parent terminated before it. The OS re-parents it to init (PID 1) which will call wait().", difficulty:"Hard" },
  ],
  JavaScript: [
    { _id:"j1", question:"What is the output of: typeof null?", options:[{label:"A",text:'"null"'},{label:"B",text:'"undefined"'},{label:"C",text:'"object"'},{label:"D",text:'"string"'}], correct:"C", explanation:"typeof null returns 'object' — this is a famous JavaScript bug that exists for historical reasons and cannot be fixed without breaking legacy code.", difficulty:"Easy" },
    { _id:"j2", question:"What does the '===' operator check?", options:[{label:"A",text:"Value equality only"},{label:"B",text:"Reference equality"},{label:"C",text:"Value and type equality"},{label:"D",text:"Deep equality"}], correct:"C", explanation:"=== is strict equality — checks both value AND type without coercion. 1 === '1' is false. == coerces types: 1 == '1' is true.", difficulty:"Easy" },
    { _id:"j3", question:"What is a closure in JavaScript?", options:[{label:"A",text:"A way to close a browser window"},{label:"B",text:"A function that remembers its outer scope variables"},{label:"C",text:"An error handling mechanism"},{label:"D",text:"A method to terminate a loop"}], correct:"B", explanation:"A closure is a function that retains access to its outer lexical scope even after the outer function has returned.", difficulty:"Medium" },
    { _id:"j4", question:"Which of these creates a genuine copy (not reference) of an object?", options:[{label:"A",text:"let b = a"},{label:"B",text:"let b = Object.assign({}, a)"},{label:"C",text:"let b = JSON.parse(JSON.stringify(a))"},{label:"D",text:"let b = a.copy()"}], correct:"C", explanation:"JSON.parse(JSON.stringify(a)) creates a deep clone. Object.assign is shallow (nested objects still reference). Primitive: b=a copies value, objects: b=a copies reference.", difficulty:"Hard" },
    { _id:"j5", question:"What is event bubbling?", options:[{label:"A",text:"Events propagating from child to parent elements"},{label:"B",text:"Events propagating from parent to child elements"},{label:"C",text:"Async event execution"},{label:"D",text:"DOM event creation"}], correct:"A", explanation:"Event bubbling: events propagate upward from target element to root. Click on a button → button handler → div handler → body handler.", difficulty:"Medium" },
    { _id:"j6", question:"What does Promise.all() do?", options:[{label:"A",text:"Runs promises sequentially"},{label:"B",text:"Returns first resolved promise"},{label:"C",text:"Runs promises in parallel, resolves when all complete"},{label:"D",text:"Ignores rejected promises"}], correct:"C", explanation:"Promise.all() runs all promises concurrently and resolves with array of results when ALL resolve. If any rejects, it immediately rejects.", difficulty:"Medium" },
    { _id:"j7", question:"What is the 'this' keyword in an arrow function?", options:[{label:"A",text:"Refers to the arrow function itself"},{label:"B",text:"Refers to the global object"},{label:"C",text:"Lexically inherited from surrounding scope"},{label:"D",text:"Undefined always"}], correct:"C", explanation:"Arrow functions don't have their own 'this'. They inherit 'this' from the enclosing lexical scope at the time of definition.", difficulty:"Hard" },
    { _id:"j8", question:"What is the difference between let and var?", options:[{label:"A",text:"No difference"},{label:"B",text:"let is block-scoped, var is function-scoped"},{label:"C",text:"var is block-scoped, let is global"},{label:"D",text:"let cannot be reassigned"}], correct:"B", explanation:"var is function-scoped and hoisted. let is block-scoped ({}) and not accessible before declaration (temporal dead zone).", difficulty:"Medium" },
  ],
  Basics: [
    { _id:"b1", question:"What is Python's GIL (Global Interpreter Lock)?", options:[{label:"A",text:"A security mechanism"},{label:"B",text:"A mutex preventing multiple threads from executing Python bytecode simultaneously"},{label:"C",text:"A garbage collector lock"},{label:"D",text:"A module import lock"}], correct:"B", explanation:"GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time, limiting true multi-threading for CPU-bound tasks.", difficulty:"Hard" },
    { _id:"b2", question:"Which Python data type is immutable?", options:[{label:"A",text:"List"},{label:"B",text:"Dictionary"},{label:"C",text:"Set"},{label:"D",text:"Tuple"}], correct:"D", explanation:"Tuples are immutable — once created, their elements cannot be changed. Lists, dicts, and sets are mutable.", difficulty:"Easy" },
    { _id:"b3", question:"What does list comprehension [x*2 for x in range(5)] produce?", options:[{label:"A",text:"[0,1,2,3,4]"},{label:"B",text:"[0,2,4,6,8]"},{label:"C",text:"[2,4,6,8,10]"},{label:"D",text:"[1,2,3,4,5]"}], correct:"B", explanation:"range(5) gives [0,1,2,3,4]. Multiplying each by 2: [0,2,4,6,8].", difficulty:"Easy" },
    { _id:"b4", question:"What is the purpose of *args in a Python function?", options:[{label:"A",text:"Passes a dictionary of keyword arguments"},{label:"B",text:"Passes a variable number of positional arguments as a tuple"},{label:"C",text:"Unpacks a list"},{label:"D",text:"Declares a global variable"}], correct:"B", explanation:"*args collects extra positional arguments into a tuple, allowing a function to accept any number of positional arguments.", difficulty:"Medium" },
    { _id:"b5", question:"What is a Python generator?", options:[{label:"A",text:"A function that returns a list"},{label:"B",text:"A function using yield to lazily produce values one at a time"},{label:"C",text:"A class that generates random numbers"},{label:"D",text:"An iterator class"}], correct:"B", explanation:"Generators use yield to produce values lazily. They pause execution after each yield, resuming on next(). Memory-efficient for large sequences.", difficulty:"Medium" },
    { _id:"b6", question:"What does the walrus operator ':=' do in Python 3.8+?", options:[{label:"A",text:"Compares two values"},{label:"B",text:"Assigns a value and returns it in an expression"},{label:"C",text:"Creates a dictionary"},{label:"D",text:"Merges two dictionaries"}], correct:"B", explanation:"The walrus operator := (assignment expression) assigns a value and returns it simultaneously, useful in while loops and comprehensions.", difficulty:"Hard" },
    { _id:"b7", question:"What is the difference between '==' and 'is' in Python?", options:[{label:"A",text:"No difference"},{label:"B",text:"== checks value equality, is checks identity (same object)"},{label:"C",text:"is checks value, == checks type"},{label:"D",text:"is is for numbers only"}], correct:"B", explanation:"== compares values (a==b). 'is' checks identity — whether both refer to the exact same object in memory (id(a)==id(b)).", difficulty:"Medium" },
    { _id:"b8", question:"What is a Python decorator?", options:[{label:"A",text:"A CSS-like styling mechanism"},{label:"B",text:"A function that wraps another function to add behavior"},{label:"C",text:"A class inheritance pattern"},{label:"D",text:"A type annotation"}], correct:"B", explanation:"Decorators (@decorator_name) are functions that wrap other functions, adding behavior before/after without modifying the original function.", difficulty:"Medium" },
  ],
  MongoDB: [
    { _id:"m1", question:"What type of database is MongoDB?", options:[{label:"A",text:"Relational Database"},{label:"B",text:"Document-Oriented NoSQL Database"},{label:"C",text:"Graph Database"},{label:"D",text:"Column-Store Database"}], correct:"B", explanation:"MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like BSON documents instead of rows and columns.", difficulty:"Easy" },
    { _id:"m2", question:"What does BSON stand for in MongoDB?", options:[{label:"A",text:"Binary Standard Object Notation"},{label:"B",text:"Binary JavaScript Object Notation"},{label:"C",text:"Basic Serialized Object Notation"},{label:"D",text:"Binary Serialized Object Node"}], correct:"B", explanation:"BSON (Binary JSON) is the binary-encoded serialization format MongoDB uses to store documents. It extends JSON with additional data types like Date and ObjectId.", difficulty:"Medium" },
    { _id:"m3", question:"Which MongoDB method retrieves documents matching a condition?", options:[{label:"A",text:"db.collection.get()"},{label:"B",text:"db.collection.find()"},{label:"C",text:"db.collection.select()"},{label:"D",text:"db.collection.fetch()"}], correct:"B", explanation:"find() retrieves all matching documents. findOne() retrieves the first match. Both accept query objects: db.users.find({age: {$gt: 18}})", difficulty:"Easy" },
    { _id:"m4", question:"What is an index in MongoDB and why use it?", options:[{label:"A",text:"A backup copy of data"},{label:"B",text:"A special data structure that speeds up queries"},{label:"C",text:"A schema definition"},{label:"D",text:"A replica set member"}], correct:"B", explanation:"Indexes store a small portion of data in an easy-to-traverse form. Without indexes, MongoDB scans every document (collection scan). With indexes, queries are O(log n).", difficulty:"Medium" },
    { _id:"m5", question:"What does the $lookup aggregation stage do?", options:[{label:"A",text:"Looks up a value in an array"},{label:"B",text:"Performs a LEFT JOIN with another collection"},{label:"C",text:"Searches text fields"},{label:"D",text:"Filters documents"}], correct:"B", explanation:"$lookup performs a left outer join between two collections in the same database, allowing you to combine data like SQL JOIN.", difficulty:"Hard" },
    { _id:"m6", question:"What is a MongoDB replica set?", options:[{label:"A",text:"A backup file"},{label:"B",text:"A group of mongod instances maintaining the same data for high availability"},{label:"C",text:"Multiple databases"},{label:"D",text:"A sharding configuration"}], correct:"B", explanation:"A replica set is a group of mongod processes that maintain the same dataset. It provides redundancy and high availability with automatic failover.", difficulty:"Hard" },
    { _id:"m7", question:"Which operator finds documents where a field value is in an array?", options:[{label:"A",text:"$contains"},{label:"B",text:"$in"},{label:"C",text:"$within"},{label:"D",text:"$includes"}], correct:"B", explanation:"$in selects documents where field value matches any value in specified array: {status: {$in: ['active', 'pending']}}.", difficulty:"Medium" },
    { _id:"m8", question:"What is mongoose in Node.js?", options:[{label:"A",text:"A MongoDB client"},{label:"B",text:"An ODM (Object Document Mapper) for MongoDB with schema validation"},{label:"C",text:"A database GUI tool"},{label:"D",text:"A test framework"}], correct:"B", explanation:"Mongoose is an ODM library for MongoDB and Node.js. It provides schema-based modeling, validation, query building, and business logic hooks.", difficulty:"Medium" },
  ],
};

// fallback for topics without specific questions
function getDefaultQuestions(topic) {
  return Array.from({ length: 8 }, (_, i) => ({
    _id: `${topic}_${i}`,
    question: `[${topic}] Question ${i+1}: What is the key concept behind ${topic} and how does it apply in real-world scenarios?`,
    options: [
      { label:"A", text:`Correct answer: The fundamental principle of ${topic}` },
      { label:"B", text:"Incorrect: A commonly confused alternative approach" },
      { label:"C", text:"Incorrect: A plausible but wrong implementation detail" },
      { label:"D", text:"Incorrect: An edge case that doesn't apply here" },
    ],
    correct:"A",
    explanation:`In ${topic}, option A is correct because it accurately represents the core concept. Understanding this is essential for interviews.`,
    difficulty: ["Easy","Medium","Hard"][i%3],
  }));
}

function getMockQuestions(topic) {
  return MOCK_QUESTIONS[topic] || getDefaultQuestions(topic);
}

// ────────────────────────────────────────────────────────────────────
// API LAYER  (falls back to mock on any error)
// ────────────────────────────────────────────────────────────────────
async function apiFetchQuestions(subjectCode, topic, limit=10) {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ topic, limit });
    const res = await fetch(`${API_BASE}/subjects/${subjectCode}/questions?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return (data.questions || data || []).slice(0, limit);
  } catch (err) {
    console.log("Failed to fetch questions from database:", err.message);
    return getMockQuestions(topic).slice(0, limit);
  }
}

async function apiSubmitAnswer(subjectCode, questionId, selectedOption, isCorrect) {
  try {
    await fetch(`${API_BASE}/progress/submit`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ subjectCode, questionId, selectedOption, isCorrect }),
      signal: AbortSignal.timeout(3000),
    });
  } catch { /* silent — we still track locally */ }
}

// ────────────────────────────────────────────────────────────────────
// LOCAL PROGRESS STORAGE  (works without backend)
// ────────────────────────────────────────────────────────────────────
const localProgress = {};   // { DSA: { Arrays: { correct:3, total:8 } } }

function recordLocalProgress(code, topic, isCorrect) {
  if (!localProgress[code]) localProgress[code] = {};
  if (!localProgress[code][topic]) localProgress[code][topic] = { correct:0, total:0 };
  localProgress[code][topic].total++;
  if (isCorrect) localProgress[code][topic].correct++;
}

// ────────────────────────────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ────────────────────────────────────────────────────────────────────

function DiffBadge({ difficulty }) {
  const cfg = { Easy:["#16a34a","#f0fdf4"], Medium:["#d97706","#fffbeb"], Hard:["#dc2626","#fff5f5"] };
  const [clr, bg] = cfg[difficulty] || ["#888","#f3f4f6"];
  return <span style={{fontSize:12,fontWeight:700,color:clr,background:bg,padding:"3px 9px",borderRadius:20}}>{difficulty}</span>;
}

function TagPill({ tag, color }) {
  return (
    <span style={{fontSize:11,fontWeight:700,color:color,background:color+"18",border:`1px solid ${color}30`,padding:"2px 9px",borderRadius:20}}>
      + {tag}
    </span>
  );
}

function ProgressBar({ pct, color, height=6 }) {
  return (
    <div style={{background:"#e5e7eb",borderRadius:999,height,overflow:"hidden"}}>
      <div style={{width:`${Math.min(pct,100)}%`,background:color,height:"100%",borderRadius:999,transition:"width .5s ease"}} />
    </div>
  );
}

function CircleRing({ pct, color, size=54 }) {
  const r=(size-8)/2, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray .6s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={11} fontWeight={700}
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {pct}%
      </text>
    </svg>
  );
}

function Spinner({ color="#2563eb" }) {
  return <div className="spin" style={{width:36,height:36,border:`4px solid ${color}30`,borderTop:`4px solid ${color}`,borderRadius:"50%"}} />;
}

// ────────────────────────────────────────────────────────────────────
// NAVBAR
// ────────────────────────────────────────────────────────────────────
function Navbar({ view, onNavigate, onLogout }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const links = ["Home","Dashboard","Subjects","Progress","Interview Rounds","Test"];
  
  const handleNav = (n) => {
    if (n === "Subjects") onNavigate("subjects");
    else navigate(n === "Home" ? "/" : `/${n.toLowerCase().replace(' ', '-')}`);
  };

  const bgColor = isDarkMode ? "#16213e" : "#fff";
  const borderColor = isDarkMode ? "#2d3561" : "#e5e7eb";
  const textColor = isDarkMode ? "#e0e0e0" : "#555";
  const primaryColor = "#2563eb";

  return (
    <nav style={{background:bgColor,borderBottom:`1px solid ${borderColor}`,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 4px rgba(0,0,0,.06)",transition:"all 0.3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10, cursor: "pointer"}} onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", transition: "all 0.3s ease" }} 
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
        <span style={{fontWeight:900,fontSize:19,color:isDarkMode?"#e0e0e0":"#111",letterSpacing:-.3,transition:"color 0.3s ease"}}>InterviewAce</span>
      </div>
      <div className="navbar-links" style={{display:"flex",gap:6}}>
        {links.map(n=>(
          <button key={n} onClick={()=>handleNav(n)}
            style={{background:"none",border:"none",fontSize:14,color:(n==="Subjects" && view!=="dashboard")?primaryColor:textColor,fontWeight:(n==="Subjects" && view!=="dashboard")?700:500,cursor:"pointer",padding:"6px 12px",borderRadius:8,borderBottom:(n==="Subjects" && view!=="dashboard")?`2px solid ${primaryColor}`:"2px solid transparent",transition:"all .15s"}}
            onMouseOver={e=>{if(n!=="Subjects")e.currentTarget.style.background=isDarkMode?"#2d3561":"#f3f4f6"}}
            onMouseOut={e=>e.currentTarget.style.background="none"}
          >{n}</button>
        ))}
      </div>
      <ProfileSidebar />
    </nav>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUBJECT CARD (modal popup on click)
// ────────────────────────────────────────────────────────────────────
function SubjectModal({ subject, onClose, onContinue }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div className="slide-up" style={{background:"#fff",borderRadius:24,padding:"34px 30px",maxWidth:490,width:"100%",position:"relative",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:32,height:32,borderRadius:"50%",border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}>✕</button>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
          <div style={{width:66,height:66,borderRadius:18,background:subject.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,border:`1.5px solid ${subject.color}20`}}>
            {subject.emoji}
          </div>
          <div>
            <h2 style={{margin:"0 0 4px",fontSize:21,fontWeight:800,color:"#111"}}>{subject.name}</h2>
            <p style={{margin:0,color:"#888",fontSize:13}}>{subject.code} · {subject.questions} Interview Questions</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:22}}>
          {[
            {label:"PROGRESS", value:`${subject.progress}%`, color:subject.color},
            {label:"TOPICS",   value:`${subject.done}/${subject.topics}`, color:"#111"},
            {label:"DIFFICULTY",value:subject.difficulty, color:subject.difficulty==="Hard"?"#dc2626":subject.difficulty==="Medium"?"#d97706":"#16a34a"},
          ].map(c=>(
            <div key={c.label} style={{background:"#f8f9fa",borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#888",fontWeight:700,letterSpacing:.8,marginBottom:6}}>{c.label}</div>
              <div style={{fontSize:20,fontWeight:800,color:c.color}}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Topics chips */}
        <div style={{marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:14,fontWeight:700}}>📊 Curriculum Topics</span>
            <span style={{background:"#f3f4f6",borderRadius:20,padding:"2px 10px",fontSize:12,color:"#555",fontWeight:600}}>{subject.topics_list.length} Total</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {subject.topics_list.map(t=>(
              <span key={t.name} style={{background:subject.color+"14",color:subject.color,padding:"5px 13px",borderRadius:20,fontSize:13,fontWeight:600,border:`1px solid ${subject.color}28`}}>
                {t.name} {t.done ? "✓" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{marginBottom:26}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:14,color:"#555"}}>Current Completion</span>
            <span style={{fontSize:14,color:subject.color,fontWeight:700}}>{subject.progress}%</span>
          </div>
          <ProgressBar pct={subject.progress} color={subject.color} height={8}/>
        </div>

        <button onClick={()=>onContinue(subject)}
          style={{width:"100%",padding:"17px",background:subject.color,color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:.2,transition:"opacity .2s"}}
          onMouseOver={e=>e.target.style.opacity=.88} onMouseOut={e=>e.target.style.opacity=1}>
          Continue Preparation →
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUBJECT ROW  (list item on subjects page)
// ────────────────────────────────────────────────────────────────────
function SubjectRow({ subject, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="row-hover subject-row"
      onClick={()=>onClick(subject)}
      onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}
      style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",background:hover?subject.color+"08":"#fff",borderRadius:15,border:`1.5px solid ${hover?subject.color+"60":"#e5e7eb"}`,cursor:"pointer",marginBottom:10,boxShadow:hover?"0 4px 18px rgba(0,0,0,.07)":"none",transition:"all .2s"}}>

      {/* Icon */}
      <div style={{width:46,height:46,borderRadius:13,background:subject.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${subject.color}20`}}>
        {subject.emoji}
      </div>

      {/* Info */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:700,color:"#111",marginBottom:5}}>
          {subject.name} <span style={{color:"#aaa",fontWeight:400,fontSize:13}}>({subject.code})</span>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {subject.tags.map(t=><TagPill key={t} tag={t} color={subject.color}/>)}
          <DiffBadge difficulty={subject.difficulty}/>
          <span style={{fontSize:11,color:"#888"}}>📋 {subject.questions} Qs</span>
        </div>
      </div>

      {/* Progress */}
      <div className="subject-row-progress" style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <div style={{width:120}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:13,fontWeight:700,color:subject.color}}>{subject.progress}%</span>
            <span style={{fontSize:12,color:"#888"}}>{subject.done}/{subject.topics} topics</span>
          </div>
          <ProgressBar pct={subject.progress} color={subject.color}/>
        </div>
        <CircleRing pct={subject.progress} color={subject.color}/>
        <button style={{padding:"9px 18px",background:"#fff",border:`1.5px solid ${subject.color}`,color:subject.color,borderRadius:10,fontSize:13,fontWeight:700,transition:"all .2s",whiteSpace:"nowrap"}}
          onMouseOver={e=>{e.currentTarget.style.background=subject.color;e.currentTarget.style.color="#fff"}}
          onMouseOut={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color=subject.color}}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUBJECTS PAGE
// ────────────────────────────────────────────────────────────────────
function SubjectsPageContent({ onSelectSubject }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);

  const all = [...SUBJECTS.core, ...SUBJECTS.specialization];
  const avgProgress = Math.round(all.reduce((a,s)=>a+s.progress,0)/all.length);

  const filtered = list => list.filter(s => {
    const ms = filter==="All" || s.difficulty===filter;
    const mq = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.topics_list.some(t=>t.name.toLowerCase().includes(search.toLowerCase()));
    return ms && mq;
  });

  return (
    <div className="fade-in" style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px"}}>
      {/* Title */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <span style={{fontSize:30}}>📚</span>
        <h1 style={{fontSize:28,fontWeight:900,letterSpacing:-.4}}>Engineering Subjects</h1>
      </div>
      <p style={{color:"#888",marginBottom:28,fontSize:15}}>Master interviews across all core and specialization disciplines</p>

      {/* Stat cards */}
      <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[
          {icon:"📖",val:all.length,   label:"Total Subjects", color:"#2563eb"},
          {icon:"⏳",val:all.length,   label:"In Progress",    color:"#7c3aed"},
          {icon:"✅",val:0,            label:"Completed",      color:"#16a34a"},
          {icon:"📈",val:`${avgProgress}%`,label:"Avg Progress",color:"#d97706"},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:16,padding:"20px 18px",border:"1px solid #e5e7eb",boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:28,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:13,color:"#888",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:28,background:"#fff",padding:"14px 18px",borderRadius:14,border:"1px solid #e5e7eb",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:250,display:"flex",alignItems:"center",gap:8,background:"#f8f9fa",borderRadius:10,padding:"9px 14px"}}>
          <span style={{color:"#aaa",fontSize:15}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subjects or topics..."
            style={{border:"none",background:"none",outline:"none",fontSize:14,flex:1,color:"#111"}}/>
          {search && <button onClick={()=>setSearch("")} style={{border:"none",background:"none",color:"#aaa",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
        <div style={{display:"flex", gap: 8}}>
          {["All","Easy","Medium","Hard"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"9px 20px",borderRadius:10,border:"none",fontSize:13,fontWeight:700,cursor:"pointer",background:filter===f?"#2563eb":"#f3f4f6",color:filter===f?"#fff":"#555",transition:"all .2s"}}>
              {f}
            </button>
          ))}
        </div>
        <span style={{fontSize:13,color:"#aaa",whiteSpace:"nowrap", marginLeft:"auto"}}>{all.length} subjects</span>
      </div>

      {/* Core subjects */}
      <section style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:4,height:22,background:"#2563eb",borderRadius:2}}/>
          <h2 style={{fontSize:19,fontWeight:800}}>Core Engineering Subjects</h2>
          <span style={{background:"#eff6ff",color:"#2563eb",padding:"3px 12px",borderRadius:20,fontSize:13,fontWeight:700}}>{SUBJECTS.core.length}</span>
        </div>
        {filtered(SUBJECTS.core).length===0
          ? <div style={{textAlign:"center",padding:"40px",color:"#aaa",background:"#fff",borderRadius:14,border:"1px dashed #e5e7eb"}}>No subjects match your filter</div>
          : filtered(SUBJECTS.core).map(s=><SubjectRow key={s.id} subject={s} onClick={setModal}/>)}
      </section>

      {/* Specialization subjects */}
      <section style={{marginBottom:40}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:4,height:22,background:"#16a34a",borderRadius:2}}/>
          <h2 style={{fontSize:19,fontWeight:800}}>Specialization & Programming</h2>
          <span style={{background:"#f0fdf4",color:"#16a34a",padding:"3px 12px",borderRadius:20,fontSize:13,fontWeight:700}}>{SUBJECTS.specialization.length}</span>
        </div>
        {filtered(SUBJECTS.specialization).length===0
          ? <div style={{textAlign:"center",padding:"40px",color:"#aaa",background:"#fff",borderRadius:14,border:"1px dashed #e5e7eb"}}>No subjects match your filter</div>
          : filtered(SUBJECTS.specialization).map(s=><SubjectRow key={s.id} subject={s} onClick={setModal}/>)}
      </section>

      {/* CTA */}
      <div style={{background:"linear-gradient(135deg,#1e40af 0%,#3b82f6 100%)",borderRadius:22,padding:"34px 38px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20, flexWrap:"wrap"}}>
        <div>
          <h3 style={{margin:"0 0 8px",color:"#fff",fontSize:22,fontWeight:800}}>Ready to Ace Your Interview?</h3>
          <p style={{margin:0,color:"#bfdbfe",fontSize:14,lineHeight:1.6}}>Practice simulated interview rounds based on your subject preparation and get real-time feedback.</p>
        </div>
        <div style={{display:"flex",gap:12,flexShrink:0}}>
          <button style={{padding:"13px 22px",background:"rgba(255,255,255,.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,.5)",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",backdropFilter:"blur(8px)"}}>
            Start Interview Round →
          </button>
          <button style={{padding:"13px 22px",background:"rgba(255,255,255,.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,.5)",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
            View Progress
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal && <SubjectModal subject={modal} onClose={()=>setModal(null)} onContinue={s=>{setModal(null);onSelectSubject(s);}}/>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// TOPIC SELECTOR PAGE
// ────────────────────────────────────────────────────────────────────
function TopicSelectorPage({ subject, onSelectTopic, onBack }) {
  const progress = localProgress[subject.code] || {};
  return (
    <div className="fade-in" style={{minHeight:"100vh",background:"#f0f4ff",padding:"24px 20px"}}>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        <button onClick={onBack} style={{border:"none",background:"none",color:"#2563eb",fontSize:14,cursor:"pointer",marginBottom:20,fontWeight:700,padding:0,display:"flex",alignItems:"center",gap:6}}>
          ← Back to Subjects
        </button>

        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
          <div style={{width:56,height:56,borderRadius:16,background:subject.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`1.5px solid ${subject.color}20`}}>
            {subject.emoji}
          </div>
          <div>
            <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:800}}>{subject.name}</h1>
            <p style={{margin:0,color:"#888",fontSize:13}}>{subject.topics_list.length} topics · {subject.questions} questions · <DiffBadge difficulty={subject.difficulty}/></p>
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:16,padding:"18px 20px",marginBottom:24,border:"1px solid #e5e7eb"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:14,fontWeight:600}}>Overall Progress</span>
            <span style={{fontSize:14,color:subject.color,fontWeight:700}}>{subject.progress}%</span>
          </div>
          <ProgressBar pct={subject.progress} color={subject.color} height={10}/>
        </div>

        <h2 style={{fontSize:17,fontWeight:700,marginBottom:16,color:"#333"}}>Choose a Topic to Practice</h2>

        <div className="topic-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {subject.topics_list.map((topic,i)=>{
            const topicProgress = progress[topic.name];
            const acc = topicProgress ? Math.round((topicProgress.correct/topicProgress.total)*100) : null;
            return (
              <button key={topic.name} onClick={()=>onSelectTopic(topic.name)}
                style={{background:"#fff",border:`1.5px solid ${subject.color}28`,borderRadius:16,padding:"20px",textAlign:"left",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",gap:8,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=subject.color;e.currentTarget.style.background=subject.bg;e.currentTarget.style.boxShadow=`0 6px 20px ${subject.color}20`}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=subject.color+"28";e.currentTarget.style.background="#fff";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <span style={{fontSize:15,fontWeight:700,color:"#111"}}>{topic.name}</span>
                  {topic.done && <span style={{fontSize:12,background:"#f0fdf4",color:"#16a34a",padding:"2px 8px",borderRadius:20,fontWeight:700}}>✓ Done</span>}
                </div>
                <div style={{fontSize:12,color:"#888"}}>{topic.count} questions</div>
                {acc !== null && (
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <ProgressBar pct={acc} color={acc>=70?"#16a34a":acc>=40?"#d97706":"#dc2626"}/>
                    <span style={{fontSize:12,fontWeight:700,color:acc>=70?"#16a34a":acc>=40?"#d97706":"#dc2626"}}>{acc}%</span>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <span style={{fontSize:13,color:subject.color,fontWeight:700}}>{topicProgress ? "Retry →" : "Start →"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// MCQ PRACTICE PAGE  (NEW: Sidebar + No timer + Comprehensive Results)
// ────────────────────────────────────────────────────────────────────
function MCQPracticePage({ subject, topic, onBack, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [finished, setFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(600); // 10 minutes
  const timerRef = useRef(null);

  // Load questions
  useEffect(()=>{
    setLoading(true);
    apiFetchQuestions(subject.code, topic, 10).then(qs=>{setQuestions(qs);setLoading(false);});
  },[subject.code, topic]);

  // Total timer (10 min for entire quiz)
  useEffect(()=>{
    if(loading || finished || questions.length===0) return;
    timerRef.current = setInterval(()=>{
      setTotalTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); handleFinish(); return 0; }
        return t-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[loading, finished, questions.length]);

  const handleAnswer = (idx, label)=>{
    setAnswers(a=>({...a,[idx]:label}));
    setVisited(v=>({...v,[idx]:true}));
    recordLocalProgress(subject.code, topic, label===questions[idx].correct);
    apiSubmitAnswer(subject.code, questions[idx]._id, label, label===questions[idx].correct);
  };

  const goToQuestion = (idx)=>{
    setCurrent(idx);
    setVisited(v=>({...v,[idx]:true}));
  };

  const handleFinish = ()=>{
    clearInterval(timerRef.current);
    setFinished(true);
  };

  const handleRetry = ()=>{
    setAnswers({});
    setCurrent(0);
    setTotalTime(600);
    setFinished(false);
  };

  // ── LOADING ──
  if(loading) return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f0f4ff",gap:16}}>
      <Spinner color={subject.color}/>
      <p style={{color:"#888",fontSize:15}}>Loading {topic} questions...</p>
    </div>
  );

  // ── RESULTS SCREEN ──
  if(finished){
    const answeredCount = Object.keys(answers).length;
    const results = questions.map((q, i)=>{
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correct;
      return { q, userAnswer, isCorrect };
    });
    const score = results.filter(r=>r.isCorrect).length;
    const pct = Math.round((score/questions.length)*100);
    const byDifficulty = {Easy:0, Medium:0, Hard:0, correctEasy:0, correctMedium:0, correctHard:0};
    results.forEach(r=>{
      const diff = r.q.difficulty || "Medium";
      byDifficulty[diff]++;
      if(r.isCorrect) byDifficulty[`correct${diff}`]++;
    });
    const grade = pct>=80?"🏆 Excellent!":pct>=60?"👍 Good Job!":pct>=40?"📖 Keep Practicing":"💪 Keep Trying!";

    return (
      <div className="fade-in" style={{minHeight:"100vh",background:"#f0f4ff",padding:"24px 20px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          {/* Result header */}
          <div style={{background:"#fff",borderRadius:20,padding:"40px 30px",textAlign:"center",boxShadow:"0 10px 30px rgba(0,0,0,.05)",border:"1px solid #e5e7eb",marginBottom:24}}>
            <h1 style={{fontSize:26,fontWeight:900,marginBottom:12}}>{grade}</h1>
            <p style={{color:"#888",marginBottom:28}}>Quiz Complete: <b>{topic}</b> from <b>{subject.name}</b></p>
            
            {/* Score metrics */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:28}}>
              <div style={{background:"#f8f9fa",borderRadius:16,padding:"20px"}}>
                <div style={{fontSize:11,color:"#888",fontWeight:700,letterSpacing:.5,marginBottom:8}}>SCORE</div>
                <div style={{fontSize:36,fontWeight:900,color:subject.color}}>{score}/{questions.length}</div>
              </div>
              <div style={{background:"#f8f9fa",borderRadius:16,padding:"20px"}}>
                <div style={{fontSize:11,color:"#888",fontWeight:700,letterSpacing:.5,marginBottom:8}}>ACCURACY</div>
                <div style={{fontSize:36,fontWeight:900,color:pct>=60?"#16a34a":"#dc2626"}}>{pct}%</div>
              </div>
              <div style={{background:"#f8f9fa",borderRadius:16,padding:"20px"}}>
                <div style={{fontSize:11,color:"#888",fontWeight:700,letterSpacing:.5,marginBottom:8}}>ANSWERED</div>
                <div style={{fontSize:36,fontWeight:900,color:"#2563eb"}}>{answeredCount}/{questions.length}</div>
              </div>
            </div>

            {/* Performance by difficulty */}
            <div style={{background:"#f8f9fa",borderRadius:16,padding:"20px",marginBottom:28}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:16,color:"#333"}}>Performance by Difficulty</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {["Easy","Medium","Hard"].map(diff=>{
                  const total = byDifficulty[diff];
                  const correct = byDifficulty[`correct${diff}`];
                  const acc = total>0 ? Math.round((correct/total)*100) : 0;
                  const colors = {Easy:"#16a34a",Medium:"#d97706",Hard:"#dc2626"};
                  return (
                    <div key={diff} style={{textAlign:"center",padding:"12px"}}>
                      <div style={{fontSize:12,color:"#888",fontWeight:700,marginBottom:8}}>{diff}</div>
                      <div style={{fontSize:20,fontWeight:900,color:colors[diff]}}>{correct}/{total}</div>
                      <div style={{fontSize:11,color:"#aaa",fontWeight:700}}>{acc}% Accuracy</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={onFinish}
                style={{padding:"14px 28px",background:subject.color,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Next Topic →
              </button>
            </div>
          </div>

          {/* Detailed review */}
          <div style={{marginBottom:40}}>
            <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>Detailed Review</h2>
            {results.map((r, i)=>(
              <div key={i} style={{background:"#fff",borderRadius:16,padding:"20px",marginBottom:12,border:`1.5px solid ${r.isCorrect?"#dcfce7":"#fee2e2"}`,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,background:r.isCorrect?"#dcfce7":"#fee2e2",color:r.isCorrect?"#16a34a":"#dc2626",flexShrink:0}}>
                    {r.isCorrect ? "✓" : "✗"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#555"}}>Q{i+1}</span>
                      <DiffBadge difficulty={r.q.difficulty||"Medium"}/>
                      {!r.userAnswer && <span style={{fontSize:11,background:"#f3f4f6",color:"#666",padding:"2px 8px",borderRadius:12,fontWeight:700}}>Unanswered</span>}
                    </div>
                    <p style={{fontSize:15,fontWeight:600,color:"#111",margin:"0 0 12px"}}>{r.q.question}</p>
                    
                    {/* Options display */}
                    <div style={{marginBottom:12}}>
                      {r.q.options.map(opt=>{
                        const isCorrectOpt = opt.label === r.q.correct;
                        const isUserChoice = opt.label === r.userAnswer;
                        let bgColor = "#f3f4f6", textColor = "#555", borderColor = "#e5e7eb";
                        
                        if(isCorrectOpt) { bgColor = "#dcfce7"; textColor = "#16a34a"; borderColor = "#86efac"; }
                        else if(isUserChoice && !isCorrectOpt) { bgColor = "#fee2e2"; textColor = "#dc2626"; borderColor = "#fca5a5"; }
                        
                        return (
                          <div key={opt.label} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:bgColor,border:`1px solid ${borderColor}`,borderRadius:10,marginBottom:6,fontSize:13}}>
                            <span style={{fontWeight:800,color:textColor}}>{opt.label}.</span>
                            <span style={{flex:1,color:textColor}}>{opt.text}</span>
                            {isCorrectOpt && <span style={{fontWeight:700,color:textColor}}>✓ Correct</span>}
                            {isUserChoice && !isCorrectOpt && <span style={{fontWeight:700,color:textColor}}>✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {r.q.explanation && (
                      <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 14px"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:4}}>💡 Explanation</div>
                        <p style={{margin:0,fontSize:13,color:"#78350f",lineHeight:1.6}}>{r.q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PRACTICE SCREEN (WITH SIDEBAR) ──
  const q = questions[current];
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const timeColor = totalTime > 180 ? "#16a34a" : totalTime > 60 ? "#d97706" : "#dc2626";
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{minHeight:"100vh",background:"#f0f4ff",display:"flex",overflow:"hidden"}}>
      {/* Main content with sidebar */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* LEFT SIDEBAR - Question list and controls */}
        <div style={{width:200,background:"#fff",borderRight:"1px solid #e5e7eb",overflowY:"auto",padding:"16px 12px",display:"flex",flexDirection:"column"}}>
          {/* Header section */}
          <div style={{marginBottom:20}}>
            <button onClick={onBack} style={{border:"none",background:"none",color:"#2563eb",fontSize:13,cursor:"pointer",fontWeight:700,marginBottom:12}}>← Back</button>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:2}}>{subject.name}</div>
              <div style={{fontSize:11,color:"#888"}}>{topic}</div>
            </div>
            
            {/* Time and answered stats */}
            <div style={{display:"flex",gap:12,marginBottom:16}}>
              <div style={{flex:1,textAlign:"center",background:"#f3f4f6",borderRadius:10,padding:"10px 8px"}}>
                <div style={{fontSize:18,fontWeight:900,color:timeColor}}>{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
                <div style={{fontSize:9,color:"#888",fontWeight:700,marginTop:2}}>TIME</div>
              </div>
              <div style={{flex:1,textAlign:"center",background:"#f3f4f6",borderRadius:10,padding:"10px 8px"}}>
                <div style={{fontSize:18,fontWeight:900,color:subject.color}}>{answeredCount}/{questions.length}</div>
                <div style={{fontSize:9,color:"#888",fontWeight:700,marginTop:2}}>ANSWERED</div>
              </div>
            </div>
            <div style={{height:"1px",background:"#e5e7eb",marginBottom:16}}/>
          </div>

          {/* Questions list */}
          <div style={{fontSize:10,fontWeight:700,color:"#aaa",letterSpacing:.5,marginBottom:12}}>QUESTIONS</div>
          <div style={{flex:1,overflowY:"auto"}}>
            {questions.map((_,idx)=>{
              const isVisited = visited[idx];
              const indicator = isVisited ? "●" : "○";
              const bgColor = isVisited ? "#e5e7eb" : "#f3f4f6";
              const textColor = isVisited ? "#666" : "#aaa";
              
              return (
                <button key={idx}
                  onClick={()=>goToQuestion(idx)}
                  style={{
                    width:"100%",
                    padding:"10px 12px",
                    marginBottom:8,
                    border:`1.5px solid ${idx===current?subject.color:"#e5e7eb"}`,
                    background:idx===current?subject.color+"10":"#fff",
                    borderRadius:10,
                    cursor:"pointer",
                    display:"flex",
                    alignItems:"center",
                    gap:8,
                    transition:"all .2s",
                    fontSize:13,
                    fontWeight:700,
                    color:idx===current?subject.color:"#333"
                  }}>
                  <div style={{
                    width:20,height:20,
                    borderRadius:"50%",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:800,
                    background:bgColor,
                    color:textColor,
                    flexShrink:0
                  }}>
                    {indicator}
                  </div>
                  Q{idx+1}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE - Question and options */}
        <div style={{flex:1,padding:"24px",overflowY:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{maxWidth:800,margin:"0 auto",width:"100%"}}>
            {/* Question card */}
            {q ? (
              <div className="fade-in" style={{background:"#fff",borderRadius:16,padding:"24px",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,.04)",border:"1px solid #e5e7eb"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                  <span style={{background:subject.color+"18",color:subject.color,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:800}}>Q{current+1}/{questions.length}</span>
                  <DiffBadge difficulty={q.difficulty||"Medium"}/>
                </div>
                <p style={{fontSize:18,fontWeight:700,color:"#111",margin:0,lineHeight:1.7}}>{q.question}</p>
              </div>
            ) : (
              <div style={{background:"#fff",borderRadius:16,padding:"24px",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,.04)",border:"1px solid #e5e7eb",textAlign:"center"}}>
                <p style={{color:"#888",fontSize:16}}>Loading question...</p>
              </div>
            )}

            {/* Options */}
            {q && (
              <div style={{marginBottom:24}}>
                {q.options.map(opt=>{
                  const isSelected = answers[current] === opt.label;
                  const isCorrect = opt.label === q.correct;
                  
                  return (
                    <button key={opt.label}
                      onClick={()=>handleAnswer(current, opt.label)}
                      style={{
                        width:"100%",
                        display:"flex",
                        alignItems:"center",
                        gap:16,
                        padding:"16px 18px",
                        marginBottom:10,
                        borderRadius:12,
                        border:`1.5px solid ${isSelected?subject.color:"#e5e7eb"}`,
                        background:isSelected?subject.color+"10":"#fff",
                        cursor:"pointer",
                        transition:"all .2s",
                        textAlign:"left"
                      }}
                      onMouseOver={e=>{if(!isSelected){e.currentTarget.style.borderColor=subject.color+"40";e.currentTarget.style.background="#f9f9f9"}}}
                      onMouseOut={e=>{if(!isSelected){e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.background="#fff"}}}>
                      <div style={{width:40,height:40,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,background:isSelected?subject.color+"30":"#f3f4f6",color:isSelected?subject.color:"#888",flexShrink:0}}>
                        {opt.label}
                      </div>
                      <span style={{flex:1,fontSize:15,color:"#333",fontWeight:500}}>{opt.text}</span>
                      {isSelected && <span style={{fontSize:18,fontWeight:700,color:subject.color}}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{display:"flex",gap:12,marginTop:24}}>
              <button onClick={()=>current>0 && setCurrent(current-1)}
                style={{flex:1,padding:"14px",border:`1.5px solid ${subject.color}`,background:"#fff",color:subject.color,borderRadius:12,fontSize:14,fontWeight:700,cursor:current>0?"pointer":"not-allowed",opacity:current>0?1:.5}}>
                ← Previous
              </button>
              <button onClick={()=>current<questions.length-1?setCurrent(current+1):handleFinish()}
                style={{flex:1,padding:"14px",background:subject.color,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                {current===questions.length-1 ? "Finish Quiz 🏁" : "Next Question →"}
              </button>
            </div>

            {/* Quick finish button */}
            {answeredCount > 0 && (
              <button onClick={handleFinish}
                style={{width:"100%",marginTop:16,padding:"12px",background:"#f3f4f6",color:"#666",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Finish Now ({answeredCount} answered)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



// ────────────────────────────────────────────────────────────────────
// ROOT APP (Exported as SubjectsPage)
// ────────────────────────────────────────────────────────────────────
export default function SubjectsPage() {
  const { isDarkMode } = useTheme();
  const [screen, setScreen]         = useState("subjects");  // subjects | topics | mcq | dashboard
  const [selSubject, setSelSubject] = useState(null);
  const [selTopic, setSelTopic]     = useState(null);

  // inject global CSS once
  useEffect(()=>{
    const tag = document.createElement("style");
    const globalCss = isDarkMode ? GLOBAL_CSS_DARK : GLOBAL_CSS;
    tag.innerHTML = globalCss;
    document.head.appendChild(tag);
    return ()=>document.head.removeChild(tag);
  },[isDarkMode]);

  const goToSubject = (subject) => { setSelSubject(subject); setScreen("topics"); };
  const goToTopic   = (topic)   => { setSelTopic(topic);   setScreen("mcq");    };
  const goBack      = ()        => setScreen("subjects");
  const backToTopics= ()        => setScreen("topics");
  const finishMCQ   = ()        => setScreen("topics");

  const bgColor = isDarkMode ? "#1a1a2e" : "#f0f4ff";

  return (
    <div style={{minHeight:"100vh",background:bgColor,transition:"background 0.3s ease"}}>
      <Navbar view={screen} onNavigate={v=>{
        if(v==="subjects") setScreen("subjects");
      }} onLogout={()=>{}} />

      {screen==="subjects"  && <SubjectsPageContent onSelectSubject={goToSubject}/>}
      {screen==="topics"    && selSubject && <TopicSelectorPage subject={selSubject} onSelectTopic={goToTopic} onBack={goBack}/>}
      {screen==="mcq"       && selSubject && selTopic &&
        <MCQPracticePage subject={selSubject} topic={selTopic} onBack={backToTopics} onFinish={finishMCQ}/>}
    </div>
  );
}
