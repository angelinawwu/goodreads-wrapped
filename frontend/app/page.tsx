'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { containerVariants, itemVariants, popupVariants } from '@/lib/motionVariants';
import { Heart } from 'phosphor-react';

import { track } from '@vercel/analytics';


export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      router.push(`/wrapped/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--bg-1)] relative">
      {/* Heart icon in upper right corner */}
      <div className="fixed top-8 right-8 z-20" ref={popupRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }}
          className="text-[var(--text-1)] transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
          aria-label="About"
        >
          <Heart size={24}/>
        </button>
        
        {/* Popup with blur transition */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: 'transform, opacity, filter' }}
              className="absolute flex flex-col gap-4 top-8 right-2 w-64 p-4 bg-[var(--bg-4)] text-[var(--text-3)] rounded-lg shadow-lg text-sm z-30 origin-top-right"
            >
              <p>
                Goodreads Wrapped was made with lots of love by{' '}
                <a
                  href="https://angelinawwu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--bg-2)] transition-colors duration-200"
                  onClick={() => track('Clicked Portfolio Link')}
                >
                  Angelina Wu
                </a>
                . 
              </p>
              <p>Thank you for checking it out! :)</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="w-full max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

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
            className="w-full p-4 px-6 border-2 border-[var(--text-1)] rounded-full bg-transparent text-[var(--text-1)] placeholder:text-[var(--text-1)]/50 focus:outline-none focus:border-[var(--bg-4)] transition-all duration-200 ease-out focus:shadow-md"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full p-4 px-6 bg-[var(--bg-4)] text-[var(--text-3)] rounded-full font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
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
