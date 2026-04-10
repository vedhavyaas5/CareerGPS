# Deployment Guide - CareerGPS

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

**Backend (Railway):**
1. Push code to GitHub
2. Connect GitHub repo to Railway.app
3. Set environment variables in Railway dashboard
4. Railway auto-deploys on push

### Option 2: Heroku (Both)

**Backend:**
```bash
heroku create careergps-api
heroku config:set JWT_SECRET=your_secret
heroku addons:create mongolab:sandbox
git push heroku main
```

**Frontend:**
```bash
# Add Heroku buildpack for Node
heroku buildpacks:add heroku/nodejs
cd frontend
git push heroku main
```

### Option 3: Docker + AWS ECS

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Build & Push:**
```bash
docker build -t careergps-api .
aws ecr create-repository --repository-name careergps-api
docker tag careergps-api:latest <ECR_URI>:latest
docker push <ECR_URI>:latest
```

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/careergps
JWT_SECRET=your-long-random-secret-key-here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://careergps.vercel.app
```

### Frontend (.env.local)
```
REACT_APP_API_URL=https://careergps-api.up.railway.app/api
```

---

## Database Setup (MongoDB Atlas)

1. Create free cluster on mongodb.com
2. Create database user (careergps_admin)
3. Add IP whitelist (0.0.0.0 for now, restrict later)
4. Copy connection string
5. Replace in `MONGODB_URI` env var

---

## DNS Configuration

1. Buy domain (namecheap, godaddy)
2. Point to Vercel nameservers
3. Backend: Add CNAME record pointing to Railway/Render URL

---

## CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: cd backend && npm run build
      # Deploy to Railway/Render here

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd frontend && npm install && npm run build
      # Deploy to Vercel here
```

---

**Estimated Setup Time:** 30 minutes  
**Monthly Cost (M1 tier):** ~$15-20 (MongoDB + compute)
