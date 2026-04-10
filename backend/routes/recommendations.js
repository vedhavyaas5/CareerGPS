const express = require('express');
const Skill = require('../models/Skill');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all skills (for skill tree)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations for user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Fetch user engagement, calculate recommendations
    const Engagement = require('../models/Engagement');
    const User = require('../models/User');

    const user = await User.findById(req.params.userId);
    const engagements = await Engagement.find({ userId: req.params.userId });

    // Simple recommendation logic: find top engaged skills
    const skillFrequency = {};
    engagements.forEach(e => {
      if (e.skillsGained) {
        e.skillsGained.forEach(skill => {
          skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        });
      }
    });

    const recommendedSkills = Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);

    // Find careers related to top skills
    const skills = await Skill.find({ name: { $in: recommendedSkills } });
    const recommendedCareers = [...new Set(skills.flatMap(s => s.relatedCareers))].slice(0, 3);

    res.json({
      topSkills: recommendedSkills,
      recommendedCareers,
      engagementIndex: user.engagementIndex,
      improvementTrend: 'Positive ↗',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
