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
    <div className="page-container flex flex-col w-full items-center justify-left min-h-[60vh] pt-28 relative z-20">
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
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Discover your reading year in review!
      </motion.p>
        
      <form onSubmit={onSubmit} className="p-4 rounded-xl my-8 text-left w-full">
        <motion.div className="mb-4 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label htmlFor="username" className="text-md block mb-1 font-medium font-[var(--font-main)] text-black">Goodreads Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="ex: 165807089-angelina"
            disabled={loading}
            className="w-full p-2 px-4 border border-black rounded-lg text-md font-[var(--font-main)] bg-[var(--color-vintage-light)] text-[var(--color-vintage-text)] focus:outline-none placeholder:text-[rgba(0,0,0,0.5)]"
          />
        </motion.div>
        <motion.button className="bg-[var(--color-vintage-accent)] text-white p-2 px-4 rounded-lg text-md font-[var(--font-main)] pointer-events-auto hover:scale-101 hover:bg-[var(--color-vintage-accent-light)] active:scale-99 hover:transition-[background-color,transform] hover:duration-200 active:transition-transform active:duration-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
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
