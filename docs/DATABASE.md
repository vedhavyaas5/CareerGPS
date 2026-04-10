# Database Schema - CareerGPS

## Collections Overview

### 1. Users
Stores student/parent/admin profiles and authentication.

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  grade: Number (8 | 9 | 10),
  role: String ("student" | "parent" | "admin"),
  parentEmail: String (optional, for parent linking),
  interestedCareers: [String],
  skillScores: Map<String, Number>, // { "UI Design": 75, ... }
  engagementIndex: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Simulations
Career simulation tasks with learning objectives.

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String ("design" | "engineering" | "business" | "healthcare" | "creative" | "tech"),
  difficulty: String ("beginner" | "intermediate" | "advanced"),
  duration: Number, // minutes
  objectives: [String],
  skillsTagged: [String],
  icon: String,
  content: {
    intro: String,
    tasks: [
      {
        taskId: String,
        title: String,
        description: String,
        expectedOutcome: String
      }
    ]
  },
  createdAt: Date
}
```

### 3. Engagement
Tracks student interaction with each simulation.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  simulationId: ObjectId (ref: Simulation),
  status: String ("not-started" | "in-progress" | "completed"),
  timeSpent: Number, // seconds
  retryCount: Number,
  score: Number (0-100),
  improvementScore: Number, // (latest - first) / first * 100
  completionDate: Date (optional),
  skillsGained: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Skills
Definitions of skills and career mappings.

```javascript
{
  _id: ObjectId,
  name: String (unique),
  category: String,
  level: String ("beginner" | "intermediate" | "advanced"),
  relatedCareers: [String], // ["UX Designer", "Product Designer", ...]
  description: String,
  createdAt: Date
}
```

### 5. Portfolio
Auto-generated portfolio from completed work.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  completedSimulations: [
    {
      simulationId: ObjectId,
      title: String,
      completedAt: Date,
      score: Number
    }
  ],
  badges: [
    {
      name: String,
      icon: String,
      earnedAt: Date
    }
  ],
  skillsBadges: [String], // Unlocked skill badges
  totalProjectsCompleted: Number,
  engagementTrend: [Number], // Weekly scores for trending graph
  createdAt: Date
}
```

---

## Indexes

```javascript
// Users
db.users.createIndex({ email: 1 });
db.users.createIndex({ grade: 1 });

// Engagement
db.engagement.createIndex({ userId: 1, simulationId: 1 });
db.engagement.createIndex({ userId: 1, createdAt: -1 });

// Portfolio
db.portfolio.createIndex({ userId: 1 });

// Skills
db.skills.createIndex({ category: 1 });
```

---

## Relationships (ERD)

```
User
├── 1:N → Engagement
├── 1:1 → Portfolio
└── N:M → Skill (through Engagement)

Simulation
├── 1:N → Engagement
└── N:M → Skill (skillsTagged)

Skill
├── 1:N → Engagement (skillsGained)
└── N:M → Career relations
```

---

## Sample Data Population

See `backend/scripts/seed.js` for seeding:
- 5 sample simulations
- 15 skills with career mappings
- Auto-referenced relationships

Run: `node scripts/seed.js`

---

## Growth Projections

| Metric | 100 Students | 1000 Students | 10K Students |
|--------|-------------|--------------|--------------|
| Users | ~250 KB | 2.5 MB | 25 MB |
| Engagement | ~500 KB | 5 MB | 50 MB |
| Total Size | ~2 MB | 20 MB | 200 MB |

*Recommendation: Enable MongoDB compression & archival after 12 months.*
