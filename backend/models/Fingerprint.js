const mongoose = require('mongoose');

const fingerprintSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  domainWeights: {
    type: Map,
    of: Number,
    default: {
      healthcare: 0,
      technology: 0,
      law: 0,
      design: 0,
      business: 0,
      science: 0,
      environment: 0,
      social: 0,
    },
  },
  version: {
    type: String,
    default: 'v1.0',
  },
  quizWeight: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1,
  },
  behaviorWeight: {
    type: Number,
    default: 0.0,
    min: 0,
    max: 1,
  },
  grade: {
    type: Number,
    enum: [8, 9, 10],
    default: 9,
  },
  quizResponses: {
    saturdayPick: {
      type: Object,
      default: null,
    },
    emojiReactions: {
      type: Object,
      default: null,
    },
    imageInstinct: {
      type: Object,
      default: null,
    },
  },
  hiddenMetrics: {
    totalQuizTimeMs: { type: Number, default: 0 },
    stepTimings: { type: Object, default: {} },
    hesitationPatterns: [
      {
        step: String,
        timeMs: Number,
        confident: Boolean,
      },
    ],
    contradictions: [
      {
        domain: String,
        quizSignal: String,
        detail: String,
      },
    ],
  },
  activeDomains: {
    type: [String],
    default: [],
  },
  dormantDomains: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUpdated on save
fingerprintSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

// Increment version on update
fingerprintSchema.methods.incrementVersion = function () {
  const parts = this.version.replace('v', '').split('.');
  const minor = parseInt(parts[1] || 0) + 1;
  this.version = `v${parts[0]}.${minor}`;
};

// Apply weight decay based on days since creation
fingerprintSchema.methods.getDecayedWeights = function () {
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);

  let quizW, behaviorW;
  if (daysSinceCreation <= 1) {
    quizW = 1.0;
    behaviorW = 0.0;
  } else if (daysSinceCreation <= 14) {
    quizW = 0.6;
    behaviorW = 0.4;
  } else if (daysSinceCreation <= 60) {
    quizW = 0.2;
    behaviorW = 0.8;
  } else {
    quizW = 0.05;
    behaviorW = 0.95;
  }

  return { quizWeight: quizW, behaviorWeight: behaviorW };
};

module.exports = mongoose.model('Fingerprint', fingerprintSchema);
