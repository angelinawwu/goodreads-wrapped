import React from 'react';
import Navigation from '../Navigation';
import './6_TopGenres.css';
import { motion } from 'framer-motion';

interface TopGenresProps {
  genreCounts?: { [key: string]: number };
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const TopGenres: React.FC<TopGenresProps> = ({ 
  genreCounts, 
  yearBooks, 
  onPrevPage, 
  onNextPage 
}) => {
  const topGenres = genreCounts 
    ? Object.entries(genreCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
    : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <motion.h2 className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🏆 Top Genres
        </motion.h2>
        <motion.p className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your favorite genres in 2025
        </motion.p>
      </div>
      
      <div className="top-genres-list">
        {topGenres.length > 0 ? (
          topGenres.map(([genre, count], index) => (
            <div key={genre} className="genre-rank-item">
              <div className="genre-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>
              <div className="genre-info">
                <div className="genre-name">{genre}</div>
                <div className="genre-fraction">{count as number}/{yearBooks || 0} books</div>
              </div>
              <div className="genre-percentage">
                {Math.round(((count as number) / (yearBooks || 1)) * 100)}%
              </div>
            </div>
          ))
        ) : (
          <div className="no-genres">
            <p>No genre data available</p>
          </div>
        )}
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default TopGenres;
