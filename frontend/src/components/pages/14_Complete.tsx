import React from 'react';
import Navigation from '../Navigation';
import './13_Complete.css';

interface CompleteProps {
  yearBooks?: number;
  pagesScraped?: number;
  qrCodeUrl?: string | null;
  isMobile: boolean;
  onRestart: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Complete: React.FC<CompleteProps> = ({ 
  yearBooks, 
  pagesScraped, 
  qrCodeUrl, 
  isMobile, 
  onRestart, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🎉 That's a Wrap!</h2>
        <p className="page-subtitle">Thanks for exploring your reading year</p>
      </div>
      <div className="summary-stats">
        <div className="summary-stat">
          <div className="summary-number">{yearBooks || 0}</div>
          <div className="summary-label">Books Read</div>
        </div>
        <div className="summary-stat">
          <div className="summary-number">{pagesScraped || 0}</div>
          <div className="summary-label">Pages Analyzed</div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="restart-button" onClick={onRestart}>
          Start Over
        </button>
        {!isMobile && qrCodeUrl && (
          <div className="qr-section">
            <p>Share on mobile:</p>
            <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
          </div>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default Complete;
