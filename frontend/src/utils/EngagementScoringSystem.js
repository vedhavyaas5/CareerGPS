/**
 * ENGAGEMENT SCORING & FINGERPRINT UPDATE SYSTEM
 * 
 * Calculates engagement scores using weighted formula and updates
 * student career fingerprint based on behavioral signals.
 * 
 * Domain Weight Update Rules:
 * - Completed + Replayed ≥2: +20%
 * - Completed once: +10%
 * - Completed slowly: +3%
 * - Quit before halfway: -15%
 * - Explored harder version: +15%
 * 
 * Fingerprint tracks:
 * - Career affinity scores
 * - Cognitive strengths (analytical, creative, risk-taking, etc.)
 * - Learning patterns
 * - Career readiness indicators
 */

class EngagementScoringSystem {
  /**
   * Calculate comprehensive engagement score
   * 
   * @param {Object} sessionData - All session behavioral data
   * @returns {Object} Detailed scoring breakdown
   */
  static calculateEngagementScore(sessionData) {
    const {
      decisions = [],
      replayCount = 0,
      sessionDurationSeconds = 0,
      completedSimulation = false,
      currentSceneIndex = 0,
      totalScenes = 7,
      sceneTimings = {},
      riskProfile = { safe: 0, moderate: 0, cautious: 0 }
    } = sessionData;

    // COMPONENT 1: Session Time Score (target: 10-15 minutes)
    const sessionMinutes = sessionDurationSeconds / 60;
    const targetSessionMinutes = 12;
    const sessionTimeScore = Math.min((sessionMinutes / targetSessionMinutes) * 100, 100);

    // COMPONENT 2: Replay Weight (strong interest signal)
    // Each replay adds 15 points, capped at 50
    const replayWeight = Math.min(replayCount * 15, 50);

    // COMPONENT 3: Completion Flag
    // Full completion: 100, per-scene completion: proportional
    const completionRatio = currentSceneIndex / totalScenes;
    const completionFlag = completedSimulation ? 100 : Math.min(completionRatio * 100, 80);

    // COMPONENT 4: Improvement Delta
    // Measure speed improvement and decision quality improvement
    const improvementDelta = this.calculateImprovementDelta(sceneTimings, decisions);

    // COMPONENT 5: Depth of Interaction
    // Based on decision variety and scene revisits
    const depthOfInteraction = this.calculateDepthOfInteraction(decisions, replayCount);

    // WEIGHTED FORMULA
    const engagementScore = (
      (0.3 * sessionTimeScore) +
      (0.25 * replayWeight) +
      (0.2 * completionFlag) +
      (0.15 * improvementDelta) +
      (0.1 * depthOfInteraction)
    );

    return {
      engagementScore: Math.round(engagementScore),
      components: {
        sessionTimeScore: Math.round(sessionTimeScore),
        replayWeight: Math.round(replayWeight),
        completionFlag: Math.round(completionFlag),
        improvementDelta: Math.round(improvementDelta),
        depthOfInteraction: Math.round(depthOfInteraction)
      },
      metrics: {
        sessionMinutes,
        replayCount,
        totalDecisions: decisions.length,
        completedSimulation,
        completionRatio: Math.round(completionRatio * 100)
      },
      riskProfile,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate improvement delta score
   * Measure 1: Decision speed improvement (faster later = learning)
   * Measure 2: Decision consistency improvement
   * 
   * @param {Object} sceneTimings - Timings per scene
   * @param {Array} decisions - All decisions made
   * @returns {Number} 0-100
   */
  static calculateImprovementDelta(sceneTimings, decisions) {
    if (decisions.length < 2) return 50;

    const timingValues = Object.values(sceneTimings);
    if (timingValues.length < 2) return 50;

    // Speed improvement: compare first scenes to last scenes
    const quarter1 = timingValues.slice(0, Math.ceil(timingValues.length / 4));
    const quarter4 = timingValues.slice(-Math.ceil(timingValues.length / 4));

    const q1Avg = quarter1.reduce((a, b) => a + b) / quarter1.length;
    const q4Avg = quarter4.reduce((a, b) => a + b) / quarter4.length;

    // Improvement = how much faster (as percentage)
    const speedImprovement = Math.max(0, ((q1Avg - q4Avg) / q1Avg) * 100);

    // Cap at 100 for scoring
    return Math.min(speedImprovement, 100);
  }

  /**
   * Calculate depth of interaction
   * Factors: variety in choices, scene replays, decision diversity
   * 
   * @param {Array} decisions - All decisions
   * @param {Number} replayCount - Number of replays
   * @returns {Number} 0-100
   */
  static calculateDepthOfInteraction(decisions, replayCount) {
    if (decisions.length === 0) return 0;

    // Decision variety (how many different options were chosen)
    const uniqueOptions = new Set(decisions.map(d => d.optionChosen)).size;
    const optionVariety = Math.min((uniqueOptions / decisions.length) * 100, 100);

    // Replay engagement (shows genuine interest)
    const replayEngagement = Math.min((replayCount / decisions.length) * 100, 50);

    // Risk variety (exploring different risk levels)
    const riskLevels = new Set(decisions.map(d => d.riskLevel)).size;
    const riskVariety = (riskLevels / 3) * 50; // 3 risk levels possible

    return Math.round((optionVariety + replayEngagement + riskVariety) / 3);
  }

  /**
   * Calculate domain weight delta for fingerprint update
   * 
   * Rules:
   * - Completed + Replayed ≥2: +20%
   * - Completed once: +10%
   * - Completed slowly: +3%
   * - Quit before halfway: -15%
   * - Explored harder version: +15%
   * 
   * @param {Object} scoringData - Result from calculateEngagementScore
   * @param {String} completionStatus - 'completed' | 'quit' | 'abandoned'
   * @returns {Number} Weight delta (-25 to +20)
   */
  static calculateDomainWeightDelta(scoringData, completionStatus) {
    let weightDelta = 0;
    const { engagementScore, metrics, components } = scoringData;

    // Primary classification
    if (completionStatus === 'completed') {
      // Strong interest: completed + multiple replays
      if (metrics.replayCount >= 2) {
        weightDelta = 20;
      } else {
        // Standard completion
        weightDelta = 10;
      }

      // Bonus for particularly high engagement
      if (engagementScore >= 80) {
        weightDelta += 5;
      }

      // Slight penalty for slow completion without replay
      if (metrics.sessionMinutes > 20 && metrics.replayCount === 0) {
        weightDelta -= 2;
      }
    } else if (completionStatus === 'quit') {
      // How far did they get?
      const completionRatio = metrics.completionRatio / 100;

      if (completionRatio < 0.5) {
        // Quit early: strong negative signal
        weightDelta = -15;
      } else if (completionRatio < 0.8) {
        // Quit later: moderate negative
        weightDelta = -5;
      } else {
        // Quit near end: minor negative
        weightDelta = -2;
      }
    } else if (completionStatus === 'abandoned') {
      // User expressed "Not For Me"
      weightDelta = -25;
    }

    // Consistency bonus: improve if score is high
    if (engagementScore >= 85) {
      weightDelta = Math.min(weightDelta + 3, 25); // Cap at 25
    }

    return weightDelta;
  }

  /**
   * Cognitive profile calculation based on decision patterns
   * 
   * Strengths measured:
   * - Analytical: Data-driven, safe choices
   * - Creative: Exploratory, varied choices
   * - Risk-Taking: Cautious choices despite pressure
   * - Structured: Consistent patterns
   * - Exploratory: High replay rate
   * - Persistence: Completion despite difficulty
   * 
   * @param {Array} decisions - All decisions made
   * @param {Object} metrics - Behavioral metrics
   * @returns {Object} Cognitive profile
   */
  static calculateCognitiveProfile(decisions, metrics) {
    const profile = {
      analytical: 0,
      creative: 0,
      riskTaking: 0,
      structured: 0,
      exploratory: 0,
      persistence: 0
    };

    if (decisions.length === 0) return profile;

    // Analytical: safe choices + data-first decisions
    const safeChoices = decisions.filter(d => d.riskLevel === 'safe').length;
    profile.analytical = Math.round((safeChoices / decisions.length) * 100);

    // Creative: varied choices + exploration
    const uniqueChoices = new Set(decisions.map(d => d.optionChosen)).size;
    const variety = (uniqueChoices / decisions.length) * 100;
    profile.creative = Math.round(variety * 0.5 + (metrics.explorationDepth || 0) * 0.5);

    // Risk-Taking: cautious choices (thoughtful risk)
    const cautiousChoices = decisions.filter(d => d.riskLevel === 'cautious').length;
    profile.riskTaking = Math.round((cautiousChoices / decisions.length) * 100);

    // Structured: consistency score
    profile.structured = metrics.consistencyScore || 50;

    // Exploratory: replay behavior
    profile.exploratory = Math.round((metrics.replayTendency?.totalReplays || 0) / decisions.length * 100);

    // Persistence: completion despite challenges
    profile.persistence = Math.round(metrics.learningVelocity || 50);

    return profile;
  }

  /**
   * Generate fingerprint update payload for backend
   * 
   * @param {String} studentId - Student identifier
   * @param {String} careerId - Career identifier
   * @param {Object} scoringData - Engagement scoring result
   * @param {String} completionStatus - Completion status
   * @param {Object} metrics - Behavioral metrics
   * @returns {Object} Fingerprint update data
   */
  static generateFingerprintUpdate(
    studentId,
    careerId,
    scoringData,
    completionStatus,
    metrics
  ) {
    const weightDelta = this.calculateDomainWeightDelta(scoringData, completionStatus);
    const cognitiveProfile = this.calculateCognitiveProfile(
      scoringData.metrics.decisions || [],
      metrics
    );

    return {
      studentId,
      careerId,
      engagementScore: scoringData.engagementScore,
      weightDelta,
      completionStatus,
      cognitiveProfile,
      behaviorSignals: {
        decisionsMade: scoringData.metrics.totalDecisions,
        replayCount: scoringData.metrics.replayCount,
        averageDecisionTime: scoringData.metrics.sessionMinutes / Math.max(1, scoringData.metrics.totalDecisions),
        riskProfile: scoringData.riskProfile,
        sessionDurationMinutes: scoringData.metrics.sessionMinutes,
        completionRatio: scoringData.metrics.completionRatio
      },
      timestamp: new Date().toISOString(),
      fingerprintVersion: '1.1' // Version tracking for iterations
    };
  }

  /**
   * Calculate career affinity score for recommendation algorithm
   * 
   * Factors:
   * - Engagement score (highest weight)
   * - Completion status
   * - Risk profile match
   * - Time investment
   * - Replay behavior
   * 
   * @param {Object} scoringData - Engagement scoring result
   * @param {Object} careerProfile - Career characteristics
   * @returns {Number} 0-100 affinity score
   */
  static calculateCareerAffinity(scoringData, careerProfile = {}) {
    const {
      engagementScore,
      metrics,
      riskProfile,
      components
    } = scoringData;

    // Base: engagement score (0.4 weight)
    let affinityScore = engagementScore * 0.4;

    // Completion bonus (0.3 weight)
    const completionBonus = metrics.completedSimulation ? 30 : (metrics.completionRatio * 0.3);
    affinityScore += completionBonus;

    // Engagement signals (0.2 weight)
    const engagementSignal = (
      (components.replayWeight > 0 ? 10 : 0) + // Replay = strong interest
      (metrics.totalDecisions >= 6 ? 10 : (metrics.totalDecisions / 6) * 10) // Decision variety
    );
    affinityScore += Math.min(engagementSignal, 20);

    // Time investment (0.1 weight)
    const timeBonus = Math.min((metrics.sessionMinutes / 15) * 10, 10);
    affinityScore += timeBonus;

    return Math.min(Math.round(affinityScore), 100);
  }

  /**
   * Predict next career recommendations based on fingerprint
   * 
   * Algorithm:
   * 1. Identify strong interest signals (engagement > 75)
   * 2. Match cognitive profile to similar careers
   * 3. Suggest related paths for exploration
   * 4. Recommend revisits if engagement is high but exploration incomplete
   * 
   * @param {Object} studentFingerprint - Student's career fingerprint
   * @param {Array} availableCareers - Career options
   * @returns {Array} Ranked career recommendations
   */
  static predictNextRecommendations(studentFingerprint, availableCareers = []) {
    if (!studentFingerprint || !availableCareers.length) return [];

    // Score each career based on cognitive profile match
    const recommendations = availableCareers.map(career => {
      let score = 0;

      // Cognitive strength matching
      const strengthMatch = {
        analytical: career.requires?.analytical || 0,
        creative: career.requires?.creative || 0,
        riskTaking: career.requires?.riskTaking || 0,
        structured: career.requires?.structured || 0,
        exploratory: career.requires?.exploratory || 0,
        persistence: career.requires?.persistence || 0
      };

      // Calculate profile match
      Object.keys(strengthMatch).forEach(strength => {
        const studentScore = studentFingerprint[strength] || 0;
        const careerRequirement = strengthMatch[strength];
        const match = 1 - Math.abs(studentScore - careerRequirement) / 100;
        score += match * 16.67; // Normalize to 100
      });

      return {
        careerId: career.id,
        careerTitle: career.title,
        matchScore: Math.round(score),
        reason: score > 60 ? 'Strong match' : score > 40 ? 'Moderate match' : 'Explore further'
      };
    });

    // Sort by score descending
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export default EngagementScoringSystem;
