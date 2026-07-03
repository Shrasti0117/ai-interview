# 🗂️ File-by-File Complete Summary

## Backend Structure

### **Root Files**
- **package.json** - Dependencies: express, mongoose, jwt, bcryptjs, @google/generative-ai, openai, pdf-parse, multer
- **server.js** - Express server setup, MongoDB connection, CORS config, in-memory question schemas

### **Config/**
- **db.js** - MongoDB connection handler using Mongoose, graceful error handling for offline mode

### **Models/** (Database Schemas)

#### **user.js**
- User authentication schema
- Fields: name, email (unique), password (bcrypt), createdAt, lastLoginAt, loginCount
- Methods: comparePassword() for login verification
- Pre-save hook: Auto-hashes password before storing

#### **Interview.js**
- Interview session tracking
- Fields: userId, resumeText, language (en/hi), questions[], answers[], status, usingFallback, maxQuestions, duration, performanceScore, feedback
- Tracks complete interview lifecycle from start to completion

#### **Question.js**
- Question bank for MCQ tests
- Fields: subject, topic, questionText, options[], answer, explanation, difficulty
- Used for static aptitude test questions

#### **AuthLog.js**
- Security audit log
- Tracks all login/signup attempts with success/failure status
- Fields: userId, action (signup/login), status, name, email, message, ipAddress, userAgent
- Helps identify unauthorized access attempts

### **Controllers/** (Business Logic)

#### **authcontroller.js**
- **register()**: Create new user, hash password, generate JWT, log signup
- **login()**: Verify credentials, generate token, update lastLoginAt, log attempt
- **getProfile()**: Return authenticated user's information
- Features: Email normalization, comprehensive audit logging

#### **interviewcontroller.js**
- **startInterview()**: 
  - Validate resume file upload
  - Parse PDF to extract text
  - Generate first question from resume
  - Create Interview record in DB
  - Return question and interview metadata
  
- **answerQuestion()**:
  - Save candidate's answer
  - Check if interview should end (maxQuestions reached)
  - If ending: Calculate score (0-100), generate feedback, mark as completed
  - If continuing: Generate next contextual question
  - Support for language switching
  
- **getInterviewResults()**: Return full interview data for feedback display

- **Score Calculation**:
  - Base: 50 points
  - Answer quality (200+ chars): +20 pts
  - Time management (60-300 sec/Q): +20 pts
  - Completion bonus: +10 pts
  - Final: 0-100 (capped)

#### **questioncontroller.js**
- **getQuestions()**: Fetch questions filtered by subject and/or topic
- **updateQuestion()**: Update question by ID, auto-update timestamp

### **Middleware/** (Request Processing)

#### **authmiddleware.js**
- **protect()**: JWT verification middleware
  - Extract token from Authorization header
  - Verify token with JWT_SECRET
  - Attach user object to request
  - Return 401 if invalid/missing

### **Routes/** (API Endpoints)

#### **authroutes.js**
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login user
GET    /api/auth/profile               - Get user profile (protected)
```

#### **interviewroutes.js**
```
POST   /api/interview/start            - Upload resume, start interview (protected)
POST   /api/interview/answer           - Submit answer, get next question (protected)
GET    /api/interview/results/:id      - Get interview results (protected)
```

#### **questionroutes.js**
```
GET    /api/questions                  - Get questions (filters: subject, topic)
PUT    /api/questions/:id              - Update question by ID
```

#### **aptituderoutes.js**
- Routes for MCQ aptitude tests

### **Utils/** (Utilities)

#### **generatequestion.js** (Complex AI Engine)
```
Main Function: generateQuestion(resumeText, previousQuestions, lastAnswer, language)
Returns: { question, isFromGemini, usingFallback }

Process:
1. Try Gemini API with multiple models in order:
   - GEMINI_MODEL (from env)
   - gemini-2.0-flash
   - gemini-2.0-flash-lite
   - gemini-1.5-flash
   - gemini-1.5-pro
   - gemini-1.5-flash-latest

2. Handle errors:
   - Model not found → try next model
   - Quota exceeded → use local fallback
   - Network error → use local fallback

3. Local Fallback:
   - Extract skill focus from resume keywords
   - Generate contextual question based on position in interview
   - Avoid repeating questions

4. Language Support:
   - English: Default
   - Hindi: Hindi-language questions

Error Detection Functions:
- isModelNotFoundError()
- isQuotaOrRateLimitError()
- isTransientProviderError()

