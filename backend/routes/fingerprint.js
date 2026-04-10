const express = require('express');
const Fingerprint = require('../models/Fingerprint');

const router = express.Router();

// POST /api/fingerprint — Create or update fingerprint from onboarding quiz
router.post('/', async (req, res) => {
  try {
    const {
      studentId,
      domainWeights,
      grade,
      quizResponses,
      hiddenMetrics,
      activeDomains,
      dormantDomains,
    } = req.body;

    if (!studentId || !domainWeights) {
      return res.status(400).json({ error: 'studentId and domainWeights are required' });
    }

    // Upsert: create or update
    let fingerprint = await Fingerprint.findOne({ studentId });

    if (fingerprint) {
      // Update existing
      fingerprint.domainWeights = new Map(Object.entries(domainWeights));
      fingerprint.grade = grade || fingerprint.grade;
      fingerprint.quizResponses = quizResponses || fingerprint.quizResponses;
      fingerprint.hiddenMetrics = hiddenMetrics || fingerprint.hiddenMetrics;
      fingerprint.activeDomains = activeDomains || fingerprint.activeDomains;
      fingerprint.dormantDomains = dormantDomains || fingerprint.dormantDomains;
      fingerprint.incrementVersion();
    } else {
      // Create new
      fingerprint = new Fingerprint({
        studentId,
        domainWeights: new Map(Object.entries(domainWeights)),
        version: 'v1.0',
        quizWeight: 1.0,
        behaviorWeight: 0.0,
        grade: grade || 9,
        quizResponses: quizResponses || {},
        hiddenMetrics: hiddenMetrics || {},
        activeDomains: activeDomains || [],
        dormantDomains: dormantDomains || [],
      });
    }

    await fingerprint.save();

    res.status(201).json({
      success: true,
      fingerprint: {
        studentId: fingerprint.studentId,
        domainWeights: Object.fromEntries(fingerprint.domainWeights),
        version: fingerprint.version,
        quizWeight: fingerprint.quizWeight,
        behaviorWeight: fingerprint.behaviorWeight,
        grade: fingerprint.grade,
        activeDomains: fingerprint.activeDomains,
        dormantDomains: fingerprint.dormantDomains,
        createdAt: fingerprint.createdAt,
        lastUpdated: fingerprint.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Fingerprint creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/fingerprint/:studentId — Get fingerprint with decayed weights
router.get('/:studentId', async (req, res) => {
  try {
    const fingerprint = await Fingerprint.findOne({ studentId: req.params.studentId });

    if (!fingerprint) {
      return res.status(404).json({ error: 'Fingerprint not found', exists: false });
    }

    // Calculate decayed weights
    const decayed = fingerprint.getDecayedWeights();

    res.json({
      exists: true,
      fingerprint: {
        studentId: fingerprint.studentId,
        domainWeights: Object.fromEntries(fingerprint.domainWeights),
        version: fingerprint.version,
        quizWeight: decayed.quizWeight,
        behaviorWeight: decayed.behaviorWeight,
        grade: fingerprint.grade,
        activeDomains: fingerprint.activeDomains,
        dormantDomains: fingerprint.dormantDomains,
        createdAt: fingerprint.createdAt,
        lastUpdated: fingerprint.lastUpdated,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
