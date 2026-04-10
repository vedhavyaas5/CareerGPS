#!/bin/bash

# CareerGPS Setup Script

echo "🚀 CareerGPS Project Setup"
echo "=========================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
cp .env.example .env
echo "  - Created .env from template (EDIT with your MongoDB URI & JWT SECRET)"

if [ ! -d "node_modules" ]; then
    npm install
    echo "  - ✅ Dependencies installed"
else
    echo "  - Node modules already exist"
fi

# Optional: Seed database
read -p "  - Seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    node scripts/seed.js
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend
cp .env.example .env.local 2>/dev/null || echo "  - No .env.example for frontend (using defaults)"

if [ ! -d "node_modules" ]; then
    npm install
    echo "  - ✅ Dependencies installed"
else
    echo "  - Node modules already exist"
fi

cd ..

# Summary
echo ""
echo "✨ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "  2. Terminal 1: cd backend && npm run dev"
echo "  3. Terminal 2: cd frontend && npm start"
echo "  4. Open http://localhost:3000"
echo ""
echo "🎯 Quick Demo:"
echo "  - Click 'Demo Mode' on landing page (no login needed)"
echo ""
echo "📚 Docs:"
echo "  - README.md — Full overview"
echo "  - docs/API.md — Backend routes"
echo "  - docs/DATABASE.md — Schema"
echo "  - docs/AI_ALGORITHM.md — Recommendation logic"
echo "  - PITCH.md — Hackathon pitch guide"
echo ""
echo "Happy coding! 🎉"
