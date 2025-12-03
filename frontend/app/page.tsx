'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motionVariants';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      router.push(`/wrapped/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--bg-1)]">
      <motion.div
        className="w-full max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <motion.h2 variants={itemVariants} className="text-headline mb-8">
          Goodreads Wrapped 2025
        </motion.h2>

        <motion.p variants={itemVariants} className="text-body-lg mb-12 opacity-80">
          Your reading year, wrapped.
        </motion.p>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Goodreads username"
            className="w-full p-4 px-6 border-2 border-[var(--text-1)] rounded-full bg-transparent text-[var(--text-1)] placeholder:text-[var(--text-1)]/50 focus:outline-none focus:border-[var(--bg-4)] transition-colors"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full p-4 px-6 bg-[var(--bg-4)] text-[var(--text-3)] rounded-full font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'Loading...' : 'Get My Wrapped'}
          </button>
        </motion.form>

        <motion.p variants={itemVariants} className="text-sm opacity-60 mt-8">
          This may take a few minutes to generate
        </motion.p>
      </motion.div>
    </div>
  );
}
