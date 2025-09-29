import React from 'react';
import Navigation from '../Navigation';
import './12_MostPositiveReview.css';

interface SentimentData {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  fullReview: string;
}

interface MostPositiveReviewProps {
  mostPositiveReview?: {
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

const MostPositiveReview: React.FC<MostPositiveReviewProps> = ({ 
  mostPositiveReview, 
  booksWithReviews,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🌟 Most Positive Review</h2>
        <p className="page-subtitle">Your most positive review of 2025</p>
      </div>
      
      {mostPositiveReview ? (
        <div className="positive-review-container">
          <div className="positive-book-card">
            <div className="book-cover">
              {mostPositiveReview.coverImage ? (
                <img src={mostPositiveReview.coverImage} alt={mostPositiveReview.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{mostPositiveReview.title}</div>
              <div className="book-author">by {mostPositiveReview.author}</div>
              {mostPositiveReview.userRating && (
                <div className="book-rating">⭐ {mostPositiveReview.userRating}/5</div>
              )}
            </div>
          </div>
          
          <div className="review-content">
            <div className="review-text">
              "{mostPositiveReview.sentiment?.fullReview || 'No review text available'}"
            </div>
            
            <div className="sentiment-stats">
              <div className="sentiment-score">
                <div className="sentiment-number">
                  {mostPositiveReview.sentiment?.comparative?.toFixed(3) || '0.000'}
                </div>
                <div className="sentiment-label">sentiment score</div>
              </div>
              
              <div className="sentiment-breakdown">
                <div className="sentiment-positive">
                  <span className="sentiment-icon">😊</span>
                  <span>{mostPositiveReview.sentiment?.positive?.length || 0} positive words</span>
                </div>
                <div className="sentiment-negative">
                  <span className="sentiment-icon">😠</span>
                  <span>{mostPositiveReview.sentiment?.negative?.length || 0} negative words</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="positive-message">
            <p>This was your most positive review of the year! ✨</p>
          </div>
        </div>
      ) : (
        <div className="no-positive-review">
          <p>No positive reviews found - are you a hater?</p>
        </div>
      )}
      
      <div className="review-details">
        <p>Based on {booksWithReviews || 0} books with reviews</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default MostPositiveReview;
