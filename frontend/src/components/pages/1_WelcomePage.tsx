import React from 'react';
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
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <motion.h1 className="text-4xl font-medium mb-2 font-[var(--font-main)] shadow-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Goodreads Wrapped 2025
      </motion.h1>
      <motion.p className="text-md opacity-80 m-0 font-[var(--font-main)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Discover your reading year in review!
      </motion.p>
        
      <form onSubmit={onSubmit} className="p-4 rounded-xl my-8 text-left">
        <motion.div className="mb-6 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label htmlFor="username" className="block mb-2 font-bold font-[var(--font-main)] text-black">Goodreads Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="ex: 165807089-angelina"
            disabled={loading}
            className="w-full p-4 px-5 border border-black rounded-xl text-[1.1rem] font-[var(--font-main)] bg-[rgba(237,240,245,0.5)] text-black backdrop-blur-[10px] transition-all duration-300 focus:border-[rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_var(--color-vintage-accent-light)] focus:outline-none placeholder:text-[rgba(0,0,0,0.5)]"
          />
        </motion.div>
        <motion.button className="bg-[var(--color-vintage-accent)] text-white border border-white p-4 px-8 rounded-xl text-[1.1rem] font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-8 min-w-[150px] pointer-events-auto hover:bg-[var(--color-vintage-accent-light)] hover:-translate-y-0.5 disabled:bg-[var(--color-vintage-accent-disabled)] disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60 disabled:text-[rgba(0,0,0,0.5)] disabled:border-[rgba(0,0,0,0.5)]"
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
