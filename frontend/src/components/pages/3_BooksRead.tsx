import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, heroVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface BooksReadProps {
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  disableBack?: boolean;
}

const BooksRead: React.FC<BooksReadProps> = ({ yearBooks = 0, onPrevPage, onNextPage, disableBack = false }) => {
  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center mt-24 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Text */}
      <motion.div 
        variants={itemVariants} 
        className="text-center pt-30 mb-6 w-full"
      >
        <motion.h2 
          className="text-xl md:text-2xl font-bold tracking-wider uppercase text-[var(--color-vintage-accent)] font-[var(--font-display)] mb-2"
          variants={itemVariants}
        >
          The Results Are In
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl font-light text-[var(--color-vintage-text)] mt-1 font-[var(--font-main)]"
          variants={itemVariants}
        >
          In 2025, you devoured...
        </motion.p>
      </motion.div>

      {/* Hero Section with Large Number */}
      <div className="relative flex items-center justify-center w-full">
        {/* The Big Number */}
        <motion.div 
          className="relative z-20 font-black text-[6rem] md:text-[8rem] leading-none text-[var(--color-vintage-accent)] font-[var(--font-display)]"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCounter value={yearBooks} />
        </motion.div>
      </div>

      {/* Bottom Label */}
      <motion.div 
        variants={itemVariants} 
        className="z-20 mb-12"
      >
        <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-[var(--color-vintage-accent)] font-[var(--font-display)]">
          BOOKS
        </span>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} disablePrev={disableBack} />
    </motion.div>
  );
};

export default BooksRead;
