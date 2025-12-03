'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  stagedHeadline,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide14_FanIntro({ stats, onAnimationComplete }: SlideProps) {
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
      className="min-h-screen flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-8">
        Don't worry, it wasn't all bad.
      </motion.h2>
    </motion.div>
  );
}

