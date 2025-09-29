import React from 'react';
import Navigation from '../Navigation';
import './4_AverageRating.css';

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
        <h2>⭐ Average Rating</h2>
        <p className="page-subtitle">Your average rating for 2025 books</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{averageRating?.toFixed(2) || '0.0'}</div>
        <div className="stat-label">out of 5 stars</div>
      </div>
      <div className="rating-details">
        <p>Based on {booksWithRatings || 0} books you rated</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default AverageRating;
