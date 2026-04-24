# 🎯 QUICK START GUIDE

This is a quick reference for getting the project running.

## 📋 Prerequisites (5 minutes)

1. **Node.js**: Download from https://nodejs.org/ (v16+)
2. **MongoDB**: 
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (recommended)

## ⚡ Fast Setup (5 minutes)

### Option 1: Automatic Setup (Linux/Mac)
```bash
chmod +x quick_start.sh
./quick_start.sh
```

### Option 2: Manual Setup

#### Terminal 1 - Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

#### Terminal 2 - Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```

## ✅ Verification

- Backend: http://localhost:5000/api/health → Should return JSON
- Frontend: http://localhost:3000 → Should show login page

## 🸀 First Test

1. Sign Up with: john@example.com / password123
2. Add expense: $25.50 for "Lunch"
3. Go to Chat tab
4. Ask: "How much did I spend?"

## 🆘 Troubleshooting

**MongoDB won't connect:**
- Check connection string in backend/.env
- Ensure MongoDB is running locally: `mongod` or check Atlas connection

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -ti :5000 | xargs kill -9
```

**npm install fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 Full Documentation

See `COMPLETE_SETUP_GUIDE.md` for detailed information.

## 🚀 You're Done!

Both servers running = Success! 🎉

---

**Backend Running:**
```
✅ MongoDB Connected
🎯 Server started on http://localhost:5000
```

**Frontend Running:**
```
Compiled successfully!
Local: http://localhost:3000
```

**Now visit**: http://localhost:3000 and start tracking! 💰
