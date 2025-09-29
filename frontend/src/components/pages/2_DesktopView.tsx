import React from 'react';
import './2_DesktopView.css';
import { motion } from 'framer-motion';

interface DesktopViewProps {
  qrCodeUrl?: string | null;
  onContinue: () => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({ qrCodeUrl, onContinue }) => {
  return (
    <div className="desktop-container">
      <motion.h2 className="desktop-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Goodreads Wrapped 2025 is best viewed on mobile.
      </motion.h2>
      <motion.p className="desktop-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Scan QR Code to view on mobile, or click below to continue anyways.
      </motion.p>
      {qrCodeUrl && (
        <motion.div className="qr-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
        </motion.div>
      )}
      <motion.button className="desktop-button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        onClick={onContinue}
      >
        Continue</motion.button>
    </div>
  );
};

export default DesktopView;
