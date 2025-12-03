'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariantsSlow,
  stagedHeadline,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide16_Thanks({ stats, onAnimationComplete }: SlideProps) {
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
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={stagedHeadline} className="text-headline text-center px-4">
        Thanks for reading this year.
      </motion.h1>

      <motion.p variants={stagedHeadline} className="text-headline text-center mt-8 opacity-80">
        I'll see you in 2026.
      </motion.p>
    </motion.div>
  );
}
