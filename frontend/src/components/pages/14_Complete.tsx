import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, heroVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

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
  yearBooks = 0, 
  pagesScraped = 0, 
  qrCodeUrl, 
  isMobile, 
  onRestart, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          🎉 That's a Wrap!
        </motion.h2>
        <motion.p 
          className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
          variants={itemVariants}
        >
          Thanks for exploring your reading year
        </motion.p>
      </motion.div>
      <motion.div 
        className="flex justify-center gap-12 my-12 max-md:flex-col max-md:gap-8"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.div 
            className="text-[3rem] font-bold text-black mb-2 font-[var(--font-main)]"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatedCounter value={yearBooks} />
          </motion.div>
          <motion.div 
            className="text-[1rem] opacity-80 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            Books Read
          </motion.div>
        </motion.div>
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.div 
            className="text-[3rem] font-bold text-black mb-2 font-[var(--font-main)]"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatedCounter value={pagesScraped} />
          </motion.div>
          <motion.div 
            className="text-[1rem] opacity-80 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            Pages Analyzed
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex flex-col items-center gap-8"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.button 
          className="bg-[#FFD2F5] text-black border border-black py-4 px-8 rounded-xl text-[1.1rem] font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-8 min-w-[150px] hover:bg-[#FFA5EC] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(255,165,236,0.4)]" 
          onClick={onRestart}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Over
        </motion.button>
        {!isMobile && qrCodeUrl && (
          <motion.div 
            className="text-center my-8"
            variants={fadeScaleVariants}
          >
            <p className="mb-2 font-[var(--font-main)] text-black">Share on mobile:</p>
            <img src={qrCodeUrl} alt="QR Code" className="max-w-[150px] rounded-xl border border-[rgba(0,0,0,0.1)]" />
          </motion.div>
        )}
      </motion.div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default Complete;
