# 🎯 COMPLETE PROJECT SETUP & RUN GUIDE

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher) - Download from https://nodejs.org/
2. **MongoDB** - Choose one:
   - **Local Installation**: https://www.mongodb.com/try/download/community
   - **Cloud (Recommended)**: https://www.mongodb.com/cloud/atlas (free tier available)
3. **Git** (optional, for version control)

## ✅ Step 1: Verify Prerequisites

```bash
# Check Node.js installation
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher

# Check MongoDB (if installed locally)
mongod --version  # If you installed MongoDB locally
```

## 🚀 Step 2: Complete Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd /workspace/ai-expense-tracker/backend
```

### 2.2 Install Dependencies
```bash
npm install
```

This installs all required packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- And more...

### 2.3 Create & Configure .env File
```bash
cp .env.example .env
```

Now edit the `.env` file with your configuration:

#### Option A: Using Local MongoDB
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_unique_secret_key_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-your_key_here_or_leave_blank
```

#### Option B: Using MongoDB Atlas (Cloud)
```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create a free account
# 3. Create a cluster
# 4. Get your connection string (looks like):
#    mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker
```

Then in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker
JWT_SECRET=my_secret_key_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 2.4 Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🎯 Server started on http://localhost:5000
📊 Environment: development
💡 Press Ctrl+C to stop the server
```

✅ **Backend is now running!**

---

## 🎨 Step 3: Complete Frontend Setup (New Terminal Window)

### 3.1 Open A NEW Terminal/Command Prompt

**IMPORTANT**: Keep the backend terminal open and open a new terminal for frontend!

### 3.2 Navigate to Frontend Directory
```bash
cd /workspace/ai-expense-tracker/frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

This installs React and related packages.

### 3.4 Create .env File
```bash
cp .env.example .env
```

