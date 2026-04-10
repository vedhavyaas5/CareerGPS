const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  relatedCareers: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Skill', skillSchema);
