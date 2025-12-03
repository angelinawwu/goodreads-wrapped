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
import { getDependabilityMessage } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

export default function Slide11_Dependability({ stats, onAnimationComplete }: SlideProps) {
  const percentage = Math.round(stats.dependability * 100);
  const message = getDependabilityMessage(stats.dependability);

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
      className="min-h-screen flex flex-col mx-auto max-w-5xl items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={stagedSubheadline} className="text-body-lg text-center mb-2">
        You read
      </motion.p>

      <motion.div variants={stagedMetric} className="text-display text-center my-8">
        <AnimatedCounter value={percentage} />
        <span>%</span>
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center mb-4">
        of the books added to your shelves this year.
      </motion.p>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80 max-w-xl">
        {message}
      </motion.p>
    </motion.div>
  );
}
