# 🏗️ System Architecture

## High-Level Overview

```
┌─────────────────────────┐
│   React Frontend        │
│  (localhost:3000)       │
└───────────┬─────────────┘
            │ (HTTP Requests)
            │ (JSON)
            ▼
┌─────────────────────────────────┐
│   Node.js Backend API            │
│   (localhost:5000)              │
│  ┌──────────────────────────┐  │
│  │ Routes & Controllers     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ Middleware (Auth, etc.)  │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ Business Logic           │  │
│  └──────────────────────────┘  │
└───────────┬─────────────────────┘
            │ (Database Queries)
            ▼
┌─────────────────────────┐
│  MongoDB Database       │
│  Collections:           │
│  - Users                │
│  - Expenses             │
│  - Categories           │
└─────────────────────────┘
```

## Request/Response Flow

### Example: User Login

```
1. User enters credentials in React form
        ↓
2. Frontend submits POST request to /api/auth/login
        ↓
3. Backend receives request
        ↓
4. Controller validates credentials
        ↓
5. Backend queries MongoDB for user
        ↓
6. Password verification with bcrypt
        ↓
7. Generate JWT token
        ↓
8. Send token back to frontend
        ↓
9. Frontend stores token (localStorage)
        ↓
10. Future requests include token in header
```

## Technology Stack Details

| Component | Tech | Why? |
|-----------|------|------|
| Frontend UI | React | Component-based, fast, popular |
| Frontend Requests | Axios | Simple promise-based HTTP |
| Styling | CSS3 | Responsive design, modern |
| Backend Framework | Express | Minimal, flexible, great docs |
| Server Runtime | Node.js | Fast, event-driven, JS ecosystem |
| Database | MongoDB | Flexible schema, JSON-like |
| Authentication | JWT | Stateless, scalable, modern |
| Password Hash | bcryptjs | Secure, handles salt automatically |
| ML/AI | OpenAI API | Advanced NLP for categorization |
| Charts | Recharts | React-friendly, interactive |

## Data Models (Preview)

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  amount: Number,
  description: String,
  category: String (auto-categorized),
  date: Date,
  aiCategory: String,
  isAnomalous: Boolean,
  createdAt: Date
}
```

### Insight
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  month: String (YYYY-MM),
  totalSpent: Number,
  categoryBreakdown: Object,
  prediction: Number,
  anomalies: Array,
  insights: String (AI-generated)
}
```

## API Endpoints (Full List)

```
Authentication
POST   /api/auth/register      - Create new user
POST   /api/auth/login         - Get JWT token
POST   /api/auth/logout        - Clear session

Expenses
GET    /api/expenses           - Get user's expenses
GET    /api/expenses/:id       - Get single expense
POST   /api/expenses           - Create expense
PUT    /api/expenses/:id       - Update expense
DELETE /api/expenses/:id       - Delete expense

Insights
GET    /api/insights/monthly   - Monthly breakdown
GET    /api/insights/category  - Category breakdown
GET    /api/insights/anomalies - Detect anomalies

Prediction
GET    /api/prediction         - Predict next month

Chat
POST   /api/chat               - Natural language query
```

## Security Features

1. **Password Hashing**: Bcrypt with salt
2. **JWT Tokens**: Secure token-based auth
3. **CORS**: Restrict API access to frontend domain
4. **Environment Variables**: Secrets not in code
5. **Input Validation**: Sanitize user input
6. **Error Handling**: Don't expose internal errors

## Scalability Considerations

### Current (Phase 1-3)
- Single server
- One database
- Simple models

### Future Improvements
- Database indexing (faster queries)
- Caching (Redis)
- Microservices (separate services)
- Queue system (background jobs)
- API rate limiting
- Logging and monitoring
