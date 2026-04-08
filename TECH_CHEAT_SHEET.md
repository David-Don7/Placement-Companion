# 📋 Quick Reference - Tech Stack Cheat Sheet

## ONE PAGE SUMMARY

---

## 🏢 Project Structure

```
FRONTEND (What User Sees)
│
├─ login.html          → Sign in page
├─ dashboard.html      → Home/navigation
├─ aptitude.html       → Take quiz
├─ aptitude-report.html → See results with AI insights
├─ coding-practice.html → Browse DSA problems
└─ coding-editor.html  → Write & run code
   
CSS/
└─ style.css           → All styling

JS/
└─ api.js              → Communication with backend

═══════════════════════════════════════════════════════════

BACKEND (Express.js Server)
│
├─ server.js           → Main app entry
│
├─ Models/ (Data shapes)
│  ├─ User.js
│  ├─ Question.js
│  ├─ AptitudeReport.js
│  └─ CodingQuestion.js
│
├─ Controllers/ (Business Logic)
│  ├─ authController.js
│  ├─ aptitudeController.js
│  └─ codingController.js
│
├─ Routes/ (URL endpoints)
│  ├─ auth.js          → /api/auth/...
│  ├─ aptitude.js      → /api/aptitude/...
│  └─ coding.js        → /api/coding/...
│
├─ Middleware/ (Security checks)
│  └─ auth.js          → Verify JWT token
│
└─ Services/ (Reusable code)
   ├─ recommendationEngine.js → AI analysis
   └─ codeExecutor.js         → Run code

═══════════════════════════════════════════════════════════

DATABASE (MongoDB)
│
└─ Collections:
   ├─ users               → Student data
   ├─ questions           → Quiz questions
   ├─ aptitudereports     → Test results
   ├─ codingquestions     → 15 DSA problems
   └─ codesubmissions     → Code submissions
```

---

## 🔄 Request-Response Flow

```
1. User clicks button on frontend (HTML)
         ↓
2. JavaScript Fetch API sends HTTP request
   GET /api/questions
   Headers: {Authorization: "Bearer token123"}
         ↓
3. Backend receives request in Express Router
         ↓
4. Middleware checks if token is valid
         ↓
5. Controller function processes request
   - Talks to Database via Mongoose
   - Calculates results
   - Applies business logic
         ↓
6. Controller sends back JSON response
         ↓
7. Frontend receives data
         ↓
8. JavaScript updates HTML with results
         ↓
9. User sees updated page ✅
```

---

## 🔐 Authentication Flow

```
Sign Up/Login
├─ User enters email & password
├─ Backend uses bcryptjs to hash password
├─ Compares with stored hash
├─ If match:
│  ├─ Create JWT token
│  ├─ Token expires in 7 days
│  └─ Send to frontend
├─ Frontend saves in localStorage
└─ Each request sends token in header

Every API Call
├─ Frontend: GET /api/questions
│   Headers: {Authorization: "Bearer eyJh..."}
├─ Backend middleware verifies token
├─ If valid: Proceed ✅
└─ If invalid: Return 401 Unauthorized ❌
```

---

## 📊 Technologies & Their Jobs

