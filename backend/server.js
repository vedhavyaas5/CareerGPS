const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const simulationRoutes = require('./routes/simulations');
const engagementRoutes = require('./routes/engagement');
const recommendationRoutes = require('./routes/recommendations');
const usersRoutes = require('./routes/users');
const fingerprintRoutes = require('./routes/fingerprint');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    // Allow configured frontend URL
    const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (origin === allowed) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careergps', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.log('❌ MongoDB connection failed:', err.message);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/fingerprint', fingerprintRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'CareerGPS API running ✨' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareerGPS Backend running on port ${PORT}`);
});
