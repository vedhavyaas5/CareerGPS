const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, grade } = req.body;

    // Validate input
    if (!name || !email || !password || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      grade,
      role: 'student',
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user._id, name, email, grade } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email, grade: user.grade } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo Login (no credentials needed)
router.post('/demo-login', (req, res) => {
  try {
    const demoUser = {
      _id: 'demo-user-123',
      name: 'Demo Student',
      email: 'demo@careergps.com',
      grade: 9,
      role: 'student',
    };

    const token = jwt.sign(
      { userId: demoUser._id, email: demoUser.email, role: demoUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: demoUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
