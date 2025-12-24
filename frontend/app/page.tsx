'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motionVariants';
import { Heart } from 'phosphor-react';

import { track } from '@vercel/analytics';


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
        <motion.div variants={itemVariants} className="fixed top-0 right-0 w-full h-full z-10">
          <motion.div variants={itemVariants} className="w-full h-full flex items-end">
            <Heart size={100} weight="fill" className="text-[var(--bg-4)]" />
          </motion.div>
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-headline mb-4">
          Goodreads Wrapped 2025
        </motion.h2>

        <motion.p variants={itemVariants} className="text-body-lg mb-12 opacity-80">
          Your reading year, wrapped.
        </motion.p>

        <motion.p variants={itemVariants} className="text-body mb-4 text-left opacity-80">
          Enter your <span className="font-bold">8- or 9-digit Goodreads ID</span> to begin. 
          You can find your ID in your Goodreads profile URL.
        </motion.p>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ex: 165807089"
            className="w-full p-4 px-6 border-2 border-[var(--text-1)] rounded-full bg-transparent text-[var(--text-1)] placeholder:text-[var(--text-1)]/50 focus:outline-none focus:border-[var(--bg-4)] transition-colors"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full p-4 px-6 bg-[var(--bg-4)] text-[var(--text-3)] rounded-full font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={() => track('Created Wrapped')}
          >
            {isLoading ? 'Loading...' : 'Get My Wrapped'}
          </button>
        </motion.form>

        <motion.p variants={itemVariants} className="text-sm opacity-60 mt-4">
          Make sure your Goodreads account is public
        </motion.p>
      </motion.div>
    </div>
  );
}
