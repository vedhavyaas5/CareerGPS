/**
 * FINGERPRINT ENGINE
 *
 * Computes the Interest Fingerprint v1.0 from onboarding quiz data.
 * Silently tracks hidden metrics: timing, hesitation, contradictions.
 *
 * 8 Domains: healthcare, technology, law, design, business, science, environment, social
 *
 * Quiz Layers:
 *   Step 1 — Saturday Pick: +25 to primary domains per card
 *   Step 2 — Emoji Reactions: 🔥 +15, 😐 +5, 👎 −10 per domain
 *   Step 3 — Image Instinct: paired choices with time-weighted scoring
 *   Step 4 — Grade Selection: context filter only (no domain impact)
 */

const DOMAINS = [
  'healthcare',
  'technology',
  'law',
  'design',
  'business',
  'science',
  'environment',
  'social',
];

// ─── STEP 1: Saturday Pick Card Mappings ───
const SATURDAY_CARDS = [
  {
    id: 'medical_camp',
    label: 'Helping at a medical camp',
    emoji: '🏥',
    description: 'Volunteering to help patients and doctors at a health camp',
    weights: { healthcare: 25, social: 10, science: 5 },
  },
  {
    id: 'robot_building',
    label: 'Building a robot with a friend',
    emoji: '🤖',
    description: 'Designing circuits, coding logic, making things move',
    weights: { technology: 25, science: 10, design: 5 },
  },
  {
    id: 'youtube_thumbnail',
    label: 'Designing a YouTube thumbnail',
    emoji: '🎨',
    description: 'Creating eye-catching visual content for a channel',
    weights: { design: 25, technology: 10, business: 5 },
  },
  {
    id: 'school_fundraiser',
    label: 'Planning a school fundraiser',
    emoji: '💼',
    description: 'Organizing teams, managing budgets, leading the event',
    weights: { business: 25, social: 10, law: 5 },
  },
];

// ─── STEP 2: Emoji Reaction Scoring ───
const EMOJI_SCORES = {
  fire: 15,    // 🔥 Interested
  neutral: 5,  // 😐 Neutral
  dislike: -10, // 👎 Not for me
};

// ─── STEP 3: Image Instinct Pairs ───
const IMAGE_PAIRS = [
  {
    id: 'lab_vs_courtroom',
    optionA: { label: 'Science Lab', emoji: '🔬', domains: { science: 15, healthcare: 8 } },
    optionB: { label: 'Courtroom', emoji: '⚖️', domains: { law: 15, social: 8 } },
  },
  {
    id: 'laptop_vs_canvas',
    optionA: { label: 'Coding on Laptop', emoji: '💻', domains: { technology: 15, science: 5 } },
    optionB: { label: 'Art Canvas', emoji: '🖼️', domains: { design: 15, social: 5 } },
  },
  {
    id: 'microscope_vs_marketing',
    optionA: { label: 'Microscope Research', emoji: '🔬', domains: { science: 12, healthcare: 10 } },
    optionB: { label: 'Marketing Board', emoji: '📊', domains: { business: 15, design: 8 } },
  },
  {
    id: 'forest_vs_hospital',
    optionA: { label: 'Forest Conservation', emoji: '🌲', domains: { environment: 18, science: 5 } },
    optionB: { label: 'Hospital Ward', emoji: '🏥', domains: { healthcare: 18, social: 5 } },
  },
];

// ─── CONFIDENCE THRESHOLDS (ms) ───
const FAST_DECISION_MS = 2000;   // Under 2s = very confident
const SLOW_DECISION_MS = 6000;   // Over 6s = hesitant

/**
 * Calculate confidence multiplier based on decision time.
 * Fast = stronger weight, slow = weaker weight.
 */
function getConfidenceMultiplier(decisionTimeMs) {
  if (decisionTimeMs <= FAST_DECISION_MS) return 1.3;
  if (decisionTimeMs <= 3500) return 1.1;
  if (decisionTimeMs <= SLOW_DECISION_MS) return 1.0;
  if (decisionTimeMs <= 10000) return 0.8;
  return 0.6; // Very slow = low confidence
}

class FingerprintEngine {
  constructor() {
    this.rawWeights = {};
    DOMAINS.forEach((d) => (this.rawWeights[d] = 0));

    this.quizResponses = {
      saturdayPick: null,
      emojiReactions: {},
      imageInstinct: [],
    };

    this.hiddenMetrics = {
      totalQuizStartTime: null,
      stepTimings: {},
      hesitationPatterns: [],
      contradictions: [],
    };
  }

  // ─── TIMING ───

  startQuiz() {
    this.hiddenMetrics.totalQuizStartTime = Date.now();
  }

  startStep(stepName) {
    this.hiddenMetrics.stepTimings[stepName] = {
      startTime: Date.now(),
      endTime: null,
      durationMs: null,
    };
  }

  endStep(stepName) {
    const step = this.hiddenMetrics.stepTimings[stepName];
    if (step) {
      step.endTime = Date.now();
      step.durationMs = step.endTime - step.startTime;
    }
  }

  // ─── STEP 1: SATURDAY PICK ───

  processSaturdayPick(cardId, decisionTimeMs) {
    const card = SATURDAY_CARDS.find((c) => c.id === cardId);
    if (!card) return;

    const confidence = getConfidenceMultiplier(decisionTimeMs);

    Object.entries(card.weights).forEach(([domain, weight]) => {
      this.rawWeights[domain] += weight * confidence;
    });

    this.quizResponses.saturdayPick = {
      cardId,
      decisionTimeMs,
      confidence,
      timestamp: Date.now(),
    };

    this.hiddenMetrics.hesitationPatterns.push({
      step: 'saturdayPick',
      timeMs: decisionTimeMs,
      confident: decisionTimeMs <= FAST_DECISION_MS,
    });
  }

