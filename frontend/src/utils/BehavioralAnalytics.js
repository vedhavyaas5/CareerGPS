/**
 * BEHAVIORAL ANALYTICS SYSTEM
 * 
 * Tracks and analyzes user behavior patterns during career simulations
 * without visible feedback to the student.
 * 
 * Silent Metrics:
 * - Decision timing patterns
 * - Risk preference curves
 * - Exploration vs. focused behavior
 * - Learning velocity
 * - Consistency scoring
 */

class BehavioralAnalytics {
  constructor(studentId, careerId) {
    this.studentId = studentId;
    this.careerId = careerId;
    this.events = [];
    this.startTime = Date.now();
    this.scenes = {};
    this.riskProfile = {
      safeChoices: 0,
      moderateChoices: 0,
      cautiousChoices: 0
    };
  }

  /**
   * Record a scene interaction event
   * @param {Object} eventData - Scene decision event
   */
  recordSceneEvent(eventData) {
    const {
      sceneId,
      optionChosen,
      riskLevel,
      timeTaken,
      replayCount,
      timestamp
    } = eventData;

    // Initialize scene data if new
    if (!this.scenes[sceneId]) {
      this.scenes[sceneId] = {
        visits: 0,
        decisions: [],
        replays: 0,
        averageTime: 0,
        totalTime: 0
      };
    }

    // Record decision
    this.scenes[sceneId].visits += 1;
    this.scenes[sceneId].replays += replayCount;
    this.scenes[sceneId].totalTime += timeTaken;
    this.scenes[sceneId].averageTime = this.scenes[sceneId].totalTime / this.scenes[sceneId].visits;
    this.scenes[sceneId].decisions.push({
      option: optionChosen,
      risk: riskLevel,
      time: timeTaken,
      timestamp
    });

    // Update risk profile
    this.riskProfile[`${riskLevel}Choices`] += 1;

    // Store event
    this.events.push({
      ...eventData,
      recordedAt: Date.now(),
      sessionDuration: Date.now() - this.startTime
    });

    return this.computeMetrics();
  }

  /**
   * Compute behavioral metrics from events
   * @returns {Object} Current behavioral metrics
   */
  computeMetrics() {
    const totalChoices = this.events.length;
    if (totalChoices === 0) return null;

    // DECISION SPEED ANALYSIS
    const decisionTimes = this.events.map(e => e.timeTaken);
    const avgDecisionTime = decisionTimes.reduce((a, b) => a + b) / totalChoices;
    const decisionSpeedTrend = this.analyzeDecisionSpeedTrend();

    // RISK PROFILE
    const totalRiskChoices = Object.values(this.riskProfile).reduce((a, b) => a + b);
    const riskTakingPercentage = {
      safe: (this.riskProfile.safeChoices / totalRiskChoices) * 100,
      moderate: (this.riskProfile.moderateChoices / totalRiskChoices) * 100,
      cautious: (this.riskProfile.cautiousChoices / totalRiskChoices) * 100
    };

    // CONSISTENCY SCORING
    const consistencyScore = this.calculateConsistency();

    // LEARNING VELOCITY
    const learningVelocity = this.calculateLearningVelocity();

    // EXPLORATION DEPTH
    const explorationDepth = this.calculateExplorationDepth();

    // REPLAY PATTERN (strong interest signal)
    const replayTendency = this.calculateReplayTendency();

    return {
      avgDecisionTime,
      decisionSpeedTrend,
      riskTakingPercentage,
      consistencyScore,
      learningVelocity,
      explorationDepth,
      replayTendency,
      totalDecisions: totalChoices,
      timestamp: Date.now()
    };
  }

