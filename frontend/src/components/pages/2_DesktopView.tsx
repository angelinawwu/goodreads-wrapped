import React from 'react';
import { motion } from 'framer-motion';

interface DesktopViewProps {
  qrCodeUrl?: string | null;
  onContinue: () => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({ qrCodeUrl, onContinue }) => {
  return (
    <div className="p-8 pt-16 rounded-xl mb-8 bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
      <motion.h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Goodreads Wrapped 2025 is best viewed on mobile.
      </motion.h2>
      <motion.p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Scan QR Code to view on mobile, or click below to continue anyways.
      </motion.p>
      {qrCodeUrl && (
        <motion.div className="text-center my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <img src={qrCodeUrl} alt="QR Code" className="max-w-[150px] rounded-xl border border-[rgba(0,0,0,0.1)] inline-block" />
        </motion.div>
      )}
      <motion.button className="bg-[var(--color-vintage-accent)] text-white border border-white p-4 rounded-xl text-[1.1rem] font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-8 min-w-[150px] hover:bg-[var(--color-vintage-accent-light)] hover:-translate-y-0.5 hover:scale-101"
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