```
┌─────────────────────────────────────────────────────────────┐
│ TECH STACK DETAILS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ FRONTEND TIER (Browser)                                   │
│ ├─ HTML5 → Structure & semantic markup                   │
│ ├─ CSS3 → Responsive design & animations                 │
│ ├─ JavaScript ES6 → Interactivity & fetch calls          │
│ └─ localStorage → Store user token & data locally         │
│                                                             │
│ API COMMUNICATION                                          │
│ └─ Fetch API (built-in) → Send/receive JSON               │
│                                                             │
│ BACKEND TIER (Node.js Server)                            │
│ ├─ Node.js → Run JavaScript on server                    │
│ ├─ Express.js → Route requests to controllers            │
│ ├─ Express Middleware → Verify auth, parse JSON          │
│ └─ Mongoose → Easy MongoDB interactions                  │
│                                                             │
│ DATABASE TIER (MongoDB)                                   │
│ ├─ MongoDB → Store documents as JSON-like data           │
│ ├─ Collections → Like tables but flexible               │
│ ├─ Schemas → Define structure with Mongoose             │
│ └─ Indexes → Make queries fast                           │
│                                                             │
│ SECURITY TIER                                             │
│ ├─ JWT → Create secure tokens                            │
│ ├─ bcryptjs → Hash passwords (irreversible)              │
│ ├─ CORS → Allow cross-origin requests                    │
│ └─ Environment Variables → Store secrets safely          │
│                                                             │
│ AI/ANALYSIS (Services)                                    │
│ ├─ RecommendationEngine → Analyze quiz performance       │
│ │  ├─ Category-wise breakdown                            │
│ │  ├─ Skill classification (4 levels)                    │
│ │  └─ Personalized recommendations                       │
│ ├─ CodeExecutor → Test code submissions                  │
│ │  ├─ Mock execution (current)                           │
│ │  └─ Judge0 API ready (optional upgrade)                │
│ └─ Hash-based algorithms → Deterministic results         │
│                                                             │
│ DEPLOYMENT                                                 │
│ ├─ Vercel → Host frontend & backend                      │
│ ├─ MongoDB Atlas → Cloud database                        │
│ ├─ GitHub → Version control & CI/CD                      │
│ └─ Environment Variables → Production config              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 API Endpoints

```
AUTHENTICATION
POST   /api/auth/signup           → Create new account
POST   /api/auth/login            → Login & get token
POST   /api/auth/logout           → Clear token

APTITUDE QUIZ
GET    /api/questions             → Get all quiz questions
POST   /api/aptitude/submit       → Submit quiz answers
GET    /api/aptitude/report       → Get latest report
GET    /api/aptitude/report/:id   → Get specific report

CODING PRACTICE
GET    /api/coding/questions      → List all problems
GET    /api/coding/question/:id   → Get problem details
POST   /api/coding/submit         → Run/submit code
GET    /api/coding/submissions    → View submission history
GET    /api/coding/stats          → User statistics

USER PROFILE
GET    /api/user/profile          → Get profile info
PUT    /api/user/profile          → Update profile
```

---

## 🎯 Features Explained Simply

### Feature 1: Quiz System
```
Problem: How to test students on aptitude?
Solution: 
  1. Store questions in database
  2. Show one at a time in frontend
  3. Collect answers
  4. Compare with correct answers
  5. Calculate score & save report
```

### Feature 2: Performance Analytics
```
Problem: How to give personalized insights?
Solution: RecommendationEngine
  1. Analyze which categories student is weak in
  2. Calculate accuracy per category
  3. Assess speed vs accuracy trade-off
  4. Classify skill level (Beginner/Amateur/Intermediate/Advanced)
  5. Generate 2-5 actionable recommendations
```

### Feature 3: Coding Problems
```
Problem: How to let students practice coding?
Solution: 
  1. Store 15 DSA problems in database
  2. Show problem statement in editor
  3. Provide test cases
  4. Run user's code against test cases
  5. Show green checkmark if all pass, red X if fail
  6. Track submission history
```

### Feature 4: Code Execution
```
Problem: How to run code on a web server?
Solution: CodeExecutor
  ├─ Option 1 (Current): Mock execution
  │  └─ Simulates running (good for demo)
  ├─ Option 2 (Premium): Judge0 API
  │  └─ Real compilation in the cloud