  /**
   * Analyze if decisions are getting faster (indicates comfort/familiarity)
   * @returns {String} 'accelerating' | 'stable' | 'decelerating'
   */
  analyzeDecisionSpeedTrend() {
    if (this.events.length < 3) return 'insufficient_data';

    const firstThird = this.events.slice(0, Math.ceil(this.events.length / 3));
    const lastThird = this.events.slice(-Math.ceil(this.events.length / 3));

    const firstAvg = firstThird.reduce((sum, e) => sum + e.timeTaken, 0) / firstThird.length;
    const lastAvg = lastThird.reduce((sum, e) => sum + e.timeTaken, 0) / lastThird.length;

    const improvement = ((firstAvg - lastAvg) / firstAvg) * 100;

    if (improvement > 15) return 'accelerating'; // Getting faster
    if (improvement < -15) return 'decelerating'; // Getting slower
    return 'stable'; // No significant change
  }

  /**
   * Calculate consistency: do decisions match stated preferences?
   * @returns {Number} 0-100
   */
  calculateConsistency() {
    if (this.events.length < 2) return 50;

    // Group choices by type
    const choicePatterns = {};
    this.events.forEach(event => {
      if (!choicePatterns[event.optionChosen]) {
        choicePatterns[event.optionChosen] = 0;
      }
      choicePatterns[event.optionChosen] += 1;
    });

    // Calculate entropy (lower = more consistent)
    const entropy = Object.values(choicePatterns).reduce((sum, count) => {
      const prob = count / this.events.length;
      return sum - (prob * Math.log2(prob));
    }, 0);

    // Normalize to 0-100 (max entropy for ~8 choices ~= 3)
    const maxEntropy = Math.log2(this.events.length);
    const consistency = Math.max(0, 100 - (entropy / maxEntropy) * 100);

    return Math.round(consistency);
  }

  /**
   * Calculate learning velocity: improvement in decision-making over time
   * @returns {Number} 0-100
   */
  calculateLearningVelocity() {
    if (this.events.length < 3) return 50;

    const quarter1 = this.events.slice(0, Math.ceil(this.events.length / 4));
    const quarter4 = this.events.slice(-Math.ceil(this.events.length / 4));

    const q1AvgTime = quarter1.reduce((sum, e) => sum + e.timeTaken, 0) / quarter1.length;
    const q4AvgTime = quarter4.reduce((sum, e) => sum + e.timeTaken, 0) / quarter4.length;

    // Faster decisions later = learning
    const speedImprovement = Math.max(0, ((q1AvgTime - q4AvgTime) / q1AvgTime) * 100);

    // Also check if completing scenes with fewer replays
    const replayReduction = Math.max(0, 100 - (this.getTotalReplays() / this.events.length) * 50);

    return Math.round((speedImprovement + replayReduction) / 2);
  }

  /**
   * Calculate exploration depth: variety in choices and scenarios revisited
   * @returns {Number} 0-100
   */
  calculateExplorationDepth() {
    const uniqueOptions = new Set(this.events.map(e => e.optionChosen)).size;
    const uniqueScenes = Object.keys(this.scenes).length;
    const revisitedScenes = Object.values(this.scenes).filter(s => s.visits > 1).length;

    // Scoring: variety in options + revisiting scenes
    const optionVariety = Math.min(100, (uniqueOptions / this.events.length) * 100);
    const sceneRevisits = Math.min(100, (revisitedScenes / uniqueScenes) * 50);

    return Math.round((optionVariety + sceneRevisits) / 2);
  }

  /**
   * Calculate replay tendency: indicator of strong interest
   * @returns {Object} Replay analysis
   */
  calculateReplayTendency() {
    const totalReplays = this.getTotalReplays();
    const replayRatio = this.events.length > 0 ? (totalReplays / this.events.length) : 0;

    return {
      totalReplays,
      replayRatio: Math.round(replayRatio * 100) / 100,
      intensity: replayRatio > 0.5 ? 'high' : replayRatio > 0.2 ? 'moderate' : 'low',
      strongInterestSignal: replayRatio > 0.3 // Threshold for strong interest
    };
  }