Edit `.env` (usually doesn't need changes):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 3.5 Start Frontend Server
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ai-expense-tracker-frontend in the browser.

Local:            http://localhost:3000
```

This will automatically open your browser to http://localhost:3000

✅ **Frontend is now running!**

---

## 🧪 Step 4: Verify Everything Works

### 4.1 Check Backend API
Open in browser:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "Server is running ✅",
  "timestamp": "2024-04-07T10:30:00.000Z",
  "environment": "development"
}
```

### 4.2 Check Frontend
Your browser should have automatically opened:
```
http://localhost:3000
```

You should see the login page.

---

## 👤 Step 5: Test the Application

### 5.1 Create a New Account
1. Click "Sign Up"
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"

### 5.2 Add Your First Expense
1. Go to Dashboard
2. In the form, enter:
   - Amount: `25.50`
   - Description: `Lunch at restaurant`
   - Category: `Food & Dining`
   - Date: Today's date
3. Click "Add Expense"

### 5.3 Try the Chat Feature
1. Click the "Chat" tab
2. Ask: `"How much did I spend on food?"`
3. The AI will respond based on your expenses

### 5.4 View Insights
1. Stay on "Overview" tab
2. You'll see a chart of your spending by category
3. AI-generated insights and recommendations

---

## 🐛 Troubleshooting

### Issue: Backend won't start - "Cannot find module"

**Solution:**
```bash
cd backend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: MongoDB Connection Error

**If using Local MongoDB:**
1. Ensure MongoDB is running:
   - **Windows**: Search for "MongoDB" and start the service
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

**If using MongoDB Atlas:**
1. Check connection string in `.env`
2. Ensure IP address is whitelisted in Atlas
3. Check username and password are correct

### Issue: Port 3000 or 5000 Already in Use

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti :5000 | xargs kill -9
```

### Issue: Frontend can't reach backend (CORS Error)

1. Check backend is running on `http://localhost:5000`
2. Verify `FRONTEND_URL` in backend `.env` is `http://localhost:3000`
3. Verify `REACT_APP_API_URL` in frontend `.env` is `http://localhost:5000/api`
4. Restart both servers

### Issue: npm install is very slow

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
```

---

## 📁 Project Structure (After Setup)

```
ai-expense-tracker/
├── backend/
│   ├── models/                 (Database schemas)
│   ├── controllers/            (Business logic)
│   ├── routes/                 (API endpoints)
│   ├── middleware/             (Auth checks)
│   ├── utils/                  (AI, predictions, etc.)
│   ├── server.js              (Main entry point)
│   ├── package.json
│   ├── .env                   (Your configuration)
│   ├── .env.example           (Template)
│   └── node_modules/          (Installed packages)
│
├── frontend/
│   ├── src/
│   │   ├── components/        (Reusable UI pieces)
│   │   ├── pages/             (Full pages)
│   │   ├── services/          (API communication)
│   │   ├── context/           (State management)
│   │   ├── styles/            (CSS files)
│   │   ├── App.js            (Main component)
│   │   └── index.js           (Entry point)
│   ├── public/
│   │   └── index.html        (HTML template)
│   ├── package.json
│   ├── .env                   (Your configuration)
│   ├── .env.example           (Template)
│   └── node_modules/          (Installed packages)
│
├── docs/                       (Documentation)
├── README.md
└── .gitignore
```

---

## 🚀 Both Servers Running = Success!

When everything works, you should have:

**Terminal 1 (Backend):**
```
✅ MongoDB Connected: localhost
🎯 Server started on http://localhost:5000
```

**Terminal 2 (Frontend):**
```
Compiled successfully!

Local: http://localhost:3000
```

**Browser (http://localhost:3000):**
- Login/Signup page visible
- Click "Sign Up" to create account
- Full dashboard with features

---

## 💡 Common Commands

### Backend

| Command | What it does |
|---------|------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm test` | Run tests (setup needed) |

### Frontend

| Command | What it does |
|---------|------------|
| `npm install` | Install dependencies |
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |

---

## 🌐 API Endpoints Available

Once backend is running, try these:

```bash
# Health check
GET http://localhost:5000/api/health

# User signup
POST http://localhost:5000/api/auth/register
Body: { "email": "user@example.com", "password": "pass", "name": "John" }

# User login
POST http://localhost:5000/api/auth/login
Body: { "email": "user@example.com", "password": "pass" }

# Add expense (requires JWT token)
POST http://localhost:5000/api/expenses
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "amount": 25.50, "description": "Lunch", "category": "Food & Dining" }

# Get expenses
GET http://localhost:5000/api/expenses
Headers: { "Authorization": "Bearer YOUR_TOKEN" }

# Get insights
GET http://localhost:5000/api/insights/monthly?month=2024-04
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

---

## 📱 Features Available

✅ **User Authentication**
- Signup with email and password
- Login with JWT tokens
- Secure password hashing

✅ **Expense Management**
- Add, edit, delete expenses
- Categories and payment methods
- Date tracking

✅ **AI Categorization**
- Automatic expense categorization
- Confidence scores
- Fallback to heuristics

✅ **Analytics & Insights**
- Spending by category
- Monthly trends
- AI-generated recommendations
- Anomaly detection

✅ **Chat Interface**
- Ask questions about your spending
- Natural language processing
- Contextual responses

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Modern UI with gradients
- Smooth animations

---

## 🆘 Need Help?

### Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MongoDB is running, check `.env` config |
| Frontend won't start | Delete `node_modules`, run `npm install` again |
| Port already in use | Kill process using the port (see Troubleshooting) |
| CORS error | Ensure both servers are running on correct ports |
| Auth not working | Check JWT_SECRET in `.env` is set |
| Can't see expenses | Make sure you're logged in (token in header) |

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **MongoDB**: https://docs.mongodb.com/
- **JWT**: https://jwt.io/
- **Axios**: https://axios-http.com/

---

## 🎉 You're All Set!

Your production-ready AI Expense Tracker is now running!

**Remember:**
- Keep both terminal windows open while developing
- For production, you'd need proper deployment (Vercel, Heroku, AWS, etc.)
- Enable HTTPS and use strong secrets in production
- Consider a database backup strategy

**Happy tracking! 💰**

---

## 📞 Quick Reference: One-Command System Check

```bash
# All in one - Check if system is ready
echo "Checking prerequisites..."
node --version && npm --version && (mongod --version || echo "MongoDB not found locally (use Atlas)")
```

---

**Last Updated**: April 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
