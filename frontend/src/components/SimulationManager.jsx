import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Clock, Target } from 'lucide-react';
import SimulationEngine from './SimulationEngine';
import EngagementScoringSystem from '../utils/EngagementScoringSystem';
import BehavioralAnalytics from '../utils/BehavioralAnalytics';
import axios from 'axios';

/**
 * SIMULATION MANAGER & DASHBOARD
 * 
 * Orchestrates:
 * - Career simulation enrollment
 * - Multiple parallel simulations
 * - Result aggregation
 * - Fingerprint updates
 * - Recommendation generation
 * - Portfolio logging
 */

const SimulationManager = ({ studentId, onSimulationsComplete }) => {
  // ===== STATE =====
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [completedSimulations, setCompletedSimulations] = useState([]);
  const [studentFingerprint, setStudentFingerprint] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Career catalog with cognitive requirements
  const careerCatalog = [
    {
      id: 'doctor',
      title: 'ER Doctor',
      category: 'Health',
      description: 'High-pressure diagnostic and treatment decisions',
      requires: {
        analytical: 85,
        riskTaking: 60,
        persistence: 90,
        structured: 75,
        creative: 40,
        exploratory: 45
      }
    },
    {
      id: 'engineer',
      title: 'Software Engineer',
      category: 'Technology',
      description: 'System design, collaboration, and problem-solving',
      requires: {
        analytical: 90,
        creative: 70,
        structured: 80,
        riskTaking: 50,
        exploratory: 75,
        persistence: 85
      }
    },
    {
      id: 'designer',
      title: 'UX Designer',
      category: 'Design',
      description: 'User research, aesthetics, and user-centered thinking',
      requires: {
        creative: 90,
        exploratory: 85,
        analytical: 70,
        structured: 65,
        riskTaking: 55,
        persistence: 75
      }
    },
    {
      id: 'lawyer',
      title: 'Trial Lawyer',
      category: 'Law',
      description: 'Argumentation, precedent research, persuasion',
      requires: {
        analytical: 85,
        structured: 80,
        riskTaking: 70,
        persistence: 90,
        creative: 65,
        exploratory: 50
      }
    },
    {
      id: 'entrepreneur',
      title: 'Startup Founder',
      category: 'Business',
      description: 'Vision, risk tolerance, adaptability',
      requires: {
        creative: 85,
        riskTaking: 90,
        persistence: 95,
        exploratory: 80,
        analytical: 75,
        structured: 60
      }
    }
  ];

  // ===== HANDLERS =====

  /**
   * Handle simulation completion
   * 1. Calculate engagement score
   * 2. Update behavioral analytics
   * 3. Update student fingerprint
   * 4. Generate recommendations
   * 5. Log to portfolio
   */
  const handleSimulationComplete = useCallback(async (completionData) => {
    console.log('📊 Simulation Complete Data:', completionData);

    const {
      careerId,
      careerTitle,
      engagementScore,
      decisionsMade,
      replayCount,
      totalTime,
      behavioralSignals
    } = completionData;

    // Create scoring data structure
    const scoringData = {
      decisions: behavioralSignals.decisions || [],
      replayCount,
      sessionDurationSeconds: totalTime,
      completedSimulation: true,
      currentSceneIndex: 7, // Last scene (assuming 7 total)
      totalScenes: 7,
      riskProfile: {
        safe: 0,
        moderate: 0,
        cautious: 0
      }
    };

    // Calculate domain weight update
    const weightDelta = EngagementScoringSystem.calculateDomainWeightDelta(
      { engagementScore, metrics: { replayCount, completionRatio: 100 } },
      'completed'
    );

    // Prepare for storage
    const simulationResult = {
      studentId,
      careerId,
      careerTitle,
      engagementScore,
      decisionsMade,
      replayCount,
      totalTimeSeconds: totalTime,
      weightDelta,
      completedAt: new Date().toISOString(),
      behavioralMetrics: behavioralSignals
    };

    // Update completed list
    setCompletedSimulations(prev => [...prev, simulationResult]);

    // Update fingerprint on backend
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/students/${studentId}/simulations/complete`,
        simulationResult
      );

      console.log('✅ Simulation logged:', response.data);

      // Update fingerprint
      if (response.data.updatedFingerprint) {
        setStudentFingerprint(response.data.updatedFingerprint);
      }
    } catch (error) {
      console.error('Error logging simulation:', error);
    }

    // Clear active simulation
    setActiveSimulation(null);

    // Auto-generate new recommendations
    setTimeout(() => generateRecommendations(), 500);
  }, [studentId]);

  /**
   * Handle simulation quit
   */
  const handleSimulationQuit = useCallback(async (quitData) => {
    console.log('❌ Simulation Quit:', quitData);

    const { careerId, completionRatio, scenesSeen } = quitData;

    const quitResult = {
      studentId,
      careerId,
      completedRatio: completionRatio,
      scenesSeen,
      engagementScore: 0,
      quitAt: new Date().toISOString(),
      weightDelta: -15 // Default quit penalty
    };

    // Log quit to backend
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/students/${studentId}/simulations/quit`,
        quitResult
      );
    } catch (error) {
      console.error('Error logging quit:', error);
    }

    setActiveSimulation(null);
  }, [studentId]);

  /**
   * Generate AI recommendations based on completed simulations
   */
  const generateRecommendations = useCallback(async () => {
    if (completedSimulations.length === 0) return;

    setLoadingRecommendations(true);

    try {
      // Get updated fingerprint from backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/students/${studentId}/fingerprint`
      );

      const fingerprint = response.data;
      setStudentFingerprint(fingerprint);

      // Calculate recommendations
      const nextRecs = EngagementScoringSystem.predictNextRecommendations(
        fingerprint.cognitiveProfile || {},
        careerCatalog
      );

      setRecommendations(nextRecs);
      console.log('🎯 Recommendations generated:', nextRecs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [completedSimulations, studentId]);

  /**
   * Start a new simulation
   */
  const startSimulation = useCallback((careerId) => {
    setActiveSimulation(careerId);
  }, []);

  // ===== EFFECTS =====

  // Generate initial recommendations on mount
  useEffect(() => {
    if (completedSimulations.length > 0) {
      generateRecommendations();
    }
  }, []);

  // ===== RENDER: ACTIVE SIMULATION =====
  if (activeSimulation) {
    return (
      <SimulationEngine
        careerId={activeSimulation}
        careerTitle={careerCatalog.find(c => c.id === activeSimulation)?.title}
        onComplete={handleSimulationComplete}
        onQuit={handleSimulationQuit}
      />
    );
  }

  // ===== RENDER: DASHBOARD =====
  return (
    <motion.div
      className="min-h-screen bg-background-main p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-primary-blue mb-2 font-display">
            Career Simulations
          </h1>
          <p className="text-secondary text-lg">
            Explore careers through interactive decision-based scenarios
          </p>
        </div>

        {/* PROGRESS STATS */}
        {completedSimulations.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-background-card border border-blue-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary-blue" size={24} />
                <span className="text-secondary text-sm">Simulations Completed</span>
              </div>
              <p className="text-4xl font-bold text-main">{completedSimulations.length}</p>
            </div>

            <div className="bg-background-card border border-blue-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-primary-blue" size={24} />
                <span className="text-secondary text-sm">Avg Engagement</span>
              </div>
              <p className="text-4xl font-bold text-main">
                {completedSimulations.length > 0
                  ? Math.round(
                      completedSimulations.reduce((sum, s) => sum + s.engagementScore, 0) /
                        completedSimulations.length
                    )
                  : 0}
              </p>
              <p className="text-secondary text-xs mt-1">/100</p>
            </div>

            <div className="bg-background-card border border-blue-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-primary-blue" size={24} />
                <span className="text-secondary text-sm">Total Decisions</span>
              </div>
              <p className="text-4xl font-bold text-main">
                {completedSimulations.reduce((sum, s) => sum + (s.decisionsMade || 0), 0)}
              </p>
            </div>

            <div className="bg-background-card border border-blue-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-primary-blue" size={24} />
                <span className="text-secondary text-sm">Time Invested</span>
              </div>
              <p className="text-4xl font-bold text-main">
                {Math.round(
                  completedSimulations.reduce((sum, s) => sum + (s.totalTimeSeconds || 0), 0) / 60
                )}
              </p>
              <p className="text-secondary text-xs mt-1">minutes</p>
            </div>
          </motion.div>
        )}

        {/* COGNITIVE PROFILE RADAR (if data available) */}
        {studentFingerprint?.cognitiveProfile && (
          <motion.div
            className="bg-background-card border border-blue-100 rounded-xl p-8 mb-12 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-primary-blue mb-6 flex items-center gap-2">
              <Award className="text-purple-700" size={24} />
              Your Cognitive Profile
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Object.entries(studentFingerprint.cognitiveProfile).map(
                ([strength, score]) => (
                  <div key={strength} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(37, 99, 235, 0.15)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#grad1)"
                          strokeWidth="8"
                          strokeDasharray={`${(score / 100) * 282.7} 282.7`}
                          initial={{ strokeDasharray: '0 282.7' }}
                          animate={{ strokeDasharray: `${(score / 100) * 282.7} 282.7` }}
                          transition={{ duration: 1 }}
                        />
                        <defs>
                          <linearGradient
                            id="grad1"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#2563EB" />
                            <stop offset="100%" stopColor="#7C3AED" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary-blue font-bold text-lg">{score}</span>
                      </div>
                    </div>
                    <p className="text-secondary text-xs font-semibold capitalize">
                      {strength}
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-primary-blue mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <motion.div
                  key={rec.careerId}
                  className="bg-background-card border border-blue-100 hover:border-primary-blue rounded-lg p-6 cursor-pointer transition-all shadow-sm"
                  whileHover={{ scale: 1.02, borderColor: '#2563EB' }}
                  onClick={() => startSimulation(rec.careerId)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-main">{rec.careerTitle}</h3>
                      <p className="text-purple-700 font-semibold">{rec.reason}</p>
                    </div>
                    <div className="bg-purple-100 px-3 py-1 rounded-lg">
                      <span className="text-purple-700 font-bold">{rec.matchScore}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.matchScore}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AVAILABLE SIMULATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-primary-blue mb-6">Available Simulations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerCatalog.map((career) => {
              const completed = completedSimulations.find(s => s.careerId === career.id);
              return (
                <motion.div
                  key={career.id}
                  className={`rounded-lg p-8 cursor-pointer transition-all shadow-sm border ${
                    completed
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-background-card border-blue-100 hover:border-primary-blue'
                  }`}
                  onClick={() => !completed && startSimulation(career.id)}
                  whileHover={!completed ? { scale: 1.02 } : {}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-main">{career.title}</h3>
                      <p className="text-secondary text-sm">{career.category}</p>
                    </div>
                    {completed && (
                      <div className="bg-purple-100 px-3 py-1 rounded-lg">
                        <span className="text-purple-700 font-semibold text-sm">
                          {completed.engagementScore}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-secondary text-sm mb-6">{career.description}</p>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      completed
                        ? 'bg-blue-100 text-secondary'
                        : 'bg-primary-blue hover:bg-blue-700 text-white'
                    }`}
                    disabled={completed}
                  >
                    {completed ? '✓ Completed' : 'Start Simulation'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SimulationManager;