  /**
   * Get total replay count across all events
   */
  getTotalReplays() {
    return this.events.reduce((sum, e) => sum + (e.replayCount || 0), 0);
  }

  /**
   * Generate engagement score (weighted formula)
   * 
   * Engagement Score = 
   *   (0.3 × session_time_score) +
   *   (0.25 × replay_weight) +
   *   (0.2 × completion_flag) +
   *   (0.15 × improvement_delta) +
   *   (0.1 × depth_of_interaction)
   * 
   * @param {Number} sessionMinutes - Total session duration in minutes
   * @param {Boolean} completed - Whether simulation was completed
   * @returns {Number} 0-100 engagement score
   */
  generateEngagementScore(sessionMinutes, completed = true) {
    const metrics = this.computeMetrics();
    if (!metrics) return 0;

    // Session time score (target: 12-15 minutes per sim)
    const sessionTimeScore = Math.min((sessionMinutes / 15) * 100, 100);

    // Replay weight (replays indicate interest and engagement)
    const replayWeight = Math.min(metrics.replayTendency.totalReplays * 15, 50);

    // Completion flag (critical indicator)
    const completionBonus = completed ? 100 : 50;

    // Improvement delta (learning velocity)
    const improvementDelta = metrics.learningVelocity;

    // Depth of interaction
    const interactionDepth = metrics.explorationDepth;

    // Weighted calculation
    const engagementScore = (
      (0.3 * sessionTimeScore) +
      (0.25 * replayWeight) +
      (0.2 * completionBonus) +
      (0.15 * improvementDelta) +
      (0.1 * interactionDepth)
    );

    return Math.round(Math.min(engagementScore, 100));
  }

  /**
   * Generate behavioral observation (AI note for portfolio)
   * @returns {String} Behavioral insight
   */
  generateBehavioralObservation() {
    const metrics = this.computeMetrics();
    if (!metrics) return null;

    const observations = [];

    // Decision-making style
    if (metrics.decisionSpeedTrend === 'accelerating') {
      observations.push('Shows increasing confidence and familiarity with scenario patterns');
    } else if (metrics.decisionSpeedTrend === 'decelerating') {
      observations.push('Becomes more deliberate and thoughtful as complexity increases');
    }

    // Risk preference
    const dominantRisk = Object.entries(metrics.riskTakingPercentage).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    const riskDescriptions = {
      safe: 'favors cautious, data-driven approaches',
      moderate: 'balances risk and safety pragmatically',
      cautious: 'prefers thorough, deliberate decision-making'
    };
    observations.push(`${riskDescriptions[dominantRisk[0]]} (${Math.round(dominantRisk[1])}% of choices)`);

    // Consistency
    if (metrics.consistencyScore > 75) {
      observations.push('Demonstrates strong decision consistency and clear values');
    } else if (metrics.consistencyScore < 40) {
      observations.push('Shows adaptability; adjusts approach based on context');
    }

    // Learning
    if (metrics.learningVelocity > 70) {
      observations.push('Rapidly masters decision frameworks and improves efficiency');
    }

    // Exploration
    if (metrics.explorationDepth > 70) {
      observations.push('Naturally explores multiple scenarios and revisits difficult decisions');
    }

    // Replay behavior (strong signal)
    if (metrics.replayTendency.strongInterestSignal) {
      observations.push('High engagement indicated by exploring alternative scenarios');
    }

    return observations.join('. ') + '.';
  }

  /**
   * Export session data for backend storage
   */
  exportSessionData() {
    return {
      studentId: this.studentId,
      careerId: this.careerId,
      sessionStartTime: this.startTime,
      sessionDuration: Date.now() - this.startTime,
      events: this.events,
      metrics: this.computeMetrics(),
      sceneData: this.scenes,
      riskProfile: this.riskProfile,
      observation: this.generateBehavioralObservation()
    };
  }
}

export default BehavioralAnalytics;
