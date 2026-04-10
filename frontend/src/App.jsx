import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth';

import LandingPagePremium from './pages/LandingPagePremium';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MCSSPage from './pages/MCSSPage';
import OnboardingPage from './pages/OnboardingPage';
import SimulationManager from './components/SimulationManager';

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  const user = getUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPagePremium />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
        <Route path="/mcss" element={<MCSSPage />} />
        <Route path="/simulation" element={<SimulationManager studentId={user?.id || 'demo'} />} />
      </Routes>
    </Router>
  );
}

export default App;
