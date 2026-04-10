# API Documentation - CareerGPS

## Base URL
```
http://localhost:5000/api
```

---

## 🔑 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

Tokens expire in 7 days.

---

## 📋 Endpoints

### Auth Routes (`/auth`)

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "grade": 9
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "grade": 9
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response (200): Same as register
```

#### Demo Login (No credentials needed)
```
POST /auth/demo-login

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "demo-user-123",
    "name": "Demo Student",
    "email": "demo@careergps.com",
    "grade": 9,
    "role": "student"
  }
}
```

---

### Simulations (`/simulations`)

#### Get All Simulations
```
GET /simulations

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "UI Designer Challenge",
    "description": "Design a mobile app interface...",
    "category": "design",
    "difficulty": "beginner",
    "duration": 15,
    "objectives": ["Understand user needs", "Create wireframes"],
    "skillsTagged": ["UI Design", "User Research"],
    "content": { ... }
  },
  ...
]
```

#### Get Single Simulation
```
GET /simulations/:id

Response (200): { ... simulation object ... }
Response (404): { "error": "Simulation not found" }
```

#### Create Simulation (Admin)
```
POST /simulations
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "New Simulation",
  "description": "...",
  "category": "tech",
  "difficulty": "intermediate",
  "duration": 20,
  "skills": ["Python", "Problem Solving"],
  "content": { ... }
}

Response (201): { ... created simulation ... }
```

---

### Engagement (`/engagement`)

#### Get User Engagement History
```
GET /engagement/user/:userId
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "simulationId": {...},
    "status": "completed",
    "timeSpent": 900, // seconds
    "retryCount": 2,
    "score": 85,
    "improvementScore": 15,
    "skillsGained": ["UI Design"],
    "createdAt": "2026-02-23T10:30:00Z"
  },
  ...
]
```

#### Log Engagement
```
POST /engagement
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "simulationId": "507f1f77bcf86cd799439021",
  "status": "completed",
  "timeSpent": 900,
  "retryCount": 2,
  "score": 85
}

Response (200): { ... engagement record ... }
```

#### Get Analytics
```
GET /engagement/analytics/:userId
Authorization: Bearer <token>

Response (200):
{
  "totalTimeSpent": 45, // minutes
  "totalRetries": 12,
  "averageScore": 78,
  "completedSimulations": 3,
  "totalEngagementIndex": 85
}
```

---

### Recommendations (`/recommendations`)

#### Get Personalized Career Recommendations
```
GET /recommendations/user/:userId
Authorization: Bearer <token>

Response (200):
{
  "topSkills": ["UI Design", "Problem Solving", "Communication"],
  "recommendedCareers": [
    "UX Designer",
    "Product Manager",
    "Frontend Developer"
  ],
  "engagementIndex": 85,
  "improvementTrend": "Positive ↗"
}
```

---

### Users (`/users`)

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "grade": 9,
  "interestedCareers": ["UX Designer", "Product Manager"],
  "engagementIndex": 85,
  "createdAt": "2026-02-20T10:00:00Z"
}
```

#### Update Profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Michael Doe",
  "grade": 10,
  "interestedCareers": ["Software Engineer", "AI Engineer"]
}

Response (200): { ... updated user ... }
```

---

## Error Responses

```javascript
400 Bad Request
{ "error": "Missing required fields" }

401 Unauthorized
{ "error": "Invalid credentials" }

403 Forbidden
{ "error": "Insufficient permissions" }

409 Conflict
{ "error": "User already exists" }

500 Internal Server Error
{ "error": "Something went wrong!" }
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Rate Limiting

*Not implemented in MVP, recommended for production.*

Suggested: 100 requests per minute per IP

---

## Health Check

```
GET /api/health

Response (200):
{ "status": "CareerGPS API running ✨" }
```
