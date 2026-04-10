import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, RotateCcw, MapPin, TrendingUp, Shield, Zap, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MCSS DEDICATED LANDING PAGE
 * 
 * Micro Career Simulation System
 * - 10 detailed sections
 * - Professional startup-grade design
 * - Premium red-black theme
 * - Behavioral intelligence showcase
 */

const MCSSPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // ===== SECTION 1: HERO =====
  const HeroSection = () => (
    <motion.section
      className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background blobs - enhanced */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT: CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 rounded-lg mb-6 shadow-sm" whileHover={{ scale: 1.05 }}>
            <span className="text-purple-700 text-sm font-bold">🎮 Behavioral Intelligence</span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-black gradient-text-purple mb-6 leading-tight">
            Micro Career Simulation System
          </h1>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed font-semibold">
            Experience real-world career decisions. Measured by behavior. Not opinion.
          </p>

          <p className="text-gray-600 text-base mb-12 leading-relaxed">
            10–15 minute immersive decision-based simulations powered by AI behavioral tracking. Discover careers that match your cognitive patterns, not just your interests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => navigate('/simulation')}
              className="px-8 py-4 btn btn-premium bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-premium hover:shadow-premium-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Start Simulation
              <ArrowRight size={20} />
            </motion.button>

            <motion.button
              onClick={() => document.getElementById('section-2').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 btn btn-secondary-premium border-2 border-purple-400 text-purple-700 font-bold rounded-lg transition-all"
              whileHover={{ scale: 1.05, borderColor: '#6D28D9', backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
              whileTap={{ scale: 0.95 }}
            >
              Learn How It Works
            </motion.button>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-purple-200">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-purple-600 font-black text-4xl">50K+</p>
              <p className="text-gray-600 text-sm font-semibold">Students Tested</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-purple-600 font-black text-4xl">30+</p>
              <p className="text-gray-600 text-sm font-semibold">Career Paths</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <p className="text-purple-600 font-black text-4xl">92%</p>
              <p className="text-gray-600 text-sm font-semibold">Engagement Rate</p>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT: VISUAL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-full aspect-square">
            {/* Decision Tree Visualization */}
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Central node */}
              <motion.circle
                cx="150"
                cy="150"
                r="20"
                fill="#7C3AED"
                animate={{ r: [20, 22, 20] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Branch lines */}
              <motion.line
                x1="150"
                y1="150"
                x2="80"
                y2="80"
                stroke="#7C3AED"
                strokeWidth="2"
                opacity="0.5"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                strokeDasharray="100"
              />
              <motion.line
                x1="150"
                y1="150"
                x2="220"
                y2="80"
                stroke="#6D28D9"
                strokeWidth="2"
                opacity="0.5"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                strokeDasharray="100"
              />
              <motion.line
                x1="150"
                y1="150"
                x2="150"
                y2="50"
                stroke="#7C3AED"
                strokeWidth="2"
                opacity="0.5"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                strokeDasharray="100"
              />

              {/* Branch nodes */}
              <circle cx="80" cy="80" r="12" fill="#6D28D9" opacity="0.7" />
              <circle cx="220" cy="80" r="12" fill="#7C3AED" opacity="0.7" />
              <circle cx="150" cy="50" r="12" fill="#6D28D9" opacity="0.7" />

              {/* Secondary nodes */}
              <motion.circle
                cx="50"
                cy="40"
                r="8"
                fill="#7C3AED"
                opacity="0.4"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="110"
                cy="20"
                r="8"
                fill="#6D28D9"
                opacity="0.4"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="250"
                cy="40"
                r="8"
                fill="#7C3AED"
                opacity="0.4"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-purple-500 text-sm">Decision Network</p>
                <p className="text-purple-700 font-bold text-2xl">AI Tracking</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );

  // ===== SECTION 2: WHAT IS MCSS =====
  const WhatIsSection = () => (
    <motion.section
      id="section-2"
      className="py-24 px-6 bg-gradient-to-b from-white to-purple-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold gradient-text-purple mb-6">
            What Is Micro Career Simulation?
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            MCSS is a behavioral intelligence engine that simulates real career scenarios, tracks cognitive patterns, and discovers your true career affinity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              title: '⏱ Time Tracking',
              desc: 'Measures decision speed and how you improve over time'
            },
            {
              icon: <RotateCcw className="w-8 h-8" />,
              title: '🔁 Replay Detection',
              desc: 'Replays signal the strongest indicator of genuine interest'
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: '📍 Drop-off Analysis',
              desc: 'Learns why you quit and adjusts recommendations'
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: '📈 Improvement Monitoring',
              desc: 'Tracks learning velocity and skill development'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="card-premium bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-premium hover:shadow-premium-lg rounded-xl p-8 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, borderColor: '#7C3AED' }}
            >
              <div className="text-purple-600 mb-4 group-hover:text-purple-700 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  // ===== SECTION 3: HOW IT WORKS =====
  const HowItWorksSection = () => (
    <motion.section
      className="py-24 px-6 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            How A Simulation Works
          </h2>
        </motion.div>

        {/* Timeline Flow */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/0 via-purple-600 to-purple-600/0 transform -translate-y-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: '1', title: 'Choose Career', desc: 'Select a path to explore' },
              { num: '2', title: 'Enter Scenario', desc: 'Real-world situation presented' },
              { num: '3', title: 'Make Decision', desc: 'Choose your action' },
              { num: '4', title: 'AI Tracks', desc: 'Behavior captured silently' },
              { num: '5', title: 'Score Generated', desc: 'Engagement calculated' },
              { num: '6', title: 'Update Profile', desc: 'Fingerprint refined' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center">
                  {/* Step Number */}
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 relative z-10 border-4 border-white shadow-lg"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)' }}
                  >
                    <span className="text-3xl font-bold text-purple-600">{step.num}</span>
                  </motion.div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-gray-900 font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-700 text-sm">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );

  // ===== SECTION 4: LIVE PREVIEW =====
  const PreviewSection = () => (
    <motion.section
      className="py-24 px-6 bg-purple-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            Live Simulation Preview
          </h2>
          <p className="text-gray-700">See exactly what the experience feels like</p>
        </motion.div>

        {/* Simulation Preview */}
        <motion.div
          className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-300 rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Preview Header */}
          <div className="bg-white border-b border-purple-200 px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold">SCENE PROGRESSION</p>
                <h3 className="text-2xl font-bold text-gray-900">Emergency Room – Scene 3 of 8</h3>
              </div>
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-400 rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Radio size={14} className="text-purple-600" />
                <span className="text-purple-700 text-xs font-semibold">AI TRACKING LIVE</span>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: '37.5%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Preview Content */}
          <div className="px-8 py-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-700 text-lg mb-12 leading-relaxed text-center">
                A 55-year-old patient arrives with chest pain and elevated blood pressure. Their vital signs show HR 102, BP 160/95, O2 98%. The ER is busy. What do you do?
              </p>

              {/* Decision Buttons */}
              <div className="space-y-4">
                {[
                  { letter: 'A', text: 'Run immediate EKG and troponin tests', risk: 'Safe' },
                  { letter: 'B', text: 'Assess patient lifestyle first (diet, stress)', risk: 'Moderate' },
                  { letter: 'C', text: 'Recommend hospital admission immediately', risk: 'Cautious' }
                ].map((choice, idx) => (
                  <motion.button
                    key={idx}
                    className="w-full text-left p-4 bg-white border border-purple-300 hover:border-purple-500 rounded-lg transition-all group shadow-sm"
                    whileHover={{ borderColor: '#7C3AED', scale: 1.02 }}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full border-2 border-purple-400 group-hover:border-purple-600 flex items-center justify-center bg-purple-100 group-hover:bg-purple-200 transition-all flex-shrink-0">
                        <span className="text-purple-700 font-bold">{choice.letter}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold mb-1">{choice.text}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          choice.risk === 'Safe' ? 'bg-green-100 text-green-700' :
                          choice.risk === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {choice.risk}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-purple-200">
              <div className="text-center">
                <p className="text-purple-600 font-bold">45s</p>
                <p className="text-gray-600 text-xs">Time Taken</p>
              </div>
              <div className="text-center">
                <p className="text-purple-600 font-bold">2x</p>
                <p className="text-gray-600 text-xs">Replays</p>
              </div>
              <div className="text-center">
                <p className="text-purple-600 font-bold">37%</p>
                <p className="text-gray-600 text-xs">Progress</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-sm">This is just a preview. Start a real simulation to experience live AI tracking.</p>
        </motion.div>
      </div>
    </motion.section>
  );

  // ===== SECTION 5: BEHAVIORAL INTELLIGENCE =====
  const BehavioralIntelligenceSection = () => (
    <motion.section
      className="py-24 px-6 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            We Measure Behavior.
          </h2>
          <p className="text-2xl text-purple-400 font-semibold">Not Preference.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT: Signals */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Behavioral Signals We Track</h3>

            <div className="space-y-6">
              {[
                { label: '⏱ Time Per Decision', desc: 'How quickly you decide reveals confidence' },
                { label: '🔁 Replay Count', desc: 'Replaying = genuine interest signal' },
                { label: '🖱 Click Speed', desc: 'Interaction patterns show decision-making style' },
                { label: '📍 Drop-off Point', desc: 'Where you quit tells us about fit' },
                { label: '📈 Accuracy Improvement', desc: 'Learning velocity as scenarios increase' },
                { label: '🎯 Risk-Taking Pattern', desc: 'Your tendency toward safe vs bold choices' },
                { label: '🔍 Exploration Depth', desc: 'How thoroughly you explore alternatives' }
              ].map((signal, idx) => (
                <motion.div
                  key={idx}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="w-1 bg-gradient-to-b from-purple-600 to-purple-700 rounded-full"></div>
                  <div>
                    <p className="text-gray-900 font-semibold">{signal.label}</p>
                    <p className="text-gray-500 text-sm">{signal.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Radar Chart Mock */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-sm aspect-square">
              {/* Radar Background */}
              <svg className="w-full h-full" viewBox="0 0 300 300">
                {/* Concentric circles */}
                {[1, 2, 3, 4, 5].map((ring) => (
                  <circle
                    key={ring}
                    cx="150"
                    cy="150"
                    r={ring * 30}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                ))}

                {/* Grid lines */}
                <line x1="150" y1="0" x2="150" y2="300" stroke="#7C3AED" strokeWidth="0.5" opacity="0.15" />
                <line x1="0" y1="150" x2="300" y2="150" stroke="#7C3AED" strokeWidth="0.5" opacity="0.15" />
                <line x1="50" y1="50" x2="250" y2="250" stroke="#7C3AED" strokeWidth="0.5" opacity="0.15" />
                <line x1="250" y1="50" x2="50" y2="250" stroke="#7C3AED" strokeWidth="0.5" opacity="0.15" />

                {/* Data polygon */}
                <motion.polygon
                  points="150,80 210,120 200,190 150,220 100,190 90,120"
                  fill="#7C3AED"
                  fillOpacity="0.2"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  initial={{ fillOpacity: 0.1 }}
                  whileInView={{ fillOpacity: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                />

                {/* Data points */}
                {[
                  { x: 150, y: 80, label: 'Analytical' },
                  { x: 210, y: 120, label: 'Creative' },
                  { x: 200, y: 190, label: 'Risk-Taking' },
                  { x: 150, y: 220, label: 'Structured' },
                  { x: 100, y: 190, label: 'Exploratory' },
                  { x: 90, y: 120, label: 'Persistent' }
                ].map((point, idx) => (
                  <g key={idx}>
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                        fill="#7C3AED"
                      animate={{ r: [6, 8, 6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                    />
                  </g>
                ))}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Cognitive</p>
                  <p className="text-purple-600 font-bold text-xl">Profile</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  // ===== SECTION 6: REPLAY IS PASSION =====
  const ReplayPassionSection = () => (
    <motion.section
      className="py-24 px-6 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            Replay = Passion
          </h2>
          <p className="text-xl text-gray-700">When students replay, we know they've found something real.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Single Attempt */}
          <motion.div
            className="bg-white border border-purple-300 rounded-lg p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Single Attempt</h3>
            <p className="text-gray-700 mb-6">Student completes simulation without replay</p>

            <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Interest Signal</span>
                  <span className="text-purple-600 font-bold">+10% Weight</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Domain Update</span>
                  <span className="text-purple-600 font-bold">Mild Boost</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Recommendation</span>
                  <span className="text-purple-600 font-bold">Consider Path</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">Baseline interest detected</p>
          </motion.div>

          {/* 3x Replay */}
          <motion.div
            className="bg-gradient-to-br from-purple-100 to-white border-2 border-purple-500 rounded-lg p-12 text-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ borderColor: '#7C3AED' }}
          >
            <div className="text-5xl mb-4">🔁🔁🔁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3x Replay</h3>
            <p className="text-gray-800 mb-6">Student replays multiple times, explores alternatives</p>

            <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-300">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">Interest Signal</span>
                  <span className="text-purple-600 font-bold">+20% Weight 🔥</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">Domain Update</span>
                  <span className="text-purple-600 font-bold">Strong Boost</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">Recommendation</span>
                  <span className="text-purple-600 font-bold">PRIORITY Path</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">Unlock</span>
                  <span className="text-purple-600 font-bold">Harder Version</span>
                </div>
              </div>
            </div>

            <p className="text-purple-700 font-semibold text-sm">Genuine passion detected. Career affinity high.</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  // ===== REMAINING SECTIONS (7-10) =====

  // Section 7: Drop-off Handling
  const DropoffSection = () => (
    <motion.section
      className="py-24 px-6 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            When a Student Quits, We Learn.
          </h2>
          <p className="text-gray-700 mb-8">Smart dropout handling that improves recommendations.</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-b from-white to-purple-100 border border-purple-300 rounded-lg p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-6 items-center">
            {/* Step 1 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 border border-purple-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏸</span>
              </div>
              <p className="text-gray-900 font-semibold">Drop</p>
              <p className="text-gray-700 text-sm">Student quits mid-simulation</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="hidden md:flex justify-center"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="text-purple-600" size={24} />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 border border-purple-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❓</span>
              </div>
              <p className="text-gray-900 font-semibold">Reason Captured</p>
              <p className="text-gray-700 text-sm">Why did they quit?</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="hidden md:flex justify-center"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              <ArrowRight className="text-purple-600" size={24} />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-600/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <p className="text-gray-900 font-semibold">Domain Adjusted</p>
              <p className="text-gray-600 text-sm">Weight delta applied</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="hidden md:flex justify-center"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            >
              <ArrowRight className="text-purple-600" size={24} />
            </motion.div>

            {/* Step 4 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-600/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-gray-900 font-semibold">New Path Suggested</p>
              <p className="text-gray-600 text-sm">Better recommendations</p>
            </motion.div>
          </div>

          {/* Reasons */}
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {[
              { reason: 'Too stressful', delta: '-10%' },
              { reason: 'Too boring', delta: '-15%' },
              { reason: 'Not interested', delta: '-25%' },
              { reason: 'Unsure - might retry', delta: '-3%' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 text-sm mb-2">{item.reason}</p>
                <p className="text-purple-600 font-bold">{item.delta}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );

  // Section 8: System Architecture
  const ArchitectureSection = () => (
    <motion.section
      className="py-24 px-6 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            Built Like a Real Intelligence System.
          </h2>
        </motion.div>

        <motion.div
          className="bg-white border border-purple-300 rounded-lg p-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            {[
              { icon: '🎮', label: 'Frontend', desc: 'React + Vite simulation UI' },
              { icon: '⚙️', label: 'Simulation Engine', desc: 'Real-time scenario logic & branching' },
              { icon: '📊', label: 'Event Tracking', desc: 'Redis + MongoDB timeseries' },
              { icon: '🧠', label: 'AI Layer', desc: 'Behavioral analysis & scoring' },
              { icon: '👤', label: 'Fingerprint Update', desc: 'Cognitive profile refinement' },
              { icon: '📂', label: 'Portfolio', desc: 'Student insights & career logs' }
            ].map((layer, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-6 p-6 bg-gradient-to-r from-purple-100 to-transparent border border-purple-300 rounded-lg hover:border-purple-500 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ borderColor: '#7C3AED' }}
              >
                <div className="text-4xl flex-shrink-0">{layer.icon}</div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-bold text-lg">{layer.label}</h3>
                  <p className="text-gray-700 text-sm">{layer.desc}</p>
                </div>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="text-purple-600" size={20} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 text-sm">All components run non-blocking · Target latency: &lt;100ms per decision</p>
        </motion.div>
      </div>
    </motion.section>
  );

  // Section 9: Security
  const SecuritySection = () => (
    <motion.section
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
            Behavior Data. Fully Secure.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: <Shield size={32} />, title: 'GDPR Compliant', desc: 'Full compliance with data protection regulations' },
            { icon: <Zap size={32} />, title: 'AES-256 Encryption', desc: 'Military-grade data encryption at rest & in transit' },
            { icon: <Radio size={32} />, title: 'No Data Sold', desc: 'Student behavioral data never sold to third parties' },
            { icon: <Shield className="-rotate-45" size={32} />, title: 'School-Level Access', desc: 'Institutional controls and audit logs' }
          ].map((security, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-purple-50 to-white border border-purple-300 rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-purple-600 mb-4">{security.icon}</div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{security.title}</h3>
              <p className="text-gray-700 text-sm">{security.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  // Section 10: Final CTA
  const FinalCTASection = () => (
    <motion.section
      className="py-24 px-6 bg-gradient-to-br from-purple-600 via-purple-650 to-purple-700 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Background animation - decorative blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Experience a Career Before Choosing One.
          </h2>

          <p className="text-xl text-white/90 mb-12 font-medium">
            Start your first behavioral simulation now. Discover careers that match your cognitive patterns, not just your interests.
          </p>

          <motion.button
            onClick={() => navigate('/simulation')}
            className="px-12 py-6 bg-white hover:bg-purple-50 text-purple-700 font-bold text-lg rounded-lg transition-all shadow-premium hover:shadow-premium-lg inline-flex items-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🎮 Start Your First Simulation
            <ArrowRight size={24} />
          </motion.button>

          <p className="text-white/70 text-sm mt-8 font-medium">Takes 10–15 minutes · No pressure · Premium experience</p>
        </motion.div>
      </div>
    </motion.section>
  );

  // ===== RENDER =====
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <PreviewSection />
      <BehavioralIntelligenceSection />
      <ReplayPassionSection />
      <DropoffSection />
      <ArchitectureSection />
      <SecuritySection />
      <FinalCTASection />
    </div>
  );
};

export default MCSSPage;
