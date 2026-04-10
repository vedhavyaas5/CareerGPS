import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { PurpleButton } from '../components/UIComponents';
import { authAPI } from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { ChevronLeft, Sparkles } from 'lucide-react';

const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    grade: 9,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      setToken(response.data.token);
      setUser(response.data.user);

      // New users go to onboarding, returning users go to dashboard
      if (isLogin) {
        const onboardingDone = localStorage.getItem('onboardingComplete');
        navigate(onboardingDone ? '/dashboard' : '/onboarding');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar />

      {/* Purple gradient animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          {/* Animated badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-300 mb-8 mx-auto block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-xs text-purple-700 font-semibold">{isLogin ? 'Return to CareerGPS' : 'Join the Future'}</span>
          </motion.div>

          {/* Premium card container */}
          <div className="bg-white backdrop-blur border border-purple-200 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300 shadow-sm">
            {/* Header accent bar */}
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-700 mb-8 rounded-full"></div>

            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
            </h1>
            <p className="text-gray-600 mb-8">
              {isLogin ? 'Login to continue exploring careers' : 'Join thousands discovering their perfect career'}
            </p>

            {/* Error message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Grade</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-900"
                    >
                      <option value={8}>Grade 8</option>
                      <option value={9}>Grade 9</option>
                      <option value={10}>Grade 10</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <PurpleButton
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 text-lg font-semibold mt-6"
              >
                {loading ? '⏳ Loading...' : isLogin ? '🔓 Sign In' : '🚀 Create Account'}
              </PurpleButton>
            </form>

            {/* Toggle auth mode */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => navigate(isLogin ? '/register' : '/login')}
                  className="text-purple-600 hover:text-purple-700 transition-colors font-semibold inline-flex items-center gap-1"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                  <ChevronLeft size={14} className="inline" />
                </button>
              </p>
            </div>
          </div>

          {/* Back to home link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm inline-flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
