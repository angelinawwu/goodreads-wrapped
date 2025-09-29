import React from 'react';
import './2_DesktopView.css';

interface DesktopViewProps {
  qrCodeUrl?: string | null;
  onContinue: () => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({ qrCodeUrl, onContinue }) => {
  return (
    <div className="desktop-container">
      <h2>Goodreads Wrapped 2025 is best viewed on mobile.</h2>
      <p>Scan QR Code to view on mobile, or click below to continue anyways.</p>
      {qrCodeUrl && (
        <div className="qr-section">
          <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
        </div>
      )}
      <button className="desktop-button" onClick={onContinue}>Continue</button>
    </div>
  );
};

export default DesktopView;
