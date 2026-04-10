const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['design', 'engineering', 'business', 'healthcare', 'creative', 'tech'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
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
        expectedOutcome: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Simulation', simulationSchema);
