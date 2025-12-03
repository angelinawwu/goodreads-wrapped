'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  heroVariants,
  itemVariants,
  stagedHeadline,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide13_BiggestHater({ stats, onAnimationComplete }: SlideProps) {
  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!stats.biggestHaterMoment) {
    return null;
  }

  const book = stats.biggestHaterMoment;
  const disparity = stats.biggestDisparity || 0;

  return (
    <motion.div
      className="min-h-screen flex flex-col mx-auto max-w-5xl items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center max-w-xl">
        <h2 className="text-headline mb-2 w-full">
          You gave <span className="font-bold">{book.title}</span> a rating of <span className="font-bold">{book.userRating}/5 stars.</span>{' '}
        </h2>
      </motion.div>
      {/* Book cover */}
      <motion.div
        variants={heroVariants}
        className="w-40 h-60 rounded shadow-2xl overflow-hidden my-8"
      >
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[var(--bg-5)] flex items-center justify-center text-5xl">
            📖
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="text-center max-w-xl">
        
        <p className="text-body-lg opacity-80">
          That's a full <span className="font-bold">{disparity.toFixed(2)}</span> stars less than
          the average. It's okay, we all have our hater moments.
        </p>
      </motion.div>
    </motion.div>
  );
}