  // ─── STEP 2: EMOJI REACTIONS ───

  processEmojiReaction(domain, reaction, decisionTimeMs) {
    if (!DOMAINS.includes(domain)) return;

    const score = EMOJI_SCORES[reaction] || 0;
    const confidence = getConfidenceMultiplier(decisionTimeMs);

    this.rawWeights[domain] += score * confidence;

    this.quizResponses.emojiReactions[domain] = {
      reaction,
      score,
      decisionTimeMs,
      confidence,
      timestamp: Date.now(),
    };

    this.hiddenMetrics.hesitationPatterns.push({
      step: `emoji_${domain}`,
      timeMs: decisionTimeMs,
      confident: decisionTimeMs <= FAST_DECISION_MS,
    });
  }

  // ─── STEP 3: IMAGE INSTINCT ───

  processImageInstinct(pairId, chosenOption, decisionTimeMs) {
    const pair = IMAGE_PAIRS.find((p) => p.id === pairId);
    if (!pair) return;

    const chosen = chosenOption === 'A' ? pair.optionA : pair.optionB;
    const confidence = getConfidenceMultiplier(decisionTimeMs);

    Object.entries(chosen.domains).forEach(([domain, weight]) => {
      this.rawWeights[domain] += weight * confidence;
    });

    this.quizResponses.imageInstinct.push({
      pairId,
      chosenOption,
      chosenLabel: chosen.label,
      decisionTimeMs,
      confidence,
      timestamp: Date.now(),
    });

    this.hiddenMetrics.hesitationPatterns.push({
      step: `image_${pairId}`,
      timeMs: decisionTimeMs,
      confident: decisionTimeMs <= FAST_DECISION_MS,
    });
  }

  // ─── FINGERPRINT COMPUTATION ───

  computeFingerprint() {
    // Normalize: ensure no negatives, then convert to percentages
    const adjustedWeights = {};
    let totalWeight = 0;

    DOMAINS.forEach((domain) => {
      adjustedWeights[domain] = Math.max(0, this.rawWeights[domain]);
      totalWeight += adjustedWeights[domain];
    });

    const domainWeights = {};
    if (totalWeight > 0) {
      DOMAINS.forEach((domain) => {
        domainWeights[domain] = Math.round((adjustedWeights[domain] / totalWeight) * 100);
      });
    } else {
      // Fallback: equal distribution
      DOMAINS.forEach((domain) => {
        domainWeights[domain] = Math.round(100 / DOMAINS.length);
      });
    }

    // Ensure percentages sum to 100
    const sum = Object.values(domainWeights).reduce((a, b) => a + b, 0);
    if (sum !== 100 && totalWeight > 0) {
      const maxDomain = Object.entries(domainWeights).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      domainWeights[maxDomain] += 100 - sum;
    }

    // Determine active (top 3) and dormant domains
    const sorted = Object.entries(domainWeights).sort((a, b) => b[1] - a[1]);
    const activeDomains = sorted.slice(0, 3).map(([d]) => d);
    const dormantDomains = sorted.slice(3).map(([d]) => d);

    // Detect contradictions
    const contradictions = this.detectContradictions();

    // Total quiz time
    const totalQuizTimeMs = this.hiddenMetrics.totalQuizStartTime
      ? Date.now() - this.hiddenMetrics.totalQuizStartTime
      : 0;

    return {
      domainWeights,
      activeDomains,
      dormantDomains,
      quizResponses: this.quizResponses,
      hiddenMetrics: {
        totalQuizTimeMs,
        stepTimings: this.hiddenMetrics.stepTimings,
        hesitationPatterns: this.hiddenMetrics.hesitationPatterns,
        contradictions,
      },
    };
  }

  // ─── CONTRADICTION DETECTION ───

  detectContradictions() {
    const contradictions = [];
    const emojiReactions = this.quizResponses.emojiReactions;

    // Check if Saturday pick domain was disliked in emoji step
    if (this.quizResponses.saturdayPick) {
      const card = SATURDAY_CARDS.find(
        (c) => c.id === this.quizResponses.saturdayPick.cardId
      );
      if (card) {
        const primaryDomain = Object.entries(card.weights).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];

        if (emojiReactions[primaryDomain]?.reaction === 'dislike') {
          contradictions.push({
            domain: primaryDomain,
            quizSignal: 'contradiction',
            detail: `Selected ${card.label} in Saturday pick but disliked ${primaryDomain} in emoji reaction`,
          });
        }
      }
    }

    // Check if image instinct choices contradict emoji dislikes
    this.quizResponses.imageInstinct.forEach((pick) => {
      const pair = IMAGE_PAIRS.find((p) => p.id === pick.pairId);
      if (!pair) return;

      const chosen = pick.chosenOption === 'A' ? pair.optionA : pair.optionB;
      const primaryDomain = Object.entries(chosen.domains).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      if (emojiReactions[primaryDomain]?.reaction === 'dislike') {
        contradictions.push({
          domain: primaryDomain,
          quizSignal: 'contradiction',
          detail: `Chose ${chosen.label} in image instinct but disliked ${primaryDomain} in emoji reaction`,
        });
      }
    });

    return contradictions;
  }
}

// Export class + constants for the OnboardingPage
export default FingerprintEngine;
export { DOMAINS, SATURDAY_CARDS, IMAGE_PAIRS, EMOJI_SCORES };
