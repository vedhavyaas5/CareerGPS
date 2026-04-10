import React from 'react';
import { motion } from 'framer-motion';
import { Menu, LogOut, X } from 'lucide-react';
import { logout, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ isDashboard = false }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      className={`navbar transition-all duration-300 ${
        isScrolled ? 'shadow-md border-b border-purple-100' : ''
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.03 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md">
            <span style={{fontWeight:800, letterSpacing:'-0.03em'}}>CG</span>
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-lg hidden sm:inline tracking-tight">CareerGPS</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12 flex-1 justify-center">
          {isDashboard && user ? (
            <span className="text-secondary text-sm">Welcome, <span className="text-purple-600 font-semibold">{user.name}</span></span>
          ) : (
            <>
              <button className="nav-link">Features</button>
              <button className="nav-link">Platform</button>
              <button className="nav-link">For Schools</button>
              <button className="nav-link">Pricing</button>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {isDashboard && user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-purple-600 hover:text-white hover:bg-purple-100 transition-all duration-300 font-semibold"
              style={{border:'1.5px solid #7C3AED', background:'white'}}
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/login')}
                className="px-5 py-2 border border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-300 text-sm font-semibold"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/register')}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              >
                Start
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="lg:hidden pb-6 space-y-4 border-t border-purple-100 px-6 pt-4 bg-white shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {isDashboard && user ? (
            <>
              <p className="text-secondary text-sm px-6">Welcome, <span className='text-purple-600 font-semibold'>{user.name}</span></p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-2 text-purple-600 hover:text-white hover:bg-purple-100 font-semibold rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="w-full text-left px-6 py-2 text-purple-700 hover:bg-purple-50 rounded-lg">Features</button>
              <button className="w-full text-left px-6 py-2 text-purple-700 hover:bg-purple-50 rounded-lg">Platform</button>
              <button className="w-full text-left px-6 py-2 text-purple-700 hover:bg-purple-50 rounded-lg">For Schools</button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