Features:
- Model discovery and caching
- Graceful degradation to local fallback
- Context-aware question generation
- Multilingual support
```

---

## Frontend Structure

### **Root Configuration**

#### **package.json**
- Dependencies: react@19.1.1, react-router-dom@7.8.1, axios@1.11.0, framer-motion, lucide-react, socket.io-client
- Scripts: start, build, test

#### **public/index.html**
- HTML entry point
- Mounts React app to `<div id="root">`

### **src/ Main Files**

#### **App.js** (Main Router)
```
Routes:
/login                    - Login page (public)
/                         - Home (protected)
/subjects                 - Subject selection (protected)
/dashboard                - User dashboard (protected)
/progress                 - Progress page (protected)
/interview-rounds         - Round selection (protected)
/hr-round                 - HR interview (protected)
/hr-aptitude              - HR aptitude test (protected)
/technical-round          - Technical interview (protected)
/test                     - Generic test page (protected)
/aptitude                 - Aptitude round (protected)
/interview-feedback       - Results page (protected)
/proctoring               - Proctoring interface (protected)

Features:
- Auto-hides navbar on specific pages
- Protects routes with Privateroute component
- Scroll-to-top on navigation changes
- Theme context provider
```

#### **index.js**
- React app entry point
- Renders App.js to DOM

#### **index.css**
- Global styles

### **context/ThemeContext.js**
- Manages light/dark mode
- Provides theme state across app
- Persists preference in localStorage

### **services/axiosInterceptor.js**
```
Axios instance configuration:
- Base URL: http://localhost:5001
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors → redirect to login
- Used for all API calls
```

### **Component Directory Structure**

#### **APtitude/** - Aptitude Testing
- `AptitudeRound.jsx` - Main test container
- `Aptitude1.jsx` - Test UI variant 1
- `Aptitudeee.jsx` - Test UI variant 2
- `Questionselect.jsx` - Question selection interface
- `Topicselect.jsx` - Topic selector
- `Report.jsx` - Results display
- `Report.css`, `aptitude-unified.css` - Styling

#### **Dashboard/** - User Dashboard
- Dashboard component with stats and navigation

#### **Feature/** - Feature Showcase
- `Feature.jsx` - Features section
- `Feature.css` - Styling

#### **footer/** - Footer
- `Footer.jsx` - Footer component
- `footer.css` - Footer styles

#### **Hero/** - Landing Section
- `Hero.jsx` - Hero/banner section
- `Hero.css` - Hero styling

#### **HrRoundpage/** - HR Interview
- `Hrroundpage1.jsx` - HR round intro
- `Hrroundpage2Backend.jsx` - HR questions display
- `HrAptitudeTest.jsx` - HR aptitude test
- `InterviewFeedback.jsx` - Results after HR round

#### **Navbar/** - Navigation
- `Navbar.jsx` - Header navigation
- Navigation links, user menu, logout

#### **Pages/** - Main Pages
- `Home.jsx` - Landing/home page
- `SubjectsPage.jsx` - Subject selection
- `ProgressPage.jsx` - Progress tracking
- `TechnicalRoundPage.jsx` - Technical interview page
- `Test.jsx` - Generic test page

#### **ProfileSidebar/** - User Profile
- User profile information section

#### **roundpage/** - Interview Rounds
- Interview flow management components

#### **routingpages/** - Routing Pages
- `Dashboard.jsx` - Dashboard container

#### **signuppage/** - Authentication
- `Login.jsx` - Login form
- `Privateroute.jsx` - Route protection wrapper

#### **ProctoringWrapper.jsx**
- Candidate monitoring interface
- Proctoring controls and UI

#### **SecurityWrapper.jsx**
- Anti-cheating enforcement
- Candidate validation

#### **Scrolltotop.jsx**
- Utility component for auto-scroll on route change

### **assests/**
- Static images, icons, and resources

### **build/**
- Production build output
- Minified CSS and JavaScript files
- Ready for deployment

---

## Admin Portal Structure

### **Admin/admin-interview/package.json**
- Dependencies: react@19.1.1, react-router-dom@7.8.2, react-router@7.8.2
- FontAwesome icons (@fortawesome/react-fontawesome, svg-core, free-solid-svg-icons)

### **src/Component/** - Admin Components

#### **Analytics/**
- `Analytics.jsx` - Dashboard analytics view
- `Analytics.css` - Styling
- Features: Interview stats, user metrics, performance trends

#### **Content management/**
- `Content.jsx` - Manage questions and test content
- `Content.css` - Styling
- CRUD operations for question bank

#### **Homepage/** - Admin Interface
- `Home.jsx` - Admin dashboard home
- `Navbar.jsx` - Admin navigation
- `Sidebar.jsx` - Sidebar menu
- `Navbar.css`, `Siderbar.css` - Navigation styling

#### **Planner management/**
- `Planner.jsx` - Test scheduling and planning
- `Planner.css` - Styling
- Create and manage test configurations

#### **UserManagement/**
- `Usermang.jsx` - User administration
- `Usermang.css` - Styling
- Manage user accounts and profiles

---

## Root Project Files

### **package.json**
- Root dependencies including concurrently, tailwindcss, etc.
- Scripts: start, dev (with run_app.bat), build, test

### **README.md**
- Standard Create React App documentation

### **run_app.bat** (Windows)
- Batch script to start all applications concurrently
- Starts Backened, Frontend, and Admin

---

## 📊 Data Flow Summary

```
User Registration
│
├─→ Register Form (Frontend)
│   └─→ POST /api/auth/register
│       └─→ authcontroller.register()
│           ├─→ Validate email
│           ├─→ Hash password
│           ├─→ Create user in MongoDB
│           ├─→ Log signup in AuthLog
│           └─→ Generate JWT token
│               └─→ Return token to frontend

