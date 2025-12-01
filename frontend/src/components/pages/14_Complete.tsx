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
      className="page-container flex flex-col items-center justify-center mt-12 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb w-full text-center pt-12"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-4xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          That's a Wrap!
        </motion.h2>
        <motion.p 
          className="text-lg opacity-80 m-0 font-[var(--font-main)] italic"
          variants={itemVariants}
        >
          Thanks for exploring your reading year
        </motion.p>
      </motion.div>
      <motion.div 
        className="flex justify-center gap-12 my-4 max-md:flex-col max-md:gap-8"
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
          className="bg-[var(--color-vintage-accent)] text-white p-2 px-4 rounded-xl text-lg font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-4 hover:bg-[var(--color-vintage-accent-light)] hover:-translate-y-0.5" 
          onClick={onRestart}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Over
        </motion.button>
      </motion.div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default Complete;
