import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, RotateCcw, Info } from 'lucide-react';
import axios from 'axios';

/**
 * BEHAVIORAL-INTELLIGENCE CAREER SIMULATION ENGINE
 * 
 * Measures cognitive patterns, decision-making behavior, and career affinity
 * through interactive, branching career scenarios.
 * 
 * Silent behavioral tracking:
 * - Time to decision per scene
 * - Replay count and patterns
 * - Click speed analysis
 * - Scene dropout detection
 * - Decision consistency
 * - Risk vs safety preference
 */

const SimulationEngine = ({ careerId, careerTitle, onComplete, onQuit }) => {
  // ===== STATE MANAGEMENT =====
  const [currentScene, setCurrentScene] = useState(0);
  const [simulationState, setSimulationState] = useState('loading'); // loading, intro, scene, complete, quit
  const [sceneData, setSceneData] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [replayCount, setReplayCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [engagementMetrics, setEngagementMetrics] = useState({
    totalSceneTime: 0,
    improvedScenes: 0,
    explorationDepth: 0,
    riskTakingScore: 0,
  });

  // Behavioral tracking refs (silent, no UI exposure)
  const sceneStartTime = useRef(null);
  const sceneReplayCount = useRef(0);
  const clickTimestamps = useRef([]);
  const sessionEvents = useRef([]);
  const decisionTimings = useRef({});

  // ===== SIMULATION SCENARIOS DATABASE =====
  // 6-8 scenes per career with branching logic
  const simulationScenarios = {
    doctor: {
      title: 'ER Doctor - High-Pressure Decision-Making',
      intro: 'You are a junior ER physician during a busy Saturday night shift. A patient arrives with chest pain and elevated blood pressure.',
      scenes: [
        {
          id: 'scene_1',
          context: 'Patient Assessment',
          situation: 'A 55-year-old male arrives complaining of chest pain for the last 2 hours. His vital signs: BP 160/95, HR 102, O2 98%. He looks anxious.',
          choices: [
            {
              label: 'Run immediate EKG and troponin tests',
              value: 'data_first',
              riskLevel: 'safe',
              consequence: 'You gather critical data. EKG shows minor ST changes. Result: More confidence in next decision.'
            },
            {
              label: 'Assess patient lifestyle first (diet, stress, exercise)',
              value: 'holistic',
              riskLevel: 'moderate',
              consequence: 'Patient mentions high stress job and poor sleep. You consider psychosomatic factor.'
            },
            {
              label: 'Recommend hospital admission immediately',
              value: 'aggressive',
              riskLevel: 'cautious',
              consequence: 'Patient admits but is frustrated about cost and time. Hospital bed available.'
            }
          ],
          timer: 45
        },
        {
          id: 'scene_2',
          context: 'Risk Assessment',
          situation: 'Initial tests come back: EKG normal, troponin negative. Patient still reports chest discomfort but seems calmer. He wants to leave.',
          choices: [
            {
              label: 'Discharge with lifestyle modification advice',
              value: 'discharge',
              riskLevel: 'moderate',
              consequence: 'Patient relieved. But you feel uncertain about long-term risk.'
            },
            {
              label: 'Recommend 24-hour observation for peace of mind',
              value: 'observe',
              riskLevel: 'safe',
              consequence: 'Extra cost and hospital stay, but you sleep well knowing he\'s monitored.'
            },
            {
              label: 'Order advanced cardiac imaging',
              value: 'imaging',
              riskLevel: 'cautious',
              consequence: 'Patient anxious about radiation. Imaging shows clear coronary arteries.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_3',
          context: 'Patient Communication',
          situation: 'Patient is frustrated about waiting and cost of tests. His insurance may reject coverage for "unnecessary" imaging. He\'s demanding answers.',
          choices: [
            {
              label: 'Explain the clinical reasoning clearly and empathetically',
              value: 'communicate',
              riskLevel: 'safe',
              consequence: 'Patient feels heard. He understands cardiac risk better now.'
            },
            {
              label: 'Apologize for inconvenience and waive imaging fees',
              value: 'appease',
              riskLevel: 'moderate',
              consequence: 'Patient satisfied but you realize you can\'t always do this.'
            },
            {
              label: 'Stand firm: medical protocol requires this given his risk factors',
              value: 'assert',
              riskLevel: 'cautious',
              consequence: 'Patient upset but respects your confidence. Compliance improves.'
            }
          ],
          timer: 55
        },
        {
          id: 'scene_4',
          context: 'Team Collaboration',
          situation: 'Nurse informs you another critical case arrived (stroke patient). You have 4 more patients waiting. You\'re unsure if your current patient needs senior review.',
          choices: [
            {
              label: 'Consult senior cardiologist immediately',
              value: 'consult',
              riskLevel: 'safe',
              consequence: 'Cardiologist confirms your judgment. You gain confidence and learning opportunity.'
            },
            {
              label: 'Make decision independently based on your assessment',
              value: 'independent',
              riskLevel: 'moderate',
              consequence: 'Shows confidence but slight pressure. Patient stabilizes.'
            },
            {
              label: 'Flag for follow-up care and move to next patient',
              value: 'defer',
              riskLevel: 'moderate',
              consequence: 'Efficient workflow but nagging doubt about thoroughness.'
            }
          ],
          timer: 40
        },
        {
          id: 'scene_5',
          context: 'Ethical Dilemma',
          situation: 'Later, you learn your patient had a heart attack 2 days later at home after discharge. He survived but is angry. The attending asks for a report.',
          choices: [
            {
              label: 'Take full responsibility; analyze what you\'d do differently',
              value: 'owned',
              riskLevel: 'cautious',
              consequence: 'High emotional cost but deep learning. Hospital implements new protocol.'
            },
            {
              label: 'Note that tests were negative; patient ignored follow-up advice',
              value: 'deflect',
              riskLevel: 'moderate',
              consequence: 'Reduces guilt but feels uncomfortable. Colleague questions your judgment.'
            },
            {
              label: 'Discuss systemic factors: limited imaging, rushed workflow',
              value: 'systemic',
              riskLevel: 'safe',
              consequence: 'Balanced perspective. Opens dialog about ER improvement.'
            }
          ],
          timer: 60
        },
        {
          id: 'scene_6',
          context: 'Burnout Test',
          situation: 'It\'s 2 AM. You\'ve been working 14 hours. Next patient: vague abdominal pain. You\'re exhausted.',
          choices: [
            {
              label: 'Thorough exam despite fatigue',
              value: 'thorough',
              riskLevel: 'safe',
              consequence: 'Painful but you find appendicitis. Patient grateful.'
            },
            {
              label: 'Basic exam + discharge; probably not serious',
              value: 'shortcut',
              riskLevel: 'moderate',
              consequence: 'Patient fine but you know you cut corners. Guilt lingers.'
            },
            {
              label: 'Hand off to colleague despite continuity of care concern',
              value: 'handoff',
              riskLevel: 'moderate',
              consequence: 'Good team culture but you wonder about outcomes.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_7',
          context: 'Long-term Decision',
          situation: 'Your mentor asks: after this shift, are you still excited about ER medicine? You\'ve seen the best (quick thinking saves lives) and the worst (burnout, uncertainty, emotional toll).',
          choices: [
            {
              label: 'Thrilled - this rapid decision-making is my sweet spot',
              value: 'thrilled',
              riskLevel: 'moderate',
              consequence: 'High engagement. You see ER as calling.'
            },
            {
              label: 'Interested but concerned about sustainability',
              value: 'cautious_interest',
              riskLevel: 'safe',
              consequence: 'Realistic perspective. You explore subspecialties.'
            },
            {
              label: 'Not sure - maybe I prefer outpatient or research',
              value: 'exploring',
              riskLevel: 'moderate',
              consequence: 'Opens exploration of diverse medical paths.'
            }
          ],
          timer: 45
        }
      ]
    },
    engineer: {
      title: 'Software Engineer - System Design & Collaboration',
      intro: 'You\'re a junior software engineer at a high-growth tech startup. Your team is building a critical feature with a tight deadline.',
      scenes: [
        {
          id: 'scene_1',
          context: 'Architecture Decision',
          situation: 'Feature deadline: 2 weeks. You and your tech lead disagree on architecture. Your approach is simpler but might have scalability issues. His approach is robust but takes 3x longer.',
          choices: [
            {
              label: 'Push for your simpler approach - faster delivery',
              value: 'risk_taking',
              riskLevel: 'moderate',
              consequence: 'Feature ships fast. Users love it but tech debt accumulates.'
            },
            {
              label: 'Defer to tech lead\'s experienced judgment',
              value: 'defer',
              riskLevel: 'safe',
              consequence: 'Takes longer but you learn robust patterns. Feature is bulletproof.'
            },
            {
              label: 'Propose hybrid: MVP with your approach, refactor post-launch',
              value: 'balanced',
              riskLevel: 'moderate',
              consequence: 'Best of both. Feature ships, then you improve it together.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_2',
          context: 'Bug Under Pressure',
          situation: 'Testing reveals critical bug in production. CEO is on the call. It\'s Friday 5 PM. Your colleague is on vacation.',
          choices: [
            {
              label: 'Dive deep into debugging alone despite time pressure',
              value: 'deep_focus',
              riskLevel: 'cautious',
              consequence: 'Found root cause in 45 min. High stress but professional satisfaction.'
            },
            {
              label: 'Ask for help from senior engineer across team',
              value: 'collaborate',
              riskLevel: 'safe',
              consequence: 'Fixed in 20 min with help. You learn something. Team trust grows.'
            },
            {
              label: 'Implement quick patch to stabilize; proper fix Monday',
              value: 'pragmatic',
              riskLevel: 'moderate',
              consequence: 'Buys time. CEO calm. But you worry about edge cases.'
            }
          ],
          timer: 45
        },
        {
          id: 'scene_3',
          context: 'Feedback Loop',
          situation: 'Code review: Tech lead wants significant refactoring of your code. You\'ve already invested 8 hours. You\'re tired.',
          choices: [
            {
              label: 'Refactor thoroughly - his feedback is valuable instruction',
              value: 'embrace_feedback',
              riskLevel: 'safe',
              consequence: 'Code becomes elegant. You learn deeply. Takes 4 more hours.'
            },
            {
              label: 'Make minimal changes to get approval',
              value: 'minimal',
              riskLevel: 'moderate',
              consequence: 'Code merges but tech debt remains. Guilt lingers.'
            },
            {
              label: 'Discuss trade-offs: which refactors are critical vs. nice-to-have',
              value: 'negotiated',
              riskLevel: 'moderate',
              consequence: 'Balanced. You learn prioritization. Code is good enough.'
            }
          ],
          timer: 55
        },
        {
          id: 'scene_4',
          context: 'Feature Complexity',
          situation: 'Midway through 2-week sprint, PM adds new requirements. Timeline doesn\'t change. Your estimate said 2 weeks for original scope.',
          choices: [
            {
              label: 'Work overtime to fit everything in',
              value: 'overwork',
              riskLevel: 'moderate',
              consequence: 'Ships on time but you burn out. Quality suffers.'
            },
            {
              label: 'Push back: negotiate scope or timeline',
              value: 'pushback',
              riskLevel: 'safe',
              consequence: 'Uncomfortable but PM respects clarity. Team protected.'
            },
            {
              label: 'Optimize ruthlessly; cut non-critical features',
              value: 'prioritize',
              riskLevel: 'cautious',
              consequence: 'Delivers core value. Deferred features cause some frustration.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_5',
          context: 'Knowledge Sharing',
          situation: 'You\'ve built a clever system. Another team needs similar functionality. They ask you to explain or help them build it.',
          choices: [
            {
              label: 'Share detailed documentation + pair program with them',
              value: 'generous',
              riskLevel: 'safe',
              consequence: 'Company benefits. Reputation grows. Takes 6 hours.'
            },
            {
              label: 'Give high-level overview; they engineer their own',
              value: 'guided',
              riskLevel: 'moderate',
              consequence: 'Efficient. They learn. But may duplicate work with variations.'
            },
            {
              label: 'Suggest they request feature from your roadmap',
              value: 'guard',
              riskLevel: 'moderate',
              consequence: 'Protects your time but might slow other teams.'
            }
          ],
          timer: 45
        },
        {
          id: 'scene_6',
          context: 'Career Inflection',
          situation: 'After 18 months, you\'re solid developer but not \'rockstar.\' Your options: Go deeper into systems/low-level | Stay full-stack generalist | Move toward leadership/mentorship.',
          choices: [
            {
              label: 'Specialize deep - learn systems design, databases, infrastructure',
              value: 'specialist',
              riskLevel: 'cautious',
              consequence: 'Become expert. High demand. But narrower opportunities.'
            },
            {
              label: 'Stay generalist - versatile, adaptable, multiple domains',
              value: 'generalist',
              riskLevel: 'moderate',
              consequence: 'Flexible career. Always relevant. But jack-of-all-trades risk.'
            },
            {
              label: 'Pivot toward team lead / engineering manager track',
              value: 'leadership',
              riskLevel: 'moderate',
              consequence: 'Broader impact. New challenges. Less time coding.'
            }
          ],
          timer: 60
        }
      ]
    },
    designer: {
      title: 'UX Designer - Balancing Aesthetics & User Needs',
      intro: 'You\'re a junior UX designer at a consumer app company. Your design impacts millions of users daily.',
      scenes: [
        {
          id: 'scene_1',
          context: 'User Research vs. Intuition',
          situation: 'Research shows users want Feature X, but your gut says they\'ll hate it. The data is from 50 people; you\'ve designed for 10,000.',
          choices: [
            {
              label: 'Trust research; build Feature X',
              value: 'data_driven',
              riskLevel: 'safe',
              consequence: 'Feature ships. Users love it. You learn to trust data.'
            },
            {
              label: 'Trust intuition; propose alternative',
              value: 'intuitive',
              riskLevel: 'moderate',
              consequence: 'Alternative works well. But you admit intuition is risky at scale.'
            },
            {
              label: 'Run A/B test; let data decide',
              value: 'experimental',
              riskLevel: 'safe',
              consequence: 'Rigorous. Takes time. Clear winner emerges. You level up methodology.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_2',
          context: 'Deadline vs. Quality',
          situation: 'Design is 80% there in Week 1 of 3. Shipping Week 3 allows iteration. But executive asks: can we ship Week 2?',
          choices: [
            {
              label: 'Commit to Week 2; cut polish, ship core experience',
              value: 'speed',
              riskLevel: 'moderate',
              consequence: 'Reaches users faster. They provide feedback. Iterates quickly.'
            },
            {
              label: 'Push for Week 3; design needs time to breathe',
              value: 'quality',
              riskLevel: 'safe',
              consequence: 'Better finished product. Delayed feedback. But no regrets.'
            },
            {
              label: 'Propose phased launch: core in Week 2, polish in Week 3',
              value: 'phased',
              riskLevel: 'moderate',
              consequence: 'Compromise. Users get value + refinement cycle.'
            }
          ],
          timer: 55
        },
        {
          id: 'scene_3',
          context: 'Stakeholder Pressure',
          situation: 'PM wants to add 5 new buttons to dashboard. Designer in you says this creates clutter. But PM has data showing users want quick access.',
          choices: [
            {
              label: 'Advocate hard: propose better information architecture instead',
              value: 'advocate',
              riskLevel: 'safe',
              consequence: 'Long discussion. PM agrees to workshop together. Better solution.'
            },
            {
              label: 'Implement PM\'s request but make buttons subtle',
              value: 'compromise',
              riskLevel: 'moderate',
              consequence: 'Satisfies both. Design is cluttered but functional.'
            },
            {
              label: 'Tell PM to live with current design for next cycle',
              value: 'defer',
              riskLevel: 'moderate',
              consequence: 'Protects vision. But PM frustrated. Creates tension.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_4',
          context: 'Accessibility Oversight',
          situation: 'Design is beautiful on your 27" monitor. You test on mobile: text is tiny, buttons hard to tap. Accessibility audit finds 8 issues.',
          choices: [
            {
              label: 'Redesign comprehensively for all screen sizes & accessibility',
              value: 'comprehensive',
              riskLevel: 'safe',
              consequence: 'Takes 1 week. But design is now inclusive. You feel proud.'
            },
            {
              label: 'Ship now; fix accessibility issues in v2',
              value: 'defer',
              riskLevel: 'moderate',
              consequence: 'Faster launch but alienates accessibility-dependent users.'
            },
            {
              label: 'Quick fixes to most critical issues; ship',
              value: 'triage',
              riskLevel: 'moderate',
              consequence: 'Balanced. Some accessibility, some speed. User feedback varies.'
            }
          ],
          timer: 45
        },
        {
          id: 'scene_5',
          context: 'Design Trend Pressure',
          situation: 'Competitor launches minimalist design. CEO says: "Our design looks dated. Can we make it more modern?"',
          choices: [
            {
              label: 'Propose thoughtful refresh; test with users first',
              value: 'user_validated',
              riskLevel: 'safe',
              consequence: 'Modest refresh. Users appreciate it. No disruption.'
            },
            {
              label: 'Go bold: embrace latest trends, assume users adapt',
              value: 'trendy',
              riskLevel: 'moderate',
              consequence: 'Looks fresh. Some users love it. Others confused. Net positive.'
            },
            {
              label: 'Stand firm: our design works; trends are ephemeral',
              value: 'timeless',
              riskLevel: 'cautious',
              consequence: 'CEO pushes back. You hold ground. Design ages well.'
            }
          ],
          timer: 50
        },
        {
          id: 'scene_6',
          context: 'Design Critique',
          situation: 'Senior designer critiques your work harshly in team meeting. You\'re embarrassed. Feedback is valid but you\'re demoralized.',
          choices: [
            {
              label: 'Take notes; thank them; apply feedback without defensiveness',
              value: 'learn',
              riskLevel: 'safe',
              consequence: 'Grows reputation. Improves everyone\'s work. You level up.'
            },
            {
              label: 'Defend your choices; explain reasoning',
              value: 'push_back',
              riskLevel: 'moderate',
              consequence: 'Dialog happens. Some agreement. Bit of tension remains.'
            },
            {
              label: 'Nod politely; internalize criticism later',
              value: 'internalize',
              riskLevel: 'moderate',
              consequence: 'Avoids conflict but misses learning moment. Self-doubt grows.'
            }
          ],
          timer: 45
        }
      ]
    }
  };

  // ===== BEHAVIORAL TRACKING SYSTEM =====
  /**
   * Log decision event with behavioral signals:
   * - Time taken to decide
   * - Click speed patterns
   * - Replay detection
   * - Risk preference
   */
  const trackDecision = useCallback((optionValue, riskLevel) => {
    const timeTakenSeconds = (Date.now() - sceneStartTime.current) / 1000;
    const clickSpeed = clickTimestamps.current.length > 1 
      ? (clickTimestamps.current[clickTimestamps.current.length - 1] - clickTimestamps.current[0]) / clickTimestamps.current.length
      : 0;

    const eventData = {
      studentId: localStorage.getItem('studentId'),
      careerId,
      sceneId: currentScene,
      optionChosen: optionValue,
      riskLevel,
      timeTaken: timeTakenSeconds,
      clickSpeed: Math.round(clickSpeed),
      replayCount: sceneReplayCount.current,
      timestamp: new Date().toISOString(),
      sessionDuration: (Date.now() - sessionStartTime) / 1000
    };

    // Store event (non-blocking)
    sessionEvents.current.push(eventData);
    decisionTimings.current[currentScene] = timeTakenSeconds;

    // Track engagement metrics
    setEngagementMetrics(prev => ({
      ...prev,
      totalSceneTime: prev.totalSceneTime + timeTakenSeconds,
      riskTakingScore: prev.riskTakingScore + (riskLevel === 'cautious' ? 1 : riskLevel === 'moderate' ? 0.5 : 0)
    }));

    // Update decisions
    setDecisions(prev => [...prev, eventData]);

    console.log('🔍 Behavioral Event:', eventData);
  }, [currentScene, careerId]);

  // ===== ENGAGEMENT SCORE CALCULATION =====
  /**
   * Calculate engagement score using weighted formula:
   * 
   * Engagement Score = 
   *   (0.3 × session_time_score) +
   *   (0.25 × replay_weight) +
   *   (0.2 × completion_flag) +
   *   (0.15 × improvement_delta) +
   *   (0.1 × depth_of_interaction)
   * 
   * Normalized to 0-100 scale
   */
  const calculateEngagementScore = useCallback(() => {
    const scenarioLength = simulationScenarios[careerId]?.scenes.length || 7;
    const sessionDurationMinutes = (Date.now() - sessionStartTime) / 60000;
    
    // Component scores (0-100 each)
    const sessionTimeScore = Math.min((sessionDurationMinutes / 15) * 100, 100); // Target: 15 min
    const replayWeight = Math.min(replayCount * 15, 50); // Max 50 points from replay
    const completionFlag = currentScene === scenarioLength - 1 ? 100 : (currentScene / scenarioLength) * 80;
    
    // Improvement delta: faster decisions later = improvement
    const timings = Object.values(decisionTimings.current);
    const improvementDelta = timings.length > 1 
      ? Math.max(0, ((timings[0] - timings[timings.length - 1]) / timings[0]) * 100)
      : 50;
    
    // Depth of interaction: choices made, variety in risk levels
    const depthScore = (decisions.length / scenarioLength) * 100;
    
    // Weighted sum
    const engagementScore = (
      (0.3 * sessionTimeScore) +
      (0.25 * replayWeight) +
      (0.2 * completionFlag) +
      (0.15 * improvementDelta) +
      (0.1 * depthScore)
    );

    return Math.round(engagementScore);
  }, [careerId, currentScene, replayCount, decisions, sessionStartTime]);

  // ===== DOMAIN WEIGHT UPDATE LOGIC =====
  /**
   * Update student's career fingerprint based on simulation behavior
   * 
   * Rules:
   * - Completed + Replayed ≥2: +20%
   * - Completed once: +10%
   * - Completed slowly: +3%
   * - Quit before halfway: -15%
   * - Explored harder version: +15%
   */
  const updateDomainWeights = useCallback(async (finalScore, completionStatus) => {
    const scenarioLength = simulationScenarios[careerId]?.scenes.length || 7;
    const completionRatio = currentScene / scenarioLength;
    
    let weightDelta = 0;

    if (completionStatus === 'completed' && replayCount >= 2) {
      weightDelta = 20; // Strong interest signal
    } else if (completionStatus === 'completed') {
      weightDelta = 10; // Completed once
    } else if (completionStatus === 'started' && completionRatio >= 0.5) {
      weightDelta = 3; // Attempted but didn't complete
    } else if (completionStatus === 'quit' && completionRatio < 0.5) {
      weightDelta = -15; // Early dropout
    }

    // Bonus for improved performance
    if (Object.keys(decisionTimings.current).length > 3) {
      const timings = Object.values(decisionTimings.current);
      const improvement = timings[timings.length - 1] < timings[0] * 0.8 ? 5 : 0;
      weightDelta += improvement;
    }

    console.log('📊 Domain Weight Update:', { career: careerId, delta: weightDelta, score: finalScore });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/simulations/update-fingerprint`, {
        studentId: localStorage.getItem('studentId'),
        careerId,
        weightDelta,
        engagementScore: finalScore,
        behaviorSignals: {
          decisions: decisions.length,
          replayCount,
          averageDecisionTime: Math.round(engagementMetrics.totalSceneTime / decisions.length),
          riskProfile: engagementMetrics.riskTakingScore / decisions.length
        }
      });
    } catch (error) {
      console.error('Error updating fingerprint:', error);
    }
  }, [careerId, currentScene, replayCount, decisions, engagementMetrics]);

  // ===== LOADING PHASE =====
  useEffect(() => {
    setSceneData(simulationScenarios[careerId]);
    setTimeout(() => setSimulationState('intro'), 500);
  }, [careerId]);

  // ===== SCENE INITIALIZATION =====
  useEffect(() => {
    if (simulationState === 'scene' && sceneData) {
      sceneStartTime.current = Date.now();
      sceneReplayCount.current = 0;
      clickTimestamps.current = [];
    }
  }, [currentScene, simulationState]);

  // ===== HANDLER: START SIMULATION =====
  const handleStartSimulation = () => {
    setSimulationState('scene');
    setCurrentScene(0);
    setSessionStartTime(Date.now());
  };

  // ===== HANDLER: MAKE DECISION =====
  const handleDecision = (choice) => {
    trackDecision(choice.value, choice.riskLevel);
    clickTimestamps.current.push(Date.now());

    const totalScenes = sceneData.scenes.length;
    if (currentScene < totalScenes - 1) {
      setTimeout(() => setCurrentScene(currentScene + 1), 600);
    } else {
      completeSimulation();
    }
  };

  // ===== HANDLER: REPLAY SCENE =====
  const handleReplayScene = () => {
    sceneReplayCount.current += 1;
    setReplayCount(replayCount + 1);
    sceneStartTime.current = Date.now();
    clickTimestamps.current = [];
    
    console.log('🔄 Replay detected - Scene:', currentScene, 'Replay count:', sceneReplayCount.current);
  };

  // ===== HANDLER: QUIT SIMULATION =====
  const handleQuitSimulation = () => {
    const engagementScore = calculateEngagementScore();
    const completionRatio = currentScene / sceneData.scenes.length;
    
    setSimulationState('quit');
    updateDomainWeights(engagementScore, 'quit');
    
    if (onQuit) {
      onQuit({
        careerId,
        engagementScore,
        completionRatio,
        reason: 'user_quit',
        scenesSeen: currentScene
      });
    }
  };

  // ===== COMPLETION HANDLER =====
  const completeSimulation = async () => {
    const engagementScore = calculateEngagementScore();
    
    setSimulationState('complete');
    await updateDomainWeights(engagementScore, 'completed');

    const completionData = {
      careerId,
      careerTitle,
      engagementScore,
      decisionsMade: decisions.length,
      replayCount,
      totalTime: (Date.now() - sessionStartTime) / 1000,
      behavioralSignals: {
        totalSceneTime: engagementMetrics.totalSceneTime,
        riskProfile: engagementMetrics.riskTakingScore / decisions.length,
        decisions: decisions
      }
    };

    console.log('✅ Simulation Complete:', completionData);

    if (onComplete) {
      setTimeout(() => onComplete(completionData), 2000);
    }
  };

  // ===== UI: INTRO SCREEN =====
  if (simulationState === 'intro') {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-2xl w-full">
          <motion.div
            className="bg-white border border-purple-200 rounded-xl p-12 shadow-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-purple-100 border border-purple-300 rounded-lg mb-4">
                <span className="text-purple-600 text-sm font-semibold">Interactive Simulation</span>
              </div>
              <h1 className="text-5xl font-bold text-purple-600 mb-4 font-display">
                {sceneData?.title}
              </h1>
              <p className="text-secondary text-lg leading-relaxed">
                {sceneData?.intro}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 mb-8">
              <h3 className="text-purple-600 font-semibold mb-4 flex items-center gap-2">
                <Info size={18} className="text-purple-600" />
                How This Works
              </h3>
              <ul className="space-y-3 text-secondary text-sm">
                <li className="flex gap-3">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>You'll face 6-8 realistic decision scenarios</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Each decision reveals how you think and prioritize</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>There are no "correct" answers - we're studying your behavior</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Replay scenes to explore different approaches</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={handleStartSimulation}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Simulation
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={handleQuitSimulation}
                className="px-6 bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold py-4 rounded-lg transition-all border border-purple-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Not For Me
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ===== UI: SCENE RENDERING =====
  if (simulationState === 'scene' && sceneData && sceneData.scenes[currentScene]) {
    const currentSceneData = sceneData.scenes[currentScene];
    const totalScenes = sceneData.scenes.length;
    const progressPercentage = ((currentScene + 1) / totalScenes) * 100;

    return (
      <motion.div
        className="min-h-screen bg-background-main flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-3xl w-full">
          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-secondary text-sm font-semibold mb-2">{currentSceneData.context}</h2>
                <h1 className="text-3xl font-bold gradient-text-purple font-display">
                  Scene {currentScene + 1} of {totalScenes}
                </h1>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Clock size={18} />
                  <span className="text-sm font-semibold">{currentSceneData.timer}s</span>
                </div>
                {replayCount > 0 && (
                  <div className="flex items-center gap-2 text-purple-700">
                    <RotateCcw size={18} />
                    <span className="text-sm font-semibold">{replayCount} replays</span>
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS BAR - FLOATING STYLE */}
            <div className="w-full h-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded-full overflow-hidden shadow-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-glow-purple"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
              />
            </div>
          </div>

          {/* SCENE CONTENT */}
          <motion.div
            className="card-premium bg-white rounded-2xl p-12 mb-8 shadow-premium hover:shadow-premium-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key={currentScene}
          >
            <p className="text-main text-lg leading-relaxed mb-8 text-center">
              {currentSceneData.situation}
            </p>

            {/* DECISION CHOICES */}
            <div className="space-y-4">
              <p className="text-secondary text-sm font-semibold uppercase tracking-wide mb-6">Select your response:</p>
              {currentSceneData.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleDecision(choice)}
                  className="w-full text-left p-6 bg-white border-2 border-purple-100 hover:border-purple-500 rounded-xl transition-all group shadow-sm hover:shadow-premium hover-lift"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(124, 58, 237, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full border-2 border-purple-600/40 group-hover:border-purple-600 group-hover:shadow-glow-purple flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-all">
                      <span className="text-purple-600 font-bold text-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-main font-semibold mb-2">{choice.label}</p>
                      <p className="text-secondary text-sm">{choice.consequence}</p>
                      <div className="flex gap-2 mt-3">
                        <span className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full ${
                          choice.riskLevel === 'safe' ? 'bg-green-100/70 text-green-700 border border-green-200' :
                          choice.riskLevel === 'moderate' ? 'bg-purple-100/70 text-purple-700 border border-purple-200' :
                          'bg-orange-100/70 text-orange-700 border border-orange-200'
                        }`}>
                          {choice.riskLevel === 'safe' ? '🛡️ Safe' : choice.riskLevel === 'moderate' ? '⚖️ Moderate' : '🎯 Cautious'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={handleReplayScene}
              className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={18} />
              Replay Scene
            </motion.button>
            <motion.button
              onClick={handleQuitSimulation}
              className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-primary-blue font-semibold rounded-lg transition-all border border-blue-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quit
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ===== UI: COMPLETION SCREEN =====
  if (simulationState === 'complete') {
    const engagementScore = calculateEngagementScore();
    const completionTime = ((Date.now() - sessionStartTime) / 60).toFixed(1);

    return (
      <motion.div
        className="min-h-screen bg-background-main flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-2xl w-full">
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-premium-lg hover:shadow-glow-purple"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <span className="text-5xl">🎯</span>
            </motion.div>

            <h1 className="text-5xl font-bold gradient-text-purple mb-4 font-display">
              Simulation Complete
            </h1>

            <motion.div 
              className="card-premium bg-white rounded-2xl p-12 mb-8 shadow-premium hover:shadow-premium-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-100 hover-lift"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-secondary text-sm mb-2">Engagement Score</p>
                  <p className="text-4xl font-bold gradient-text-purple">{engagementScore}</p>
                  <p className="text-secondary text-xs mt-2">/100</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-100 hover-lift"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-secondary text-sm mb-2">Time Invested</p>
                  <p className="text-4xl font-bold gradient-text-purple">{completionTime}</p>
                  <p className="text-secondary text-xs mt-2">minutes</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-100 hover-lift"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-secondary text-sm mb-2">Decisions Made</p>
                  <p className="text-4xl font-bold gradient-text-purple">{decisions.length}</p>
                  <p className="text-secondary text-xs mt-2">choices</p>
                </motion.div>
              </div>

              <div className="text-left bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 mb-8 border border-purple-100 shadow-sm">
                <h3 className="gradient-text-purple font-bold mb-4">Your Behavioral Profile</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-secondary text-sm mb-1 font-semibold">Decision Speed</p>
                    <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden shadow-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-glow-purple"
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary text-sm mb-1 font-semibold">Risk Tolerance</p>
                    <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden shadow-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-glow-purple"
                        initial={{ width: 0 }}
                        animate={{ width: '58%' }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary text-sm mb-1 font-semibold">Engagement Depth</p>
                    <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden shadow-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-glow-purple"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(decisions.length * 15, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary text-sm mb-1 font-semibold">Replay Behavior</p>
                    <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden shadow-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-glow-purple"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(replayCount * 20, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-secondary text-sm leading-relaxed mb-6">
                Based on your decisions across {decisions.length} scenarios, we've learned about your approach to {careerTitle.toLowerCase()}. 
                Your engagement score and behavior patterns will help us recommend careers that match your cognitive style and interests.
              </p>
            </motion.div>

            <motion.button
              onClick={() => onComplete?.({ 
                score: engagementScore, 
                career: careerId 
              })}
              className="w-full btn btn-premium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-premium hover:shadow-premium-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              See Recommendations
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ===== UI: QUIT PROMPT =====
  if (simulationState === 'quit') {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-md w-full">
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-white border border-purple-300 rounded-xl p-12 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Simulation Exited</h2>
            <p className="text-gray-700 mb-8">
              No problem! We've recorded your choices and will use them to refine your recommendations.
            </p>
            <motion.button
              onClick={() => onQuit?.({ career: careerId, completed: false })}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ===== UI: LOADING =====
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
      />
    </div>
  );
};

export default SimulationEngine;