User Login
│
├─→ Login Form (Frontend)
│   └─→ POST /api/auth/login
│       └─→ authcontroller.login()
│           ├─→ Find user by email
│           ├─→ Compare password with hash
│           ├─→ Update lastLoginAt
│           ├─→ Generate JWT token
│           ├─→ Log login attempt in AuthLog
│           └─→ Return token

Interview Start
│
├─→ Upload Resume (Frontend)
│   └─→ POST /api/interview/start (with JWT)
│       └─→ interviewcontroller.startInterview()
│           ├─→ Validate file upload
│           ├─→ Parse PDF → extract text
│           ├─→ Call generateQuestion(resumeText)
│           │   └─→ Try Gemini API or fallback to local
│           ├─→ Create Interview document
│           └─→ Return first question

Interview Answer Loop
│
├─→ Answer Question (Frontend)
│   └─→ POST /api/interview/answer (with JWT)
│       └─→ interviewcontroller.answerQuestion()
│           ├─→ Find interview by ID
│           ├─→ Save answer
│           ├─→ Check if maxQuestions reached?
│           │   ├─→ YES: Calculate score, generate feedback, end interview
│           │   └─→ NO: Generate next question, return it
│           └─→ Update interview in MongoDB

Get Results
│
├─→ Feedback Page (Frontend)
│   └─→ GET /api/interview/results/:interviewId (with JWT)
│       └─→ interviewcontroller.getInterviewResults()
│           └─→ Return full interview with metrics and feedback
```

---

## 🔑 Key Implementation Details

### **Interview Question Generation Algorithm**
1. Extract resume text from PDF
2. Identify key skills/focus areas
3. Build prompt with resume + previous questions + last answer + language
4. Try Gemini API with fallback models
5. If success: Return Gemini question
6. If failure: Fall back to template-based local question
7. Track source (usingFallback flag)
8. Return { question, isFromGemini, usingFallback }

### **Score Calculation Logic**
```javascript
let score = 50; // Base
if (avgAnswerLength >= 200) score += 20;
else if (avgAnswerLength >= 100) score += 10;

if (timePerQuestion >= 60 && timePerQuestion <= 300) score += 20;
else if (timePerQuestion >= 40 && timePerQuestion <= 400) score += 10;

score += 10; // Completion bonus
final_score = Math.min(100, score);
```

### **Error Handling Strategy**
- Gemini API errors → Graceful fallback to local questions
- Database errors → Log but allow in-memory mode
- Auth errors → Clear token, redirect to login
- File upload errors → Detailed error message to user

### **Security Implementation**
- Password: bcryptjs with 10 salt rounds
- JWT: 30-day expiry, verified on protected routes
- Audit logging: All auth attempts with IP and device info
- Input validation: Email normalization, file validation
- CORS: Only allow localhost:3000 and localhost:3001

---

## 📌 Important Configurations

### **Backend Environment (.env)**
```
MONGO_URI=mongodb://localhost:27017/interview
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_api_key
GEMINI_MODEL=gemini-2.0-flash (optional)
NODE_ENV=development
```

### **CORS Configuration**
```javascript
{
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
```

### **Axios Base URL**
- Backend: http://localhost:5001
- Frontend uses interceptor to add JWT token

---

## 🎯 Feature Completeness Checklist

✅ User authentication (register, login, logout)
✅ JWT-based authorization
✅ Interview session management
✅ AI question generation (Gemini + fallback)
✅ PDF resume parsing
✅ Performance scoring (0-100)
✅ Feedback generation
✅ Audit logging
✅ Admin dashboard (basic structure)
✅ Multiple interview types (Technical, HR, Aptitude)
✅ Language support (English, Hindi)
✅ Proctoring interface (UI created)
✅ Security features (encryption, CORS, validation)
✅ Progress tracking (schema prepared)

---

**Total Files**: ~60+ (frontend, backend, admin, config)  
**Lines of Code**: ~10,000+  
**Database Collections**: 4 (Users, Interviews, Questions, AuthLogs)  
**API Endpoints**: 10+ with authentication
