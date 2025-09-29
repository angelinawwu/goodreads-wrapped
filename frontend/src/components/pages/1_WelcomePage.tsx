import React from 'react';
import './1_WelcomePage.css';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  username: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  username,
  loading,
  onUsernameChange,
  onSubmit
}) => {
  return (
    <div className="page-container">
      <motion.h1 className="welcome-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Goodreads Wrapped 2025
      </motion.h1>
      <motion.p className="subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Discover your reading year in review!
      </motion.p>
        
      <form onSubmit={onSubmit} className="username-form">
        <motion.div className="input-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label htmlFor="username">Goodreads Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Enter your Goodreads username"
            disabled={loading}
          />
        </motion.div>
        <motion.button className="submit-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          type="submit"
          disabled={loading || !username.trim()}
        >
          {loading ? 'Analyzing...' : 'Get My Reading Stats'}
        </motion.button>
      </form>
    </div>
  );
};

export default WelcomePage;
