'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  stagedHeadline,
  stagedSubheadline,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide10_TBRIntro({ stats, onAnimationComplete }: SlideProps) {
  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="min-h-screen mx-auto max-w-5xl flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-4">
        You added a lot of books to your to-read shelf this year.
      </motion.h2>

      <motion.p variants={stagedSubheadline} className="text-body-lg text-center mb-4">
        Let's see how well you followed through on your TBR.
      </motion.p>
    </motion.div>
  );
}

