import React, { useState } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
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

// Slide transition variants for horizontal movement
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.3 },
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    }
  })
};

const BookDetails: React.FC<BookDetailsProps> = ({ 
  averagePages = 0, 
  longestBook, 
  shortestBook, 
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = 4; // Intro, Longest, Shortest, Average

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onNextPage();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      onPrevPage();
    }
  };

  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content Area with Slides */}
      <div className="flex-1 flex items-center justify-center w-full max-w-[600px] relative min-h-[400px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
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
                  className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  You covered some<br/>serious ground.
                </motion.h2>
                <motion.p 
                  className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
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
              custom={direction}
              variants={slideVariants}
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
                  className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  The Marathon Read
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
              custom={direction}
              variants={slideVariants}
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
                  className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  The Sprint
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
              custom={direction}
              variants={slideVariants}
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
                  className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  Your Average
                </motion.h2>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-[4rem] md:text-[5rem] font-bold text-black my-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={averagePages} />
                </motion.div>
                <motion.div 
                  className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  pages per book
                </motion.div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </motion.div>
  );
};

export default BookDetails;
