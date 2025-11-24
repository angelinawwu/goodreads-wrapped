import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';

interface AverageRatingProps {
  averageRating?: number;
  booksWithRatings?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const AverageRating: React.FC<AverageRatingProps> = ({ 
  averageRating, 
  booksWithRatings, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="pt-56 px-8">
      <div className="mb-4 w-full text-center">
        <motion.h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ⭐ Average Rating
        </motion.h2>
        <motion.p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your average rating for 2025 books
        </motion.p>
      </div>
      <div className="my-4 text-center">
        <motion.div className="text-[4rem] font-bold m-0 text-black font-[var(--font-main)] shadow-none md:text-[3rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {averageRating?.toFixed(2) || '0.0'}
        </motion.div>
        <motion.div className="text-[1.2rem] mt-2 opacity-90 font-[var(--font-main)] text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          out of 5 stars
        </motion.div>
      </div>
      <div className="mt-4 opacity-80 text-[0.9rem] font-[var(--font-main)] text-black">
        <motion.p className="m-0 font-[var(--font-main)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Based on {booksWithRatings || 0} books you rated
        </motion.p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default AverageRating;
