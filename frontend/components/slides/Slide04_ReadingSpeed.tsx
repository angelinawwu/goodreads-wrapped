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

export default function Slide04_ReadingSpeed({ stats, onAnimationComplete }: SlideProps) {
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
      className="min-h-screen flex flex-col mx-auto max-w-4xl items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-4">
        How quickly did your books fly by?
      </motion.h2>

      <motion.p variants={stagedSubheadline} className="text-body-lg text-center mb-2">
        You spent an average of
      </motion.p>

      <motion.div variants={stagedMetric} className="text-display text-center mt-8 mb-4">
        <AnimatedCounter value={stats.averageReadingTime || 0} />
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center mb-8">
        days per book.
      </motion.p>

      {stats.slowestRead && stats.fastestRead && (
        <motion.div variants={stagedLabel} className="text-body-lg text-center opacity-80 max-w-2xl">
          <p>
            You spent the longest time on <span className="font-bold">{stats.slowestRead.title}</span> with{' '}
            <span className="font-bold">{stats.slowestRead.readingDays}</span> days and the shortest time on{' '}
            <span className="font-bold">{stats.fastestRead.title}</span> with{' '}
            <span className="font-bold">{stats.fastestRead.readingDays}</span> days.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
