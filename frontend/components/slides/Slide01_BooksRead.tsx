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
import { calculatePercentageMore } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

export default function Slide01_BooksRead({ stats, onAnimationComplete }: SlideProps) {
  const percentMore = calculatePercentageMore(stats.yearBooks);

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
      className="min-h-screen flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-4">
        You read a lot this year.
      </motion.h2>

      <motion.div variants={stagedMetric} className="text-display text-center my-8">
        <AnimatedCounter value={stats.yearBooks} />
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center mb-2">
        books
      </motion.p>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80">
        That's {percentMore}% more than the median American adult.
      </motion.p>
    </motion.div>
  );
}
