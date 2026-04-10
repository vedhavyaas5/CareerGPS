import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser } from '../utils/auth';
import { fingerprintAPI } from '../utils/api';
import FingerprintEngine, {
  DOMAINS,
  SATURDAY_CARDS,
  IMAGE_PAIRS,
} from '../utils/FingerprintEngine';

// ─── Domain display config ───
const DOMAIN_DISPLAY = {
  healthcare: { label: 'Healthcare', emoji: '🏥', color: 'bg-purple-100' },
  technology: { label: 'Technology', emoji: '💻', color: 'bg-purple-200' },
  law: { label: 'Law', emoji: '⚖️', color: 'bg-purple-300' },
  design: { label: 'Design', emoji: '🎨', color: 'bg-purple-400' },
  business: { label: 'Business', emoji: '💼', color: 'bg-purple-200' },
  science: { label: 'Science', emoji: '🔬', color: 'bg-purple-100' },
  environment: { label: 'Environment', emoji: '🌲', color: 'bg-purple-100' },
  social: { label: 'Social Impact', emoji: '🤝', color: 'bg-purple-300' },
};

// ─── Animation variants ───
const pageVariants = {
  enter: { opacity: 0, x: 80, scale: 0.95 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -80, scale: 0.95 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

// ═══════════════════════════════════════════════
// STEP 1: Pick Your Saturday
// ═══════════════════════════════════════════════
const StepSaturdayPick = ({ onSelect }) => {
  const stepStartTime = useRef(Date.now());

  const handleSelect = (cardId) => {
    const decisionTimeMs = Date.now() - stepStartTime.current;
    onSelect(cardId, decisionTimeMs);
  };

  return (
    <motion.div
      key="step-saturday"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <motion.p
        className="text-blue-600 text-sm font-semibold mb-3 tracking-widest uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Let's get to know you
      </motion.p>

      <motion.h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        It's Saturday. What are you doing?
      </motion.h1>

      <motion.p
        className="text-gray-500 text-center mb-12 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Pick the one that excites you most
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
        {SATURDAY_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 40px rgba(37, 99, 235, 0.18)',
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(card.id)}
            className="group relative bg-white border border-blue-200 rounded-2xl p-7 text-left hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-blue-50 group-hover:bg-blue-100 transition-all duration-300 rounded-2xl" />

            <div className="relative z-10">
              <span className="text-4xl mb-4 block">{card.emoji}</span>
              <h3 className="text-lg font-bold text-purple-900 mb-2">{card.label}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>

            {/* Accent bar */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STEP 2: Emoji Reaction Strip
// ═══════════════════════════════════════════════
const StepEmojiReactions = ({ onComplete }) => {
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [reactions, setReactions] = useState({});
  const domainStartTime = useRef(Date.now());

  const currentDomain = DOMAINS[currentDomainIdx];
  const display = DOMAIN_DISPLAY[currentDomain];

  const handleReaction = (reaction) => {
    const decisionTimeMs = Date.now() - domainStartTime.current;

    const updatedReactions = {
      ...reactions,
      [currentDomain]: { reaction, decisionTimeMs },
    };
    setReactions(updatedReactions);

    if (currentDomainIdx < DOMAINS.length - 1) {
      setCurrentDomainIdx(currentDomainIdx + 1);
      domainStartTime.current = Date.now();
    } else {
      onComplete(updatedReactions);
    }
  };

  return (
    <motion.div
      key="step-emoji"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <motion.p
        className="text-blue-600 text-sm font-semibold mb-3 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Quick reactions
      </motion.p>

      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-blue-900 text-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        How do you feel about...
      </motion.h1>

      <p className="text-gray-500 text-sm mb-10">
        {currentDomainIdx + 1} of {DOMAINS.length} — go with your gut!
      </p>

      {/* Domain card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDomain}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white border border-purple-200 rounded-3xl p-10 text-center w-full max-w-md mb-10 shadow-md"
          >
          <span className="text-6xl block mb-4">{display.emoji}</span>
          <h2 className="text-2xl font-bold text-purple-900 mb-1">{display.label}</h2>
          <p className="text-gray-500 text-sm">Career domain</p>
        </motion.div>
      </AnimatePresence>

      {/* Reaction buttons */}
      <div className="flex gap-6">
        {[
          { key: 'fire', emoji: '🔥', label: 'Interested', bg: 'hover:bg-purple-100 hover:border-purple-500' },
          { key: 'neutral', emoji: '😐', label: 'Neutral', bg: 'hover:bg-gray-100 hover:border-gray-400' },
          { key: 'dislike', emoji: '👎', label: 'Not for me', bg: 'hover:bg-purple-200 hover:border-purple-600' },
        ].map((btn) => (
          <motion.button
            key={btn.key}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReaction(btn.key)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border border-purple-200 bg-white transition-all duration-300 shadow-sm ${btn.bg}`}
          >
            <span className="text-3xl">{btn.emoji}</span>
            <span className="text-xs text-purple-700 font-medium">{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Dot indicator */}
      <div className="flex gap-2 mt-10">
        {DOMAINS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < currentDomainIdx
                ? 'bg-purple-600'
                : i === currentDomainIdx
                ? 'bg-purple-600 w-6'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STEP 3: Image Instinct Pick
// ═══════════════════════════════════════════════
const StepImageInstinct = ({ onComplete }) => {
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const pairStartTime = useRef(Date.now());

  const currentPair = IMAGE_PAIRS[currentPairIdx];

  const handlePick = (option) => {
    const decisionTimeMs = Date.now() - pairStartTime.current;

    const updatedPicks = [
      ...picks,
      { pairId: currentPair.id, chosenOption: option, decisionTimeMs },
    ];
    setPicks(updatedPicks);

    if (currentPairIdx < IMAGE_PAIRS.length - 1) {
      setCurrentPairIdx(currentPairIdx + 1);
      pairStartTime.current = Date.now();
    } else {
      onComplete(updatedPicks);
    }
  };

  return (
    <motion.div
      key="step-instinct"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <motion.p
        className="text-purple-600 text-sm font-semibold mb-3 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Trust your instinct
      </motion.p>

      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-purple-900 text-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Which pulls you more?
      </motion.h1>

      <p className="text-gray-500 text-sm mb-12">
        {currentPairIdx + 1} of {IMAGE_PAIRS.length} — pick quickly!
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPair.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl"
        >
          {/* Option A */}
          <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(124, 58, 237, 0.18)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePick('A')}
                className="flex-1 bg-white border border-purple-200 rounded-2xl p-8 text-center hover:border-purple-500 transition-all duration-300 group cursor-pointer shadow-md"
              >
                <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {currentPair.optionA.emoji}
                </span>
                <h3 className="text-xl font-bold text-purple-900">{currentPair.optionA.label}</h3>
              </motion.button>

          {/* VS divider */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">VS</span>
            </div>
          </div>

          {/* Option B */}
          <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(124, 58, 237, 0.18)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePick('B')}
                className="flex-1 bg-white border border-purple-200 rounded-2xl p-8 text-center hover:border-purple-500 transition-all duration-300 group cursor-pointer shadow-md"
              >
                <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {currentPair.optionB.emoji}
                </span>
                <h3 className="text-xl font-bold text-purple-900">{currentPair.optionB.label}</h3>
              </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicator */}
      <div className="flex gap-2 mt-10">
        {IMAGE_PAIRS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < currentPairIdx
                ? 'bg-purple-600'
                : i === currentPairIdx
                ? 'bg-purple-600 w-6'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STEP 4: Grade Selection
// ═══════════════════════════════════════════════
const StepGradeSelect = ({ onSelect, loading }) => {
  return (
    <motion.div
      key="step-grade"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <motion.p
        className="text-blue-600 text-sm font-semibold mb-3 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Almost done
      </motion.p>

      <motion.h1
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        What grade are you in?
      </motion.h1>

      <motion.p
        className="text-gray-500 text-center mb-12 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        This helps us set the right difficulty for you
      </motion.p>

      <div className="flex gap-6">
        {[8, 9, 10].map((grade, i) => (
          <motion.button
            key={grade}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.08,
              boxShadow: '0 0 50px rgba(37, 99, 235, 0.18)',
            }}
            whileTap={{ scale: 0.92 }}
            disabled={loading}
            onClick={() => onSelect(grade)}
            className="w-28 h-28 sm:w-32 sm:h-32 bg-white border border-blue-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span className="text-3xl sm:text-4xl font-bold text-blue-900 group-hover:text-purple-600 transition-colors">
              {grade}
            </span>
            <span className="text-xs text-gray-500 mt-1">Grade</span>
          </motion.button>
        ))}
      </div>

      {loading && (
        <motion.div
          className="mt-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Building your career fingerprint...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STEP 5: Fingerprint Reveal (bonus visual)
// ═══════════════════════════════════════════════
const StepFingerprintReveal = ({ fingerprint, onContinue }) => {
  const sortedDomains = useMemo(() => {
    if (!fingerprint?.domainWeights) return [];
    return Object.entries(fingerprint.domainWeights)
      .sort((a, b) => b[1] - a[1])
      .filter(([, weight]) => weight > 0);
  }, [fingerprint]);

  return (
    <motion.div
      key="step-reveal"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          🧬
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
          Your Interest <span className="text-purple-600">Fingerprint</span>
        </h1>
        <p className="text-gray-500">Here's what we discovered about you</p>
      </motion.div>

      {/* Fingerprint bars */}
      <div className="w-full max-w-lg space-y-4 mb-10">
        {sortedDomains.map(([domain, weight], i) => {
          const display = DOMAIN_DISPLAY[domain];
          const isActive = i < 3;

          return (
            <motion.div
              key={domain}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`flex items-center gap-4 ${!isActive ? 'opacity-40' : ''}`}
            >
              <span className="text-2xl w-8">{display.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-blue-900">{display.label}</span>
                  <span className="text-sm text-purple-600 font-bold">{weight}%</span>
                </div>
                <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${display.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${weight}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {isActive && (
                <motion.span
                  className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full border border-purple-300"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  Active
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37, 99, 235, 0.18)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-xl transition-all shadow-md hover:from-purple-700 hover:to-purple-800 hover:shadow-lg"
      >
        🚀 Start Exploring Careers
      </motion.button>

      <motion.p
        className="text-gray-400 text-xs mt-4 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Your fingerprint evolves as you explore. What you DO matters more than what you SAY.
      </motion.p>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// MAIN ONBOARDING PAGE
// ═══════════════════════════════════════════════
const OnboardingPage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);
  const engineRef = useRef(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new FingerprintEngine();
    engineRef.current.startQuiz();
    engineRef.current.startStep('saturdayPick');
  }, []);

  // ─── Step 1 handler ───
  const handleSaturdayPick = (cardId, decisionTimeMs) => {
    engineRef.current.endStep('saturdayPick');
    engineRef.current.processSaturdayPick(cardId, decisionTimeMs);
    engineRef.current.startStep('emojiReactions');
    setStep(2);
  };

  // ─── Step 2 handler ───
  const handleEmojiComplete = (reactions) => {
    engineRef.current.endStep('emojiReactions');

    Object.entries(reactions).forEach(([domain, data]) => {
      engineRef.current.processEmojiReaction(domain, data.reaction, data.decisionTimeMs);
    });

    engineRef.current.startStep('imageInstinct');
    setStep(3);
  };

  // ─── Step 3 handler ───
  const handleImageComplete = (picks) => {
    engineRef.current.endStep('imageInstinct');

    picks.forEach((pick) => {
      engineRef.current.processImageInstinct(
        pick.pairId,
        pick.chosenOption,
        pick.decisionTimeMs
      );
    });

    engineRef.current.startStep('gradeSelection');
    setStep(4);
  };

  // ─── Step 4 handler ───
  const handleGradeSelect = async (grade) => {
    engineRef.current.endStep('gradeSelection');
    setLoading(true);

    try {
      // Compute fingerprint
      const result = engineRef.current.computeFingerprint();

      const payload = {
        studentId: user?.id || user?._id || 'demo-user-123',
        domainWeights: result.domainWeights,
        grade,
        quizResponses: result.quizResponses,
        hiddenMetrics: result.hiddenMetrics,
        activeDomains: result.activeDomains,
        dormantDomains: result.dormantDomains,
      };

      // Save to backend
      await fingerprintAPI.create(payload);

      // Store locally for immediate use
      localStorage.setItem('fingerprint', JSON.stringify(payload));
      localStorage.setItem('onboardingComplete', 'true');

      setFingerprint(result);
      setStep(5);
    } catch (error) {
      console.error('Failed to save fingerprint:', error);
      // Still show the result even if backend fails
      const result = engineRef.current.computeFingerprint();
      setFingerprint(result);
      localStorage.setItem('onboardingComplete', 'true');
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  // ─── Continue to dashboard ───
  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-blue-900 overflow-hidden relative">
      {/* Soft blue/purple background glow effects */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Top bar with logo */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              CG
            </div>
            <span className="text-blue-900 font-bold hidden sm:inline">CareerGPS</span>
          </div>

          {/* Step indicator (subtle, no percentages) */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s < step
                    ? 'w-8 bg-blue-600'
                    : s === step
                    ? 'w-8 bg-purple-500'
                    : 'w-4 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && <StepSaturdayPick onSelect={handleSaturdayPick} />}
          {step === 2 && <StepEmojiReactions onComplete={handleEmojiComplete} />}
          {step === 3 && <StepImageInstinct onComplete={handleImageComplete} />}
          {step === 4 && <StepGradeSelect onSelect={handleGradeSelect} loading={loading} />}
          {step === 5 && (
            <StepFingerprintReveal fingerprint={fingerprint} onContinue={handleContinue} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
