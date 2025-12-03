'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  heroVariants,
  itemVariants,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import { getTopAuthor } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

export default function Slide06_TopAuthor({ stats, onAnimationComplete }: SlideProps) {
  const topAuthor = getTopAuthor(stats.books);

  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!topAuthor) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Square author placeholder (could be actual image if available) */}
      <motion.div
        variants={heroVariants}
        className="w-48 h-48 rounded-lg bg-[var(--bg-5)] flex items-center justify-center text-6xl mb-8 shadow-xl"
      >
        ✍️
      </motion.div>

      <motion.h2 variants={itemVariants} className="text-headline text-center mb-4 font-bold">
        {topAuthor.name}
      </motion.h2>

      <motion.p variants={itemVariants} className="text-body-lg text-center opacity-80">
        was your top author this year. You read {topAuthor.count} of their books.
      </motion.p>
    </motion.div>
  );
}
