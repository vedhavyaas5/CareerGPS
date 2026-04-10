const express = require('express');
const Engagement = require('../models/Engagement');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user engagement history
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const engagements = await Engagement.find({ userId: req.params.userId })
      .populate('simulationId')
      .sort({ createdAt: -1 });
    res.json(engagements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update engagement
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, simulationId, status, timeSpent, retryCount, score } = req.body;

    let engagement = await Engagement.findOne({ userId, simulationId });

    if (!engagement) {
      engagement = new Engagement({
        userId,
        simulationId,
        status,
        timeSpent,
        retryCount,
        score,
      });
    } else {
      engagement.status = status || engagement.status;
      engagement.timeSpent = (engagement.timeSpent || 0) + (timeSpent || 0);
      engagement.retryCount = (engagement.retryCount || 0) + (retryCount || 0);
      engagement.score = score || engagement.score;
      engagement.updatedAt = new Date();
    }

    await engagement.save();
    res.json(engagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get engagement analytics
router.get('/analytics/:userId', authenticateToken, async (req, res) => {
  try {
    const engagements = await Engagement.find({ userId: req.params.userId });
    
    const totalTimeSpent = engagements.reduce((sum, e) => sum + (e.timeSpent || 0), 0);
    const totalRetries = engagements.reduce((sum, e) => sum + (e.retryCount || 0), 0);
    const avgScore = engagements.length > 0 
      ? engagements.reduce((sum, e) => sum + (e.score || 0), 0) / engagements.length 
      : 0;
    const completedCount = engagements.filter(e => e.status === 'completed').length;

    res.json({
      totalTimeSpent: Math.round(totalTimeSpent / 60),
      totalRetries,
      averageScore: Math.round(avgScore),
      completedSimulations: completedCount,
      totalEngagementIndex: (completedCount * 10) + Math.round(avgScore / 10),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
