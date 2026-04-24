#!/bin/bash

# 🚀 QUICK START SCRIPT FOR AI EXPENSE TRACKER
#
# This script automates the setup. Run as:
# bash quick_start.sh
#
# Or follow the manual steps below if script fails

echo "🚀 AI Expense Tracker - Quick Start"
echo "===================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found: $(node --version)"
echo ""

# Check if .env files exist
echo "✓ Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env from template"
    echo "⚠️  Edit backend/.env with your MongoDB URI and JWT_SECRET"
else
    echo "✓ backend/.env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✓ Created frontend/.env from template"
else
    echo "✓ frontend/.env already exists"
fi
echo ""

# Install Backend Dependencies
echo "⏳ Installing backend dependencies..."
cd backend
npm install --silent
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install Frontend Dependencies
echo "⏳ Installing frontend dependencies..."
cd frontend
npm install --silent
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Summary
echo "✅ SETUP COMPLETE!"
echo ""
echo "📝 NEXT STEPS:"
echo "============"
echo ""
echo "1. Configure Backend:"
echo "   Edit: backend/.env"
echo "   - Set MONGODB_URI to your MongoDB connection string"
echo "   - Set JWT_SECRET to a secure random string"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open browser: http://localhost:3000"
echo ""
echo "5. Sign up and start tracking expenses! 💰"
echo ""
