const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  simulationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Simulation',
    required: true,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started',
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  improvementScore: {
    type: Number,
    default: 0,
  },
  completionDate: Date,
  skillsGained: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Engagement', engagementSchema);
