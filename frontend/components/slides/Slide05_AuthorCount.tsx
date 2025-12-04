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
import { getTopAuthor } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

export default function Slide05_AuthorCount({ stats, onAnimationComplete }: SlideProps) {
  const topAuthor = getTopAuthor(stats.books);
  const uniqueAuthors = new Set(stats.books.map(b => b.author)).size;

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
        This year, you read the works of
      </motion.h2>

      <motion.div variants={stagedMetric} className="text-display text-center mt-8 mb-4">
        <AnimatedCounter value={uniqueAuthors} />
      </motion.div>

      <motion.p variants={stagedSubheadline} className="text-headline text-center mb-4">
        authors.
      </motion.p>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80">
        But this one was your favorite...
      </motion.p>
    </motion.div>
  );
}
