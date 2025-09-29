import React from 'react';
import Navigation from '../Navigation';
import './9_Dependability.css';

interface DependabilityProps {
  dependability?: number;
  toReadReadCount?: number;
  toReadAddedCount?: number;
  year?: string;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability, 
  toReadReadCount, 
  toReadAddedCount, 
  year,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📋 Dependability</h2>
        <p className="page-subtitle">How well you follow through on your reading goals</p>
      </div>
      
      <div className="dependability-stats">
        <div className="dependability-main">
          <div className="dependability-number">
            {dependability ? (dependability * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="dependability-label">follow-through rate</div>
        </div>
        
        <div className="dependability-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-number">{toReadReadCount || 0}</div>
            <div className="breakdown-label">books read in {year || '2025'}</div>
          </div>
          <div className="breakdown-divider">of</div>
          <div className="breakdown-item">
            <div className="breakdown-number">{(toReadAddedCount || 0) + (toReadReadCount || 0)}</div>
            <div className="breakdown-label">total books added in {year || '2025'}</div>
          </div>
        </div>
      </div>
      
      <div className="dependability-message">
        <p>
          {dependability && dependability >= 0.8 
            ? "You're incredibly reliable with your reading goals! 🎯"
            : dependability && dependability >= 0.5
            ? "You're doing well at following through on your reading plans! 📚"
            : "There's always room to improve your reading follow-through! 💪"
          }
        </p>
        <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem'}}>
          This measures how many books you read in {year || '2025'} that were also added to your shelves in {year || '2025'}.
        </p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default Dependability;
