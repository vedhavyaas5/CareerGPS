import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { GlassCard, PurpleButton, PremiumCard } from '../components/UIComponents';
import { Gamepad2, BarChart3, Zap, Trophy, BookOpen, Sparkles, ChevronRight, Lightbulb, Target, Rocket, TrendingUp, Brain, Award, Users, Star, CheckCircle, Globe, Cpu } from 'lucide-react';
import { authAPI } from '../utils/api';
import { setToken, setUser } from '../utils/auth';

const LandingPagePremium = () => {
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

  const floatingVariants = {
    initial: { y: 0 },
    animate: { y: [-10, 10, -10], transition: { duration: 4, repeat: Infinity } },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar />

      {/* Premium layered background with multiple gradient blobs */}
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Subtle diagonal lines texture */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(124,58,237,0.1) 40px, rgba(124,58,237,0.1) 80px)'
      }}></div>

      <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
        
        {/* ===== SECTION 1: PREMIUM TWO-COLUMN HERO ===== */}
        <motion.section className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20 relative overflow-hidden" variants={itemVariants}>
          <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            
            {/* LEFT COLUMN: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="order-2 md:order-1"
            >
              {/* Animated top badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={16} className="text-purple-600 animate-pulse" />
                <span className="text-xs sm:text-sm text-purple-700 font-600">🎮 AI-Powered Career Discovery</span>
              </motion.div>

              {/* Main heading with gradient highlight */}
              <motion.h1
                className="text-5xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="block text-gray-900">Experience</span>
                <span className="block bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">Career Paths</span>
                <span className="block text-gray-900">Before You Decide</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-xl font-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                AI-guided simulations help middle school students explore 30+ careers through real-world scenarios. Make informed decisions with behavior-based insights, not guesses.
              </motion.p>

              {/* Key stats */}
              <motion.div
                className="flex gap-6 mb-10 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <p className="text-3xl font-bold text-purple-600">30+</p>
                  <p className="text-sm text-gray-600">Careers to Explore</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">50K+</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">92%</p>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex gap-4 mb-12 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <PurpleButton 
                  onClick={() => navigate('/register')} 
                  className="px-8 py-4 text-base font-bold group shadow-lg shadow-purple-300/40 hover:shadow-purple-400/60"
                >
                  <span className="flex items-center gap-2 justify-center">
                    🚀 Start Free Trial
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </PurpleButton>
                <PurpleButton
                  onClick={handleDemoLogin}
                  disabled={loading}
                  variant="outline"
                  className="px-8 py-4 text-base font-bold"
                >
                  {loading ? '⏳ Loading...' : '🎬 Try Live Demo'}
                </PurpleButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="pt-8 border-t border-purple-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-xs text-gray-600 font-600 mb-4 uppercase tracking-wider">Trusted by:</p>
                <div className="flex gap-4 flex-wrap items-center">
                  {['🏫 CBSE Schools', '📱 50K+ Students', '🌟 4.9★ Rating'].map((badge, i) => (
                    <div key={i} className="px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-sm font-500 text-gray-700">
                      {badge}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN: Dashboard Mockup with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="order-1 md:order-2 hidden md:block"
            >
              <div className="relative h-96 md:h-full">
                {/* Main dashboard card */}
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 rounded-3xl border border-purple-200 overflow-hidden shadow-2xl shadow-purple-300/20"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4">
                      <div className="h-2 w-16 bg-purple-600 rounded-full mb-2"></div>
                      <p className="text-sm font-bold text-gray-900">Career Fingerprint</p>
                    </div>
                    <div className="space-y-3 flex-1">
                      {['Analytical', 'Creative', 'Strategic'].map((skill, i) => (
                        <div key={i}>
                          <p className="text-xs text-gray-700 font-600 mb-1">{skill}</p>
                          <div className="h-1.5 bg-purple-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                              style={{ width: `${75 - i * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating XP Card */}
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.1 }}
                  className="absolute top-12 right-0 w-40 bg-white rounded-2xl p-4 shadow-lg shadow-purple-300/20 border border-purple-100 hover:shadow-purple-400/30 cursor-pointer transition-shadow"
                >
                  <p className="text-xs text-gray-600 font-600 mb-2">XP Earned</p>
                  <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">+120</p>
                  <p className="text-xs text-gray-500 mt-1">Healthcare Sim</p>
                </motion.div>

                {/* Floating Badge Card */}
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.25 }}
                  className="absolute bottom-12 left-0 w-44 bg-white rounded-2xl p-4 shadow-lg shadow-purple-300/20 border border-purple-100 hover:shadow-purple-400/30 cursor-pointer transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                      <span className="text-xl">🏆</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-600">Badge Unlocked</p>
                      <p className="text-sm font-bold text-gray-900">Level 3 Explorer</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Progress Card */}
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.15 }}
                  className="absolute top-40 -left-4 w-52 bg-white rounded-2xl p-4 shadow-lg shadow-purple-300/20 border border-purple-100 hover:shadow-purple-400/30 cursor-pointer transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600 font-600">Healthcare Path</p>
                    <span className="text-sm font-bold text-purple-600">32%</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-1/3"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 2: SOCIAL PROOF ===== */}
        <motion.section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-purple-50" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Schools & Students</h2>
              <p className="text-gray-600 text-lg">Join thousands making informed career decisions</p>
            </motion.div>

            {/* School Logos */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 items-center justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {['DPS Delhi', 'Ryan International', 'Vidya School', 'Cathedral School'].map((school, i) => (
                <div key={i} className="h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <span className="text-sm font-bold text-gray-700">{school}</span>
                </div>
              ))}
            </motion.div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Priya Sharma',
                  role: 'Student, Grade 9',
                  text: 'CareerGPS helped me understand that I actually want to be a data scientist. The simulations felt so real!',
                  avatar: '👩‍🎓',
                },
                {
                  name: 'Mr. Amit Patel',
                  role: 'Career Counselor',
                  text: 'Finally, a tool that gives students actual experience instead of just questionnaires. Game-changer for guidance.',
                  avatar: '👨‍🏫',
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg shadow-purple-100/40 hover:shadow-purple-200/60 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={16} className="fill-purple-600 text-purple-600" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 font-500 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 3: PREMIUM FEATURES GRID ===== */}
        <motion.section className="py-24 px-6 sm:px-8 lg:px-12 bg-white" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Platform for Career Discovery</h2>
              <p className="text-gray-600 text-lg">Everything you need to explore careers with confidence</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Gamepad2, title: 'Interactive Simulations', desc: 'Complete real career tasks in immersive scenarios' },
                { icon: Brain, title: 'AI Recommendations', desc: 'Get personalized paths based on your actual behavior' },
                { icon: BarChart3, title: 'Smart Analytics', desc: 'Track your growth across 7 behavioral dimensions' },
                { icon: Trophy, title: 'Gamified Learning', desc: 'Level up, unlock badges, and compete with peers' },
                { icon: BookOpen, title: 'Digital Portfolio', desc: 'Showcase completed projects to schools' },
                { icon: Target, title: 'Skill Development', desc: 'Progress tracking for 50+ in-demand skills' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 border border-purple-200 hover:border-purple-400 shadow-lg shadow-purple-100/20 hover:shadow-purple-300/40 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-600 to-purple-400 mt-4 group-hover:w-full transition-all rounded-full"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 4: HOW IT WORKS - PREMIUM TIMELINE ===== */}
        <motion.section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-purple-50 to-white" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works in 4 Steps</h2>
              <p className="text-gray-600 text-lg">Your journey from curiosity to career clarity</p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300 hidden md:block"></div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { num: '1', icon: '🔍', title: 'Discover', desc: 'Browse 30+ careers and find what interests you' },
                  { num: '2', icon: '🎮', title: 'Simulate', desc: 'Experience real career scenarios in minutes' },
                  { num: '3', icon: '📊', title: 'Analyze', desc: 'Get AI insights into your strengths' },
                  { num: '4', icon: '🎯', title: 'Decide', desc: 'Make informed career choices with confidence' },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-6 relative z-10 border-4 border-white shadow-lg shadow-purple-400/30"
                      whileHover={{ scale: 1.15 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-700 text-sm">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 5: ANALYTICS PREVIEW ===== */}
        <motion.section className="py-24 px-6 sm:px-8 lg:px-12 bg-white" variants={itemVariants}>
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">See Your Growth in Real-Time</h2>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Our advanced analytics system tracks 7 behavioral dimensions across career simulations. Watch your skills improve and get actionable insights.
                </p>
                <ul className="space-y-4">
                  {['Decision-Making Speed', 'Risk Assessment', 'Problem Solving', 'Communication Skills'].map((skill, i) => (
                    <motion.li key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                      <CheckCircle size={20} className="text-purple-600 flex-shrink-0" />
                      <span className="text-gray-800 font-500">{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-200 p-8 shadow-xl shadow-purple-200/20"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-bold text-gray-700 mb-6">📊 Sample Analytics Dashboard</p>
                <div className="space-y-6">
                  {[
                    { label: 'Decision Speed', value: 78, color: 'from-purple-600' },
                    { label: 'Risk Taking', value: 62, color: 'from-purple-500' },
                    { label: 'Creativity', value: 85, color: 'from-purple-400' },
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-600 text-gray-700">{metric.label}</span>
                        <span className="text-sm font-bold text-purple-600">{metric.value}%</span>
                      </div>
                      <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${metric.color} to-purple-600`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          transition={{ delay: i * 0.2 + 0.3, duration: 0.8 }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 6: FINAL CTA ===== */}
        <motion.section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-purple-600 to-purple-700 relative overflow-hidden" variants={itemVariants}>
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
          </div>

          <div className="w-full max-w-4xl mx-auto text-center relative z-10">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Start Exploring Careers Today
            </motion.h2>
            <motion.p
              className="text-xl text-purple-100 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Free trial, no credit card required. Start in 2 minutes.
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
              >
                🚀 Get Started Free
              </button>
              <button
                onClick={handleDemoLogin}
                className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                🎬 Try Live Demo
              </button>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default LandingPagePremium;
