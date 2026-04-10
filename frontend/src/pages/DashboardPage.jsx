import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { PremiumCard, SkillBadge, PurpleButton } from '../components/UIComponents';
import { Gamepad2, TrendingUp, Zap, Award, Home, BarChart3, TreePine, Settings, LogOut, Menu, X, Bell, Search, User } from 'lucide-react';
import { simulationAPI, engagementAPI, recommendationAPI } from '../utils/api';
import { getUser, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const simRes = await simulationAPI.getAll();
        setSimulations(simRes.data);

        if (user && user.id !== 'demo-user-123') {
          const analyticsRes = await engagementAPI.getAnalytics(user.id);
          setAnalytics(analyticsRes.data);

          const recRes = await recommendationAPI.getForUser(user.id);
          setRecommendations(recRes.data);
        } else {
          setAnalytics({
            totalTimeSpent: 45,
            totalRetries: 12,
            averageScore: 78,
            completedSimulations: 3,
            totalEngagementIndex: 85,
          });
          setRecommendations({
            topSkills: ['UI Design', 'Problem Solving', 'Communication'],
            recommendedCareers: ['UX Designer', 'Product Manager', 'Frontend Developer'],
            engagementIndex: 85,
            improvementTrend: 'Positive ↗',
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'simulations', label: 'Simulations', icon: Gamepad2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'skills', label: 'Skill Tree', icon: TreePine },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-main">
        <Navbar isDashboard={true} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-purple-600 text-xl">
            ⏳ Loading dashboard...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar isDashboard={true} />

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -320 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex w-80 bg-white border-r border-purple-200 flex-col p-6 shadow-sm"
        >
          {/* Logo */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-purple-600">CareerGPS</h2>
            <p className="text-xs text-gray-600 mt-1">Experience Before You Decide</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-purple-100 border border-purple-400 text-purple-700 font-semibold shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="space-y-3 border-t border-purple-200 pt-6">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-semibold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 md:w-[calc(100%-320px)]">
          {/* Top bar on mobile */}
          <div className="md:hidden flex items-center gap-4 px-6 py-4 border-b border-purple-200 bg-white shadow-sm">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-purple-100 rounded-lg">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-lg font-bold text-purple-600">CareerGPS</div>
            <div className="ml-auto flex gap-2">
              <Bell size={20} className="text-gray-600 cursor-pointer hover:text-purple-600" />
              <User size={20} className="text-gray-600 cursor-pointer hover:text-purple-600" />
            </div>
          </div>

          {/* Top bar on desktop */}
          <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-purple-200 bg-white shadow-sm">
            <div className="flex-1 flex items-center gap-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 max-w-sm">
              <Search size={18} className="text-purple-500" />
              <input type="text" placeholder="Search simulations..." className="bg-transparent outline-none text-gray-900 placeholder-purple-400 flex-1 text-sm" />
            </div>
            <div className="flex items-center gap-4 ml-8">
              <Bell size={20} className="text-purple-500 cursor-pointer hover:text-purple-700 transition-colors" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8 md:p-12">
              <div className="w-full max-w-6xl mx-auto">
                {/* Welcome Section */}
                {activeTab === 'dashboard' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <div className="flex justify-between items-start gap-8 flex-col md:flex-row">
                      <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text-purple">Welcome back, {user?.name}! 👋</h1>
                        <p className="text-gray-600 font-medium text-lg">Grade {user?.grade} • Continue your career exploration journey</p>
                      </div>
                      <motion.div className="text-right flex-shrink-0 card-premium bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-premium" whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(124, 58, 237, 0.15)' }}>
                        <div className="flex flex-col items-end">
                          <span className="text-5xl md:text-6xl font-black gradient-text-purple">
                            {analytics?.totalEngagementIndex || 0}
                          </span>
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-block mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 font-bold text-xs shadow-sm border border-purple-200">🏆 Level 3 – Explorer</motion.span>
                          <p className="text-sm text-gray-600 mt-3 font-semibold">Engagement Score</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Stats Section */}
                    <div>
                      <h3 className="text-2xl font-bold mb-8 gradient-text-purple">Your Progress</h3>
                      <div className="grid md:grid-cols-4 gap-6">
                        {[
                          { label: 'Time Spent', value: `${analytics?.totalTimeSpent || 0}m`, icon: TrendingUp },
                          { label: 'Avg Score', value: `${analytics?.averageScore || 0}%`, icon: Award },
                          { label: 'Completed', value: analytics?.completedSimulations || 0, icon: Zap },
                          { label: 'Retries', value: analytics?.totalRetries || 0, icon: Gamepad2 },
                        ].map((stat, i) => {
                          const StatIcon = stat.icon;
                          return (
                            <motion.div
                              key={i}
                              className="card-premium bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-premium hover:shadow-premium-lg border border-purple-100 cursor-pointer"
                              whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(124, 58, 237, 0.15)' }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <motion.div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 to-purple-500 mb-6 rounded-full" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }} />
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-4 border border-purple-200">
                                <StatIcon size={24} className="text-purple-600" />
                              </div>
                              <p className="text-4xl font-black gradient-text-purple mb-2">{stat.value}</p>
                              <p className="text-sm text-gray-700 font-semibold">{stat.label}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    {recommendations && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h3 className="text-2xl font-bold mb-8 gradient-text-purple">🤖 AI Recommendations</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <motion.div className="card-premium bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-premium hover:shadow-premium-lg border border-purple-100" whileHover={{ y: -4 }}>
                            <h4 className="font-bold mb-6 text-lg gradient-text-purple">⚡ Top Skills</h4>
                            <div className="flex flex-wrap gap-3">
                              {recommendations.topSkills.map((skill, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                                  <SkillBadge label={skill} />
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                          <motion.div className="card-premium bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-premium hover:shadow-premium-lg border border-purple-100" whileHover={{ y: -4 }}>
                            <h4 className="font-bold mb-6 text-lg gradient-text-purple">🎯 Recommended Careers</h4>
                            <div className="space-y-3">
                              {recommendations.recommendedCareers.map((career, i) => (
                                <motion.div key={i} className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-premium transition-all cursor-pointer group" whileHover={{ x: 4, boxShadow: '0 10px 30px rgba(124, 58, 237, 0.15)' }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                  <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{career}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Simulations Tab */}
                {activeTab === 'simulations' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <h2 className="text-3xl font-bold gradient-text-purple">🎮 Career Simulations</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {simulations.length > 0 ? (
                    simulations.map((sim) => (
                      <PremiumCard key={sim._id}>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg flex-1 text-gray-900">{sim.title}</h3>
                          <span className="text-xs bg-purple-100 px-2 py-1 rounded-full text-purple-700 border border-purple-300">
                            {sim.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{sim.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">⏱️ {sim.duration} mins</span>
                          <button className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-all" onClick={() => alert('Simulation engine coming soon!')}>
                            Start
                          </button>
                        </div>
                      </PremiumCard>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-white border border-purple-200 rounded-2xl shadow-sm">
                      <p className="text-gray-700">No simulations available yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text-purple">📊 Your Analytics</h2>
                <motion.div className="card-premium bg-gradient-to-br from-white via-purple-50 to-white rounded-2xl p-16 text-center shadow-premium border border-purple-100" whileHover={{ y: -4 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div className="text-7xl mb-8 inline-block animate-float">📈</motion.div>
                  <p className="text-gray-700 mb-6 font-semibold text-lg">Complete more simulations to unlock detailed analytics and insights</p>
                  <p className="text-gray-600 font-medium text-base">Your behavioral patterns, engagement metrics, and career affinity scores will appear here</p>
                </motion.div>
              </motion.div>
            )}

            {/* Skill Tree Tab */}
            {activeTab === 'skills' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h2 className="text-3xl font-bold gradient-text-purple">🌳 Skill Tree</h2>
                <motion.div className="card-premium bg-gradient-to-br from-white via-purple-50 to-white rounded-2xl p-16 text-center shadow-premium border border-purple-100" whileHover={{ y: -4 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div className="text-7xl mb-8 inline-block animate-float" style={{ animationDelay: '0.2s' }}>🌳</motion.div>
                  <p className="text-gray-700 mb-6 font-semibold text-lg">Complete simulations to unlock new skills and level up</p>
                  <p className="text-gray-600 font-medium text-base">Your skill progression, mastery levels, and achievement badges will appear here</p>
                </motion.div>
              </motion.div>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-200 flex justify-around items-center h-20 shadow-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors ${
                activeTab === item.id ? 'text-purple-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
