import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariantsSubtle, fadeScaleVariants } from '../motionVariants';

interface DesktopViewProps {
  qrCodeUrl?: string | null;
  onContinue: () => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({ qrCodeUrl, onContinue }) => {
  return (
    <motion.div 
      className="p-6 pt-20 rounded-xl mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-2xl font-medium mb-2 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
        variants={itemVariantsSubtle}
      >
        Goodreads Wrapped 2025 is best viewed on mobile.
      </motion.h2>
      <motion.p 
        className="text-md opacity-80 m-0 font-[var(--font-main)]"
        variants={itemVariantsSubtle}
      >
        Scan QR Code to view on mobile, or click below to continue anyways.
      </motion.p>
      {qrCodeUrl && (
        <motion.div 
          className="text-center my-8"
          variants={fadeScaleVariants}
        >
          <img src={qrCodeUrl} alt="QR Code" className="max-w-[150px] rounded-xl border border-[rgba(0,0,0,0.1)] inline-block" />
        </motion.div>
      )}
      <motion.button 
        className="bg-[var(--color-vintage-accent)] text-white p-2 px-4 rounded-lg text-md font-[var(--font-main)] pointer-events-auto hover:scale-101 hover:bg-[var(--color-vintage-accent-light)] active:scale-99 hover:transition-[background-color,transform] hover:duration-200 active:transition-transform active:duration-100"
        variants={itemVariantsSubtle}
        onClick={onContinue}
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

export default DesktopView;
