import React from 'react';
import Navigation from '../Navigation';
import './5_BookDetails.css';
import { motion } from 'framer-motion';

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
        <motion.h2 className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Book Details
        </motion.h2>
        <motion.p className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your reading patterns in 2025
        </motion.p>
      </div>
      
      <div className="book-details-grid">
        <div className="detail-card">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            📏 Average Length
          </motion.h3>
          <motion.div className="detail-number"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {averagePages || 0}
          </motion.div>
          <motion.div className="detail-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            pages per book
          </motion.div>
        </div>
        
        {longestBook && (
          <div className="detail-card book-card">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              📚 Longest Book
            </motion.h3>
            <motion.div className="book-cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              {longestBook.coverImage ? (
                <img src={longestBook.coverImage} alt={longestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </motion.div>
            <div className="book-info">
              <motion.div className="book-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.1 }}
              >
                {longestBook.title}
              </motion.div>
              <motion.div className="book-author"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                by {longestBook.author}
              </motion.div>
              <motion.div className="book-pages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.7 }}
              >
                {longestBook.numPages} pages
              </motion.div>
            </div>
          </div>
        )}
        
        {shortestBook && (
          <div className="detail-card book-card">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              📖 Shortest Book
            </motion.h3>
            <motion.div className="book-cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              {shortestBook.coverImage ? (
                <img src={shortestBook.coverImage} alt={shortestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </motion.div>
            <div className="book-info">
              <motion.div className="book-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.1 }}
              >
                {shortestBook.title}
              </motion.div>
              <motion.div className="book-author"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                by {shortestBook.author}
              </motion.div>
              <motion.div className="book-pages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.7 }}
              >
                {shortestBook.numPages} pages
              </motion.div>
            </div>
          </div>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BookDetails;
