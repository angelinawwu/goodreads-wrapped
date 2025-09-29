import React from 'react';
import Navigation from '../Navigation';
import './10_BiggestHater.css';

interface BiggestHaterProps {
  biggestHaterMoment?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
  };
  biggestDisparity?: number;
  booksWithBothRatings?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BiggestHater: React.FC<BiggestHaterProps> = ({ 
  biggestHaterMoment, 
  biggestDisparity, 
  booksWithBothRatings,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>😤 Biggest Hater Moment</h2>
        <p className="page-subtitle">When you disagreed with everyone else</p>
      </div>
      
      {biggestHaterMoment ? (
        <div className="hater-moment-container">
          <div className="hater-book-card">
            <div className="book-cover">
              {biggestHaterMoment.coverImage ? (
                <img src={biggestHaterMoment.coverImage} alt={biggestHaterMoment.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{biggestHaterMoment.title}</div>
              <div className="book-author">by {biggestHaterMoment.author}</div>
            </div>
          </div>
          
          <div className="rating-comparison">
            <div className="rating-display">
              <div className="rating-label">Your Rating</div>
              <div className="rating-stars user-rating">
                {'⭐'.repeat(biggestHaterMoment.userRating || 0)}
                <span className="rating-number">{biggestHaterMoment.userRating}/5</span>
              </div>
            </div>
            
            <div className="vs-divider">VS</div>
            
            <div className="rating-display">
              <div className="rating-label">Everyone Else</div>
              <div className="rating-stars avg-rating">
                {'⭐'.repeat(Math.floor(biggestHaterMoment.avgRating || 0))}
                <span className="rating-number">{biggestHaterMoment.avgRating?.toFixed(2)}/5</span>
              </div>
            </div>
          </div>
          
          <div className="disparity-display">
            <div className="disparity-number">{biggestDisparity?.toFixed(2)}</div>
            <div className="disparity-label">stars difference</div>
          </div>
          
          <div className="hater-message">
            <p>You were {biggestDisparity?.toFixed(2)} stars more critical than the average reader!</p>
          </div>
        </div>
      ) : (
        <div className="no-hater-moment">
          <p>No hater moments found - you're too agreeable! 😊</p>
        </div>
      )}
      
      <div className="hater-details">
        <p>Based on {booksWithBothRatings || 0} books with both your rating and average rating</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BiggestHater;
