'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import AnimatedCounter from '../ui/AnimatedCounter';
import {
  containerVariantsSlow,
  stagedHeadline,
  stagedSubheadline,
  stagedMetric,
  stagedLabel,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide02_AverageRating({ stats, onAnimationComplete }: SlideProps) {
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
      className="min-h-screen mx-auto max-w-4xl flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-4">
        On average, you rated these books
      </motion.h2>

      <motion.div variants={stagedMetric} className="text-display text-center mt-8 mb-4">
        <AnimatedCounter value={stats.averageRating} decimals={1} />
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center mb-4">
        stars.
      </motion.p>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80">
        There were some gems in there.
      </motion.p>
    </motion.div>
  );
}
