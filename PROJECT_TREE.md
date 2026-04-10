# CareerGPS Project Tree

```
careergps/
│
├── 📄 README.md                          ⭐ START HERE
├── 📄 LAUNCH_SUMMARY.md                  📋 What's included + quick start
├── 📄 PITCH.md                           🎤 Hackathon pitch guide (6-7 min)
├── 📄 DEPLOYMENT.md                      🚀 Production deployment options
├── 📄 setup.sh                           ⚙️ One-command setup script
├── 📄 .gitignore                         🔒 Git ignore rules
│
├── 📁 backend/                           🔧 Node.js + Express API
│   ├── 📄 server.js                      🚀 Main Express app (port 5000)
│   ├── 📄 package.json                   📦 Dependencies
│   ├── 📄 .env.example                   🔐 Environment template
│   │
│   ├── 📁 models/                        📊 MongoDB Schemas
│   │   ├── User.js                       👤 Student/Parent/Admin
│   │   ├── Simulation.js                 🎮 Career tasks
│   │   ├── Engagement.js                 📈 Tracking metrics
│   │   ├── Skill.js                      🌳 Skill definitions
│   │   └── Portfolio.js                  📁 Auto-generated portfolio
│   │
│   ├── 📁 routes/                        🔗 API Endpoints
│   │   ├── auth.js                       🔑 Login/Register/Demo
│   │   ├── simulations.js                🎮 Simulation CRUD
│   │   ├── engagement.js                 📊 Track engagement & analytics
│   │   ├── recommendations.js            🤖 AI recommendations
│   │   └── users.js                      👤 Profile management
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                       🔐 JWT verification
│   │
│   ├── 📁 config/
│   │   └── db.js                         🗄️ MongoDB connection
│   │
│   └── 📁 scripts/
│       └── seed.js                       🌱 Sample data seeding
│
├── 📁 frontend/                          ⚛️ React.js UI (Port 3000)
│   ├── 📄 package.json                   📦 Dependencies
│   ├── 📄 .env.example                   🔐 Environment template
│   ├── 📄 index.html                     🌐 HTML entry
│   ├── 📄 vite.config.js                 ⚡ Bundler config
│   │
│   └── 📁 src/
│       ├── 📄 App.jsx                    🔀 Router (React Router v6)
│       ├── 📄 index.jsx                  📍 React entry point
│       ├── 📄 index.css                  🎨 Global styles + animations
│       │
│       ├── 📁 pages/                     📄 Full page components
│       │   ├── LandingPage.jsx           🏠 Hero + features + CTA
│       │   ├── AuthPage.jsx              🔑 Login/Register forms
│       │   └── DashboardPage.jsx         📊 Student dashboard
│       │
│       ├── 📁 components/                🧩 Reusable UI components
│       │   ├── Navbar.jsx                🧭 Top navigation
│       │   └── UIComponents.jsx          🎨 Glass cards, buttons, badges
│       │
│       └── 📁 utils/                     🔧 Utilities
│           ├── api.js                    🌐 Axios API client
│           └── auth.js                   🔐 Auth helpers (token, user)
│
├── 📁 docs/                              📚 Documentation
│   ├── API.md                            🔗 All 15+ endpoints documented
│   ├── DATABASE.md                       📊 MongoDB schema + ERD
│   └── AI_ALGORITHM.md                   🤖 Recommendation logic pseudocode
│
└── 📁 .github/                           (Optional for CI/CD)
    └── workflows/deploy.yml              🚀 GitHub Actions pipeline
```

---

## 🎯 File Navigation Guide

### For Quick Start
1. **README.md** — Project overview & setup
2. **LAUNCH_SUMMARY.md** — What's included + quick demo
3. **backend/.env.example** → Edit & copy to `.env`
4. Run `npm install` in both folders

### For Hackathon Pitch
1. **PITCH.md** — Full 6-7 minute pitch
2. **LAUNCH_SUMMARY.md** — Demo checklist
3. Practice with demo mode (no login needed)

### For API Integration
1. **docs/API.md** — All endpoints
2. **frontend/src/utils/api.js** — How to call API
3. **backend/routes/** — Implementation

### For Database
1. **docs/DATABASE.md** — Full schema
2. **backend/models/** — Mongoose definitions
3. **backend/scripts/seed.js** — Sample data

### For AI & Recommendations
1. **docs/AI_ALGORITHM.md** — Full pseudocode
2. **backend/routes/recommendations.js** — Implementation
3. **frontend/src/pages/DashboardPage.jsx** — UI integration

### For Deployment
1. **DEPLOYMENT.md** — All options (Vercel, Railway, Docker)
2. **backend/.env.example** → Production values
3. **frontend/.env.example** → API URL

---

## 🚀 Critical Files (Don't Miss!)

| File | Why Important |
|------|---------------|
| `backend/.env.example` | Get MongoDB URI first! |
| `backend/server.js` | Main backend entry |
| `backend/scripts/seed.js` | Populate sample data |
| `frontend/src/App.jsx` | React router setup |
| `frontend/src/pages/LandingPage.jsx` | Hero & landing UI |
| `docs/API.md` | All endpoints reference |
| `PITCH.md` | Judges love this! |

---

## 📊 Key Statistics

| Metric | Value |
|--------|-------|
| **Backend Files** | 12 |
| **Frontend Components** | 6 |
| **API Routes** | 15+ endpoints |
| **Database Models** | 5 schemas |
| **Sample Simulations** | 5 tasks |
| **Skills Defined** | 15 skills |
| **Lines of Code** | ~3,500 |
| **Documentation** | 7 guides |

---

## ✅ Pre-Launch Checklist

- [ ] Read README.md
- [ ] Run setup.sh or manual setup
- [ ] Edit backend/.env with MongoDB URI
- [ ] Seed database: `node scripts/seed.js`
- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm start`
- [ ] Test demo mode (click button on landing)
- [ ] Review PITCH.md before judges
- [ ] Check docs/API.md for questions

---

**Tree Last Updated:** February 23, 2026
