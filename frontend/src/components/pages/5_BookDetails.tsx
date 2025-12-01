import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  containerVariantsSlow,
  itemVariants,
  fadeScaleVariants,
  stagedHeadline,
  stagedSubheadline,
  stagedMetric,
  stagedLabel,
} from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface BookDetailsProps {
  averagePages?: number;
  longestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  shortestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  onPrevPage: () => void;
  onNextPage: () => void;
}

// Zoom transition variants
const zoomVariants: Variants = {
  enter: {
    scale: 0.8,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: { type: "spring", stiffness: 200, damping: 20 },
      opacity: { duration: 0.3 },
    }
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: {
      scale: { type: "spring", stiffness: 200, damping: 20 },
      opacity: { duration: 0.2 },
    }
  }
};

const BookDetails: React.FC<BookDetailsProps> = ({ 
  averagePages = 0, 
  longestBook, 
  shortestBook, 
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);

  const totalSteps = 4; // Intro, Longest, Shortest, Average

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (step < totalSteps - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
    // Note: Do NOT auto-advance to next page - let user control page navigation
  }, [step, totalSteps]);

  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content Area with Slides */}
      <div className="flex-1 flex items-center justify-center w-full max-w-[600px] relative min-h-[400px]">
        <AnimatePresence initial={false} mode="wait">
          
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div
              key="intro"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-4 w-full"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-4xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={stagedHeadline}
                  initial="hidden"
                  animate="visible"
                >
                  You covered some<br/>serious ground.
                </motion.h2>
                <motion.p 
                  className="text-lg opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={stagedSubheadline}
                  initial="hidden"
                  animate="visible"
                >
                  From short stories to epic sagas...
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: LONGEST BOOK */}
          {step === 1 && longestBook && (
            <motion.div
              key="longest"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-4 w-full"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-4xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  Your Longest Read
                </motion.h2>
              </motion.div>
              
              <motion.div 
                className="mb-6 relative"
                variants={fadeScaleVariants}
              >
                <motion.div 
                  className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)] mx-auto"
                  variants={fadeScaleVariants}
                >
                  {longestBook.coverImage ? (
                    <img src={longestBook.coverImage} alt={longestBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
                  )}
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center mb-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  {longestBook.title}
                </motion.div>
                <motion.div 
                  className="text-[0.9rem] opacity-80 mb-4 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {longestBook.author}
                </motion.div>
                <motion.div 
                  className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={longestBook.numPages || 0} /> pages
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: SHORTEST BOOK */}
          {step === 2 && shortestBook && (
            <motion.div
              key="shortest"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-4 w-full"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-4xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  Your Shortest Read
                </motion.h2>
              </motion.div>
              
              <motion.div 
                className="mb-6 relative"
                variants={fadeScaleVariants}
              >
                <motion.div 
                  className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)] mx-auto"
                  variants={fadeScaleVariants}
                >
                  {shortestBook.coverImage ? (
                    <img src={shortestBook.coverImage} alt={shortestBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
                  )}
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center mb-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  {shortestBook.title}
                </motion.div>
                <motion.div 
                  className="text-[0.9rem] opacity-80 mb-4 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {shortestBook.author}
                </motion.div>
                <motion.div 
                  className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={shortestBook.numPages || 0} /> pages
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: AVERAGE PAGES */}
          {step === 3 && (
            <motion.div
              key="average"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-4 w-full"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-4xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  On average, your books were
                </motion.h2>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-6xl font-bold text-black my-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={stagedMetric}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatedCounter value={averagePages} />
                </motion.div>
                <motion.div 
                  className="text-lg opacity-80 font-[var(--font-main)] text-black"
                  variants={stagedLabel}
                  initial="hidden"
                  animate="visible"
                >
                  pages long
                </motion.div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default BookDetails;
