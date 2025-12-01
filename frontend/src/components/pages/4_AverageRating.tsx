import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import {
  containerVariantsSlow,
  itemVariants,
  stagedHeadline,
  stagedSubheadline,
  stagedMetric,
  stagedLabel,
} from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface AverageRatingProps {
  averageRating?: number;
  booksWithRatings?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const AverageRating: React.FC<AverageRatingProps> = ({ 
  averageRating = 0, 
  booksWithRatings = 0, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <motion.div 
      className="pt-64 px-8"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-2xl font-medium mb-2 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={stagedHeadline}
          initial="hidden"
          animate="visible"
        >
          Average Rating
        </motion.h2>
        <motion.p 
          className="text-lg opacity-80 m-0 font-[var(--font-main)]"
          variants={stagedSubheadline}
          initial="hidden"
          animate="visible"
        >
          Your average rating for 2025 books
        </motion.p>
      </motion.div>
      <div className="my-8 text-center">
        <motion.div 
          className="text-6xl font-medium m-0 text-[var(--color-vintage-accent)] font-[var(--font-display)] shadow-none"
          variants={stagedMetric}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCounter value={averageRating} decimals={2} />
        </motion.div>
        <motion.div 
          className="text-lg mt-2 opacity-90 font-[var(--font-main)] text-black"
          variants={stagedLabel}
          initial="hidden"
          animate="visible"
        >
          out of 5 stars
        </motion.div>
      </div>
      <motion.div 
        className="mt-4 opacity-80 text-lg font-[var(--font-main)] text-black text-center"
        variants={itemVariants}
      >
        <p className="m-0 font-[var(--font-main)]">
          Based on <AnimatedCounter value={booksWithRatings} /> books you rated
        </p>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default AverageRating;
