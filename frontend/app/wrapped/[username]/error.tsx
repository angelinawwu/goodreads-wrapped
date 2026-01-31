'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motionVariants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error loading wrapped:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-1)]">
      <motion.div
        className="text-center max-w-md px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-headline mb-4">
          Something went wrong
        </motion.h2>
        <motion.p variants={itemVariants} className="text-body-lg opacity-70 mb-8">
          {error.message || 'Failed to load your reading stats. Please try again.'}
        </motion.p>
        <motion.button
          variants={itemVariants}
          onClick={reset}
          className="px-8 py-3 bg-[var(--bg-4)] text-[var(--text-3)] rounded-full transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          Try again
        </motion.button>
      </motion.div>
    </div>
  );
}
