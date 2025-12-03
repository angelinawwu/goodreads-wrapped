'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  itemVariants,
  stagedHeadline,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide08_TopGenres({ stats, onAnimationComplete }: SlideProps) {
  const topFive = stats.topGenres.slice(0, 5);

  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
      hasStaggeredList: true,
      listItemCount: 5,
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
      <motion.h2 variants={stagedHeadline} className="text-headline text-center">
        Your top genres
      </motion.h2>

      <div className="w-full max-w-md space-y-4">
        {topFive.map((genre, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center justify-between p-3 px-6 bg-white/10 rounded-lg"
          >
            <div className="flex items-center gap-3 md:gap-2">
              <span className="font-[var(--font-display)] font-bold sm:text-display w-20 md:text-8xl">{i + 1}</span>
              <div>
                <div className="text-body-lg font-semibold">{genre.name}</div>
                <div className="text-sm opacity-70">{genre.count} books</div>
              </div>
            </div>
            <div className="text-body-lg font-bold">{genre.percentage.toFixed(1)}%</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
