import React from 'react';
import Navigation from '../Navigation';
import './4_AverageRating.css';
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
    <div className="page-container">
      <div className="page-header">
        <motion.h2 className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ⭐ Average Rating
        </motion.h2>
        <motion.p className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your average rating for 2025 books
        </motion.p>
      </div>
      <div className="big-stat">
        <motion.div className="stat-number"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {averageRating?.toFixed(2) || '0.0'}
        </motion.div>
        <motion.div className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          out of 5 stars
        </motion.div>
      </div>
      <div className="rating-details">
        <motion.p className="rating-details-text"
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
