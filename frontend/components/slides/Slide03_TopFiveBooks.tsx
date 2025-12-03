'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  itemVariants,
  stagedHeadline,
  stagedLabel,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import type { SlideProps } from '@/lib/types';

export default function Slide03_TopFiveBooks({ stats, onAnimationComplete }: SlideProps) {
  const topFive = stats.topRatedBooks.slice(0, 5);

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
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-8">
        Five books stood out.
      </motion.h2>

      {/* Diagonal overlapping book covers */}
      <div className="relative w-full max-w-md h-96 mb-8">
        {topFive.map((book, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="absolute w-32 h-48 rounded shadow-xl overflow-hidden z-[calc(var(--z-content)+{i})]"
            style={{
              left: `${i * 15}%`,
              top: `${i * 12}%`,
              transform: `rotate(${(i - 2) * 5}deg)`,
            }}
          >
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--bg-5)] flex items-center justify-center text-4xl">
                📖
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80">
        These were your top five books this year.
      </motion.p>

      <motion.p variants={stagedLabel} className="text-body-lg text-center opacity-80 mt-2">
        You've got good taste.
      </motion.p>
    </motion.div>
  );
}
