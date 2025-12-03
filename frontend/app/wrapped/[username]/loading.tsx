'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motionVariants';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-1)]">
      <motion.div
        className="text-center max-w-md px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-headline mb-4">
          Loading your reading year in review...
        </motion.h2>
        <motion.p variants={itemVariants} className="text-body-lg opacity-70">
          This may take a few minutes.
        </motion.p>

        {/* Loading spinner */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center"
        >
          <div className="w-12 h-12 border-4 border-[var(--text-1)]/20 border-t-[var(--bg-4)] rounded-full animate-spin" />
        </motion.div>
      </motion.div>
    </div>
  );
}
