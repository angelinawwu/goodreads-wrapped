import React from 'react';
import Navigation from '../Navigation';
import './3_BooksRead.css';
import { motion } from 'framer-motion';

interface BooksReadProps {
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BooksRead: React.FC<BooksReadProps> = ({ yearBooks, onPrevPage, onNextPage }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <motion.h2 className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📖 Books Read
        </motion.h2>
        <motion.p className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          In 2025, you read...
        </motion.p>
      </div>
      <div className="big-stat">
        <motion.div className="stat-number"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {yearBooks || 0}
        </motion.div>
        <motion.div className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          books
        </motion.div>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BooksRead;
