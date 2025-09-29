import React from 'react';
import Navigation from '../Navigation';
import './11_MostScathingReview.css';

interface SentimentData {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  fullReview: string;
}

interface MostScathingReviewProps {
  mostScathingReview?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
    sentiment?: SentimentData;
  };
  booksWithReviews?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const MostScathingReview: React.FC<MostScathingReviewProps> = ({ 
  mostScathingReview, 
  booksWithReviews,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🔥 Most Scathing Review</h2>
        <p className="page-subtitle">Your most critical review of 2025</p>
      </div>
      
      {mostScathingReview ? (
        <div className="scathing-review-container">
          <div className="scathing-book-card">
            <div className="book-cover">
              {mostScathingReview.coverImage ? (
                <img src={mostScathingReview.coverImage} alt={mostScathingReview.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{mostScathingReview.title}</div>
              <div className="book-author">by {mostScathingReview.author}</div>
              {mostScathingReview.userRating && (
                <div className="book-rating">⭐ {mostScathingReview.userRating}/5</div>
              )}
            </div>
          </div>
          
          <div className="review-content">
            <div className="review-text">
              "{mostScathingReview.sentiment?.fullReview || 'No review text available'}"
            </div>
            
            <div className="sentiment-stats">
              <div className="sentiment-score">
                <div className="sentiment-number">
                  {mostScathingReview.sentiment?.comparative?.toFixed(3) || '0.000'}
                </div>
                <div className="sentiment-label">sentiment score</div>
              </div>
              
              <div className="sentiment-breakdown">
                <div className="sentiment-positive">
                  <span className="sentiment-icon">😊</span>
                  <span>{mostScathingReview.sentiment?.positive?.length || 0} positive words</span>
                </div>
                <div className="sentiment-negative">
                  <span className="sentiment-icon">😠</span>
                  <span>{mostScathingReview.sentiment?.negative?.length || 0} negative words</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="scathing-message">
            <p>This was your most critical review of the year! 💥</p>
          </div>
        </div>
      ) : (
        <div className="no-scathing-review">
          <p>No scathing reviews found - you're too nice! 😊</p>
        </div>
      )}
      
      <div className="review-details">
        <p>Based on {booksWithReviews || 0} books with reviews</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default MostScathingReview;
