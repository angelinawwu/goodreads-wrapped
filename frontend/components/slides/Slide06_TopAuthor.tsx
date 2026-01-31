'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  containerVariants,
  heroVariants,
  itemVariants,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import { getTopAuthor, formatAuthorName } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

export default function Slide06_TopAuthor({ stats, onAnimationComplete }: SlideProps) {
  const topAuthor = getTopAuthor(stats.books);

  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!topAuthor) {
    return null;
  }

  // Find the top author's book to get the author image (if available from RSS)
  const topAuthorBook = stats.books.find(book => book.author === topAuthor.name);
  // Fallback: if we don't have an author image from RSS, use a generic replacement image
  const authorImage = topAuthorBook?.authorImage ?? '/Goodreads-Image.png';

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <motion.h2 variants={itemVariants} className="text-headline text-center mb-4 font-bold">
        {formatAuthorName(topAuthor.name)}
      </motion.h2>

      <motion.p variants={itemVariants} className="text-body-lg text-center opacity-80">
        was your top author this year. You read {topAuthor.count} of their books.
      </motion.p>
    </motion.div>
  );
}
