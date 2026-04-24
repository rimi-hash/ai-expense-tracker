# 🏗️ PHASE 1: PROJECT SETUP - COMPLETE GUIDE

## What You Just Did

You created the **foundation** of your full-stack application with:

1. ✅ **Folder Structure** - Separated frontend and backend for better organization
2. ✅ **Backend Initialization** - Node.js + Express scaffold
3. ✅ **Frontend Initialization** - React app basic setup
4. ✅ **Configuration Files** - Environment variables and setup guides
5. ✅ **Documentation** - README and architecture guides

---

## 📖 Concept Breakdown

### What are these technologies?

#### **1. Node.js & Express**
- **Node.js**: JavaScript runtime for backend (allows JS outside the browser)
- **Express**: Framework that makes building APIs easy (like Django for Python)

```
Request → Express App → Routes → Controllers → Database
```

#### **2. React**
- **React**: Library for building interactive UIs
- Uses **components** (reusable pieces of UI)
- **Virtual DOM** for efficient updates

#### **3. MongoDB**
- **NoSQL Database**: Stores data as JSON-like documents
- **Flexible schema**: Unlike SQL, can change structure easily
- Perfect for expense data (nested categories, flexible structure)

#### **4. JWT (JSON Web Tokens)**
- **Authentication**: Safely verify user identity
- **Token-based**: Stateless (server doesn't need to store sessions)

```
Login → Server creates JWT → Frontend stores JWT → Send with each request
```

---

## 📁 Folder Structure Explained

```
backend/
├── server.js              ← Main entry point (starts the server)
├── package.json           ← Dependencies & scripts
├── .env.example           ← Environment template
├── models/                ← Database schemas (User, Expense, etc.)
├── routes/                ← API endpoints definitions
├── controllers/            ← Business logic (what happens when route is hit)
├── middleware/             ← Functions that process requests (auth, validation)
└── utils/                 ← Helper functions (AI calls, calculations)

frontend/
├── public/
│   └── index.html         ← Main HTML file (React renders here)
├── src/
│   ├── index.js           ← React entry point
│   ├── App.js             ← Root component
│   ├── App.css            ← Styling
│   ├── components/        ← Reusable components
│   ├── pages/             ← Full page components
│   ├── services/          ← API communication
│   └── context/           ← State management
└── package.json           ← Dependencies
```

---

## 🔧 Installation Instructions

### Prerequisites
Install these first:
- **Node.js** (v16+): https://nodejs.org/
- **MongoDB**: https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (cloud): https://www.mongodb.com/cloud/atlas

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (reads from package.json)
npm install

# Create .env file from template
cp .env.example .env
# (Edit .env with your MongoDB URI and secrets)

# Start development server
npm run dev
# Server runs at http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Start development server
npm start
# Opens at http://localhost:3000
```

---

## 🧪 Test Your Setup

### Backend Test
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running ✅",
  "timestamp": "2024-04-07T10:30:00.000Z",
  "environment": "development"
}
```

### Frontend Test
Visit: `http://localhost:3000`
Should see: "AI Expense Tracker" heading with features preview

---

## 💡 Interview Questions for Phase 1

**Q1: Why separate frontend and backend?**
```
A: Separation of concerns makes code maintainable. Frontend handles UI/UX,
   backend handles business logic and data. They communicate via REST APIs.
   Benefits:
   - Different tech stacks
   - Easy to scale separately
   - Team can work independently
   - Can deploy to different servers
```

**Q2: What is CORS and why do we need it?**
```
A: CORS (Cross-Origin Resource Sharing) allows frontend (localhost:3000)
   to communicate with backend (localhost:5000) which are different origins.
   
   Without CORS:
   - Browser blocks request (security feature)
   - Frontend can't fetch from backend
   
   With CORS configured:
   - Server explicitly allows frontend domain
   - Safe and controlled
```

**Q3: What does npm install do?**
```
A: Reads package.json and downloads all dependencies from npm registry.
   Creates node_modules/ folder and package-lock.json (exact versions).
   
   Why package.json matters:
   - Records what libraries your project needs
   - Makes collaboration easy (others can npm install)
   - Easy to update dependencies
```

**Q4: What is .env file and why is it important?**
```
A: Stores sensitive configuration (API keys, database URLs, secrets).
   
   Why not hardcode these?
   - .env is in .gitignore (never committed)
   - Different values for dev/prod
   - Secure (API keys not exposed in GitHub)
   - Easy to change without code changes
   
   How it works:
   - dotenv package loads .env into process.env
   - Access via process.env.VARIABLE_NAME
```

**Q5: What is localhost:3000 vs localhost:5000?**
```
A: Different ports for different services:
   - 3000: React frontend (port is configurable)
   - 5000: Node.js backend (configured in .env)
   
   Ports are like apartment numbers - same building (localhost),
   different units for different services.
```

---

## 🎯 What We're Ready For

✅ Install dependencies  
✅ Start servers  
✅ Basic health check  
✅ Now ready for Phase 2 (Authentication)

---

## 🚀 Next: Phase 2 - Authentication System

In Phase 2, we'll:
- Create User database schema
- Build login/signup endpoints
- Implement JWT token generation
- Protect routes with authentication
- Add password hashing with bcrypt

**Estimated Time**: 2-3 hours

---

## 📚 Resources

- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- MongoDB Docs: https://docs.mongodb.com/
- JWT Explanation: https://jwt.io/introduction
- CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
