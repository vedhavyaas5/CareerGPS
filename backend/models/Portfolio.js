const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  completedSimulations: [
    {
      simulationId: mongoose.Schema.Types.ObjectId,
      title: String,
      completedAt: Date,
      score: Number,
    },
  ],
  badges: [
    {
      name: String,
      icon: String,
      earnedAt: Date,
    },
  ],
  skillsBadges: [String],
  totalProjectsCompleted: {
    type: Number,
    default: 0,
  },
  engagementTrend: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
