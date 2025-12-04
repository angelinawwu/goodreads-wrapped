'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import AnimatedCounter from '../ui/AnimatedCounter';
import {
  containerVariantsSlow,
  stagedHeadline,
  stagedSubheadline,
  stagedMetric,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide07_GenreCount({ stats, onAnimationComplete }: SlideProps) {
  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
      hasCounter: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="min-h-screen mx-auto w-10/12 flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-4">
        From myths to manuscripts...
      </motion.h2>

      <motion.p variants={stagedSubheadline} className="text-body-lg text-center mt-8">
        You read
      </motion.p>

      <motion.div variants={stagedMetric} className="text-display text-center mt-8 mb-4">
        <AnimatedCounter value={stats.uniqueGenres} />
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center">
        genres this year.
      </motion.p>
    </motion.div>
  );
}
