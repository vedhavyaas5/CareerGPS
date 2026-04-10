import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { GlassCard, PurpleButton, PremiumCard } from '../components/UIComponents';
import { Gamepad2, BarChart3, Zap, Trophy, BookOpen, Sparkles, ChevronRight, Lightbulb, Target, Rocket } from 'lucide-react';
import { authAPI } from '../utils/api';
import { setToken, setUser } from '../utils/auth';

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      const response = await authAPI.demoLogin();
      setToken(response.data.token);
      setUser(response.data.user);
      const onboardingDone = localStorage.getItem('onboardingComplete');
      navigate(onboardingDone ? '/dashboard' : '/onboarding');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar />

      {/* Purple gradient animated background waves */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
        {/* ===== SECTION 1: HERO ===== */}
        <motion.section className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto text-center">
            {/* Animated top badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-300 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-xs sm:text-sm text-purple-700 font-500">AI-Powered Career Discovery</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Career Direction,
              </span>
              <br />
              <span className="text-gray-900">Not Career Confusion</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed font-500">
              Experience real careers before you decide. AI-guided simulations for Grades 8–10.
            </p>

            <p className="text-base sm:text-lg text-purple-600 font-600 mb-12">
              Experience Before You Decide
            </p>

            {/* CTA Buttons */}
            <motion.div className="flex gap-4 justify-center flex-wrap flex-col sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <PurpleButton onClick={() => navigate('/register')} className="px-8 py-3.5 text-base font-semibold group">
                <span className="flex items-center gap-2 justify-center">
                  🚀 Start Exploring
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </PurpleButton>
              <PurpleButton
                onClick={handleDemoLogin}
                disabled={loading}
                variant="outline"
                className="px-8 py-3.5 text-base font-semibold"
              >
                {loading ? '⏳ Loading...' : '🎬 Try Demo'}
              </PurpleButton>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 2: PROBLEM ===== */}
        <motion.section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20">
              <span className="text-purple-600">The Problem:</span> Career Exploration Happens Too Late
            </h2>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {[
                { stat: '70%', label: 'of students feel', detail: 'confused about career paths' },
                { stat: 'Grade 11+', label: 'guidance typically starts', detail: 'leaving 4+ years unexplored' },
                { stat: '0%', label: 'hands-on experience', detail: 'before college decisions' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white border border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-800 mb-6 group-hover:w-full transition-all duration-300 rounded-full"></div>
                  <p className="text-5xl font-bold text-purple-600 mb-3">{item.stat}</p>
                  <p className="text-gray-800 font-600">{item.label}</p>
                  <p className="text-sm text-gray-600 mt-2">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 3: SOLUTION ===== */}
        <motion.section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
              The Solution: Experience-First Learning
            </h2>
            <p className="text-center text-gray-600 mb-20 text-lg font-500">
              Real career simulations powered by AI recommendations
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Gamepad2, title: 'Interactive Simulations', desc: 'Complete real career tasks in a game-like environment' },
                { icon: BarChart3, title: 'Smart Analytics', desc: 'Track progress and see where your interests truly lie' },
                { icon: Target, title: 'AI Recommendations', desc: 'Get career paths matched to your actual behavior' },
                { icon: Trophy, title: 'Skill Tree System', desc: 'Level up skills and watch your capabilities grow' },
                { icon: BookOpen, title: 'Digital Portfolio', desc: 'Showcase completed projects to schools' },
                { icon: Zap, title: 'Engagement Tracking', desc: 'Our AI learns from your choices, not just surveys' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <PremiumCard key={i}>
                    <Icon size={32} className="text-purple-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </PremiumCard>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 4: HOW IT WORKS ===== */}
        <motion.section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20 text-gray-900">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: '01',
                  title: 'Sign Up & Explore',
                  desc: 'Create your free account and choose from diverse career simulations',
                  icon: Rocket,
                },
                {
                  step: '02',
                  title: 'Complete Simulations',
                  desc: 'Engage with realistic tasks, challenges, and decision-making scenarios',
                  icon: Lightbulb,
                },
                {
                  step: '03',
                  title: 'Get Insights',
                  desc: 'AI analyzes your behavior and recommends careers you\'ll actually enjoy',
                  icon: Target,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="bg-white border border-purple-200 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 h-full">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <p className="text-2xl font-bold text-white">{item.step}</p>
                      </div>
                      <Icon size={28} className="text-purple-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    {i < 2 && <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2"><ChevronRight size={24} className="text-purple-300" /></div>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 5: DASHBOARD PREVIEW ===== */}
        <motion.section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20 text-gray-900">Your Career Command Center</h2>

            <motion.div
              className="bg-gradient-to-br from-white via-purple-50/20 to-white border border-purple-200 rounded-3xl p-8 overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-4 bg-purple-200 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-purple-50 border border-purple-200 rounded-lg p-6 h-28 flex items-center justify-center">
                        <div className="w-12 h-12 bg-purple-300 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-center text-gray-600 mt-12 font-500">
              Track simulations completed, skills unlocked, and AI-generated career insights all in one place
            </p>
          </div>
        </motion.section>

        {/* ===== SECTION 6: IMPACT ===== */}
        <motion.section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20 text-gray-900">Student Impact</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { metric: '2x', label: 'Career Engagement', detail: 'vs traditional guidance' },
                { metric: '8 weeks', label: 'Portfolio Ready', detail: 'from first simulation' },
                { metric: '89%', label: 'Clarity Improvement', detail: 'in post-program surveys' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white border border-purple-200 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <p className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-4">
                    {item.metric}
                  </p>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.label}</h3>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 7: CTA ===== */}
        <motion.section
          className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-purple-200"
          variants={itemVariants}
        >
          <div className="w-full max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-100 via-white to-purple-50 border border-purple-300 rounded-3xl p-12 sm:p-16 lg:p-20 shadow-lg">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Ready to Explore <span className="text-purple-600">Your Path?</span>
              </h2>
              <p className="text-gray-700 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-500">
                Join thousands of students who've discovered their true career interests through AI-powered simulations.
              </p>

              <PurpleButton onClick={() => navigate('/register')} className="px-10 py-4 text-lg font-semibold mx-auto group">
                <span className="flex items-center gap-2 justify-center">
                  🚀 Start Your Journey
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </PurpleButton>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 8: MCSS CTA ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="py-24 px-6 sm:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-b from-white to-purple-50"
        >
          {/* Background gradient glow */}
          <div className="absolute inset-0 opacity-15">
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            ></motion.div>
          </div>

          <div className="w-full max-w-6xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              variants={itemVariants}
            >
              <div className="inline-block px-4 py-2 bg-purple-100 border border-purple-300 rounded-lg mb-6">
                <span className="text-purple-700 text-sm font-semibold">🎮 Next-Gen Career Discovery</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display">
                Step Inside a Real Career.
              </h2>

              <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
                Micro Career Simulation System (MCSS)
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto">
                10–15 minute immersive decision-based simulations powered by AI behavioral tracking. No quizzes. Just real decisions.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: '⏱', title: 'Time Tracked', desc: 'Silent behavioral analysis' },
                { icon: '🔁', title: 'Replays Matter', desc: 'Passion signals detected' },
                { icon: '🧠', title: 'AI Learning', desc: 'Cognitive patterns identified' },
                { icon: '🎯', title: 'Recommendations', desc: 'Personalized career paths' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gradient-to-br from-purple-100 to-white border border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-all shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <p className="text-gray-900 font-semibold mb-2">{feature.title}</p>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Main CTA */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={() => navigate('/mcss')}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-600/50 mx-auto mb-6"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124, 58, 237, 0.7)' }}
                whileTap={{ scale: 0.95 }}
              >
                🎮 Launch Micro Career Simulation
                <ChevronRight size={22} />
              </motion.button>

              <p className="text-gray-600 text-sm">Discover your cognitive profile · 10–15 minutes · No pressure</p>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 9: FOOTER ===== */}
        <footer className="border-t border-purple-200 py-16 px-6 sm:px-8 lg:px-12 mt-20 bg-gradient-to-b from-white to-purple-50">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
              <div>
                <h3 className="font-bold text-purple-600 text-lg mb-2">CareerGPS</h3>
                <p className="text-sm text-gray-600">Experience-first career discovery for next generation</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Sri Ramachandra Institute</h3>
                <p className="text-sm text-gray-600">TECH-IDEATHON 2026 | Innovation for Tomorrow</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Made by Team Future Foundry</h3>
                <p className="text-sm text-gray-600">Lead: M Vedhavyaas</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-12"></div>

            <div className="text-center text-sm text-gray-600">
              <p>© 2026 CareerGPS. All rights reserved. | Premium AI-Powered Career Platform</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;
