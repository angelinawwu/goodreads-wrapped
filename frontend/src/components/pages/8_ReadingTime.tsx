import React from 'react';
import Navigation from '../Navigation';
import './8_ReadingTime.css';

interface ReadingTimeProps {
  averageReadingTime?: number;
  fastestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  slowestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  booksWithReadingTime?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  averageReadingTime, 
  fastestRead, 
  slowestRead, 
  booksWithReadingTime,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>⏱️ Reading Speed</h2>
        <p className="page-subtitle">How fast you read in 2025</p>
      </div>
      
      <div className="reading-time-grid">
        <div className="reading-time-stat">
          <h3>📊 Average Time</h3>
          <div className="reading-time-number">{averageReadingTime?.toFixed(2) || '0.00'}</div>
          <div className="reading-time-label">days per book</div>
        </div>
        
        {fastestRead && (
          <div className="reading-time-card">
            <h3>⚡ Fastest Read</h3>
            <div className="book-cover">
              {fastestRead.coverImage ? (
                <img src={fastestRead.coverImage} alt={fastestRead.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{fastestRead.title}</div>
              <div className="book-author">by {fastestRead.author}</div>
              <div className="reading-days">{fastestRead.readingDays} days</div>
            </div>
          </div>
        )}
        
        {slowestRead && (
          <div className="reading-time-card">
            <h3>🐌 Slowest Read</h3>
            <div className="book-cover">
              {slowestRead.coverImage ? (
                <img src={slowestRead.coverImage} alt={slowestRead.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{slowestRead.title}</div>
              <div className="book-author">by {slowestRead.author}</div>
              <div className="reading-days">{slowestRead.readingDays} days</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="reading-time-details">
        <p>Based on {booksWithReadingTime || 0} books with reading dates</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default ReadingTime;
