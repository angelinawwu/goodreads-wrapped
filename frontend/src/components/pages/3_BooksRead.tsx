import React from 'react';
import Navigation from '../Navigation';
import './3_BooksRead.css';

interface BooksReadProps {
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BooksRead: React.FC<BooksReadProps> = ({ yearBooks, onPrevPage, onNextPage }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📖 Books Read</h2>
        <p className="page-subtitle">In 2025, you read...</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{yearBooks || 0}</div>
        <div className="stat-label">books</div>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BooksRead;
