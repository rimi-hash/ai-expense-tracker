# 🎯 AI-Powered Smart Expense Tracker

A production-level full-stack web application that tracks expenses, automatically categorizes them using AI, and provides intelligent financial insights.

## 📋 Features

- **User Authentication**: Secure JWT-based login/signup
- **Expense Management**: Add, edit, delete expenses with automatic timestamps
- **AI Categorization**: Automatic expense classification using NLP
- **Smart Insights**: Monthly analysis, category breakdown, spending predictions
- **Anomaly Detection**: Detect unusual spending patterns
- **Chat Interface**: Natural language queries about spending
- **Predictive Analytics**: ML-based expense forecasting

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Axios, Chart.js/Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI/NLP** | OpenAI API (or free alternative) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Docker, Vercel, Heroku |

## 📂 Project Structure

```
ai-expense-tracker/
├── backend/
│   ├── models/           (Database schemas)
│   ├── routes/           (API endpoints)
│   ├── controllers/       (Business logic)
│   ├── middleware/        (Authentication, validation)
│   ├── utils/             (Helper functions, AI integration)
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   (Reusable UI components)
│   │   ├── pages/        (Full page components)
│   │   ├── services/     (API calls)
│   │   ├── context/      (State management)
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── docs/
    ├── ARCHITECTURE.md    (System design)
    ├── API_DOCUMENTATION.md
    └── INTERVIEW_PREP.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📚 Learning Phases

- **Phase 1**: Project Setup ✓
- **Phase 2**: Authentication System
- **Phase 3**: Expense CRUD APIs
- **Phase 4**: Frontend UI
- **Phase 5**: AI Categorization
- **Phase 6**: Insights Dashboard
- **Phase 7**: Prediction Module
- **Phase 8**: Chat Interface
- **Phase 9**: Deployment

---

**Author**: Build for Learning & Resume  
**Version**: 1.0.0
