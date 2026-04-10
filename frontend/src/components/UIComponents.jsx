import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(124, 58, 237, 0.10)' }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-purple-100 rounded-2xl p-8 hover:border-purple-300/60 transition-all duration-300 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const PurpleButton = ({ children, onClick, className = '', variant = 'solid', disabled = false }) => {
  const baseClass = 'px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-sm inline-flex items-center justify-center whitespace-nowrap';
  
  if (variant === 'outline') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClass} border-2 border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, boxShadow: '0 4px 16px rgba(124, 58, 237, 0.20)' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Alias for backwards compatibility
export const RedButton = PurpleButton;

export const SkillBadge = ({ label, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08, boxShadow: '0 2px 12px rgba(124, 58, 237, 0.15)' }}
      className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer shadow-sm"
    >
      {Icon && <Icon size={16} className="text-purple-600 flex-shrink-0" />}
      <span className="text-sm font-semibold text-purple-700">{label}</span>
    </motion.div>
  );
};

export const StatCard = ({ label, value, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(124, 58, 237, 0.10)' }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-purple-100 rounded-2xl p-8 hover:border-purple-300/60 transition-all duration-300 text-center shadow-sm"
    >
      <div className="h-1 w-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mb-6 mx-auto"></div>
      {Icon && <Icon size={36} className="mx-auto mb-4 text-purple-600" />}
      <p className="text-secondary text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-main">{value}</p>
    </motion.div>
  );
};

export const PremiumCard = ({ children, title, description, icon: Icon, onClick }) => {
  // If children are provided, use them instead
  if (children) {
    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)' }}
        onClick={onClick}
        className="bg-white border border-purple-100 rounded-2xl p-8 hover:border-purple-300/60 cursor-pointer transition-all duration-300 group shadow-sm"
      >
        <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-700 mb-6 group-hover:w-full transition-all duration-300"></div>
        {children}
      </motion.div>
    );
  }

  // Standard card layout
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)' }}
      onClick={onClick}
      className="bg-white border border-purple-100 rounded-2xl p-8 hover:border-purple-300/60 cursor-pointer transition-all duration-300 group shadow-sm"
    >
      <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-700 mb-6 group-hover:w-full transition-all duration-300"></div>
      {Icon && <Icon size={32} className="text-purple-600 mb-4" />}
      <h3 className="text-lg font-bold text-main mb-2">{title}</h3>
      <p className="text-secondary text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
