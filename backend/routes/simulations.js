const express = require('express');
const Simulation = require('../models/Simulation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all simulations
router.get('/', async (req, res) => {
  try {
    const simulations = await Simulation.find();
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single simulation
router.get('/:id', async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new simulation (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, difficulty, duration, skills, content } = req.body;
    
    const simulation = new Simulation({
      title,
      description,
      category,
      difficulty,
      duration,
      skillsTagged: skills,
      content,
    });

    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
