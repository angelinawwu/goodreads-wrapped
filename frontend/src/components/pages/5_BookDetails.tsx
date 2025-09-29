import React from 'react';
import Navigation from '../Navigation';
import './5_BookDetails.css';

interface BookDetailsProps {
  averagePages?: number;
  longestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  shortestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ 
  averagePages, 
  longestBook, 
  shortestBook, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📊 Book Details</h2>
        <p className="page-subtitle">Your reading patterns in 2025</p>
      </div>
      
      <div className="book-details-grid">
        <div className="detail-card">
          <h3>📏 Average Length</h3>
          <div className="detail-number">{averagePages || 0}</div>
          <div className="detail-label">pages per book</div>
        </div>
        
        {longestBook && (
          <div className="detail-card book-card">
            <h3>📚 Longest Book</h3>
            <div className="book-cover">
              {longestBook.coverImage ? (
                <img src={longestBook.coverImage} alt={longestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{longestBook.title}</div>
              <div className="book-author">by {longestBook.author}</div>
              <div className="book-pages">{longestBook.numPages} pages</div>
            </div>
          </div>
        )}
        
        {shortestBook && (
          <div className="detail-card book-card">
            <h3>📖 Shortest Book</h3>
            <div className="book-cover">
              {shortestBook.coverImage ? (
                <img src={shortestBook.coverImage} alt={shortestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{shortestBook.title}</div>
              <div className="book-author">by {shortestBook.author}</div>
              <div className="book-pages">{shortestBook.numPages} pages</div>
            </div>
          </div>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BookDetails;