```

---

## 📊 Data Model Example

### User Collection
```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password_bcrypt",
  "university": "MIT",
  "year": 2024,
  "createdAt": "2026-04-01T10:00:00Z"
}
```

### CodingQuestion Collection
```json
{
  "_id": "q1",
  "title": "Two Sum",
  "difficulty": "Easy",
  "topic": "Arrays",
  "description": "Find two numbers that add up to target",
  "testCases": [
    {"input": "[2,7,11,15]\n9", "expectedOutput": "[0,1]"},
    {"input": "[3,2,4]\n6", "expectedOutput": "[1,2]"}
  ],
  "boilerplate": {
    "java": "public int[] twoSum(int[] nums, int target) {...}",
    "cpp": "vector<int> twoSum(vector<int>& nums, int target) {...}"
  }
}
```

### AptitudeReport Collection
```json
{
  "_id": "report1",
  "userId": "user123",
  "totalQuestions": 50,
  "correctAnswers": 39,
  "percentage": 78,
  "skillLevel": "Intermediate",
  "categoryAnalysis": {
    "Logical Reasoning": {"correct": 10, "total": 15, "percent": 67},
    "Quantitative": {"correct": 15, "total": 20, "percent": 75},
    "Verbal": {"correct": 14, "total": 15, "percent": 93}
  },
  "recommendations": [
    "Focus on improving Logical Reasoning skills",
    "Practice quantitative problems daily"
  ],
  "createdAt": "2026-04-05T14:30:00Z"
}
```

---

## 🎨 Visual Flow Diagram

```
                    🌐 BROWSER
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    [HTML]          [CSS]          [JavaScript]
    (Page)        (Styling)     (Interactivity)
        │               │               │
        └───────────────┼───────────────┘
                        │
                   FETCH REQUEST
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    [ROUTER]      [MIDDLEWARE]   [CONTROLLER]
   (Match URL)  (Verify Token)  (Process Logic)
         │              │              │
         └──────────────┼──────────────┘
                        │
                    [MODEL]
                 (Database Ops)
                        │
                   🗄️ MONGODB
              (Persistent Storage)
```

---

## 💰 Cost Breakdown

| Component | Service | Cost | Why Free |
|-----------|---------|------|----------|
| Frontend Hosting | Vercel | FREE | 100K requests/month free |
| Backend Hosting | Vercel Serverless | FREE | 100K function calls/month free |
| Database | MongoDB Atlas | FREE | 512MB storage free tier |
| Domain | GitHub Pages | FREE | GitHub provided |
| **TOTAL** | **Vercel + MongoDB** | **$0** | Educational use |

---

## ✅ Production Checklist

- [x] Frontend responsive on mobile/tablet
- [x] Backend validates all inputs
- [x] Passwords hashed with bcryptjs
- [x] JWT tokens secure & expiring
- [x] Database indexed for fast queries
- [x] Error messages don't expose secrets
- [x] CORS configured properly
- [x] Environment variables used for secrets
- [x] Code well-documented
- [x] Ready for Vercel deployment

---

## 🎬 How to Present

**Minute 0-1:** "This is Placement Companion, a web app for placement prep"
**Minute 1-2:** Show the features (Quiz, Reports, Coding)
**Minute 2-4:** Explain frontend/backend/database architecture
**Minute 4-6:** Walk through one feature (Quiz → Report → Insights)
**Minute 6-8:** Show the code (open GitHub, show key files)
**Minute 8-9:** Deployment strategy (Vercel + MongoDB)
**Minute 9-10:** Live demo OR screenshot walkthrough
**Minute 10-15:** Q&A

---

## 🔗 Files to Reference During Presentation

```
Show these files in order:

1. INDEX.HTML → Show UI structure
2. API.JS → Show how frontend talks to backend
3. SERVER.JS → Show main backend entry point
4. CONTROLLERS/ → Show business logic
5. MODELS/ → Show data structure
6. DB.CONFIG → Show MongoDB connection
7. VERCEL.JSON → Show deployment config
```

---

## 💡 Killer Quotes for Presentation

> "The frontend is like a restaurant's menu. Users interact with it. But the backend is the kitchen where the actual work happens."

> "MongoDB is NoSQL - think of it as storing documents instead of rigid table structures. Perfect for modern web apps."

> "JWT tokens are like ID cards. Instead of the server remembering every person, we give everyone an ID and they show it with every request."

> "Vercel serverless means code runs ONLY when needed. Pay for compute, not for idle hardware. It's like paying for electricity instead of buying a generator."

> "This project uses 8 different pieces of technology, but they work together seamlessly. That's full-stack development."

---

END OF CHEAT SHEET ✅
