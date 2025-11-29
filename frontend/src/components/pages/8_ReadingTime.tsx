import React, { useState } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface ReadingTimeProps {
  averageReadingTime?: number;
  fastestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  slowestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  booksWithReadingTime?: number;
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
      x: { type: "spring", stiffness: 600, damping: 40 },
      opacity: { duration: 0.15 },
      scale: { duration: 0.2 },
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 600 : -600,
    opacity: 0,
    scale: 0.9,
    transition: {
      x: { type: "spring", stiffness: 800, damping: 40 },
      opacity: { duration: 0.1 },
    }
  })
};

const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  averageReadingTime = 0, 
  fastestRead, 
  slowestRead, 
  booksWithReadingTime = 0,
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = 4; // Intro, Fastest, Slowest, Average

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
                  Speed matters.
                </motion.h2>
                <motion.p 
                  className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  From quick reads to marathons...
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: FASTEST READ */}
          {step === 1 && fastestRead && (
            <motion.div
              key="fastest"
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
                  The Speed Reader
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
                  {fastestRead.coverImage ? (
                    <img src={fastestRead.coverImage} alt={fastestRead.title} className="w-full h-full object-cover" />
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
                  {fastestRead.title}
                </motion.div>
                <motion.div 
                  className="text-[0.9rem] opacity-80 mb-4 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {fastestRead.author}
                </motion.div>
                <motion.div 
                  className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={fastestRead.readingDays || 0} /> days
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: SLOWEST READ */}
          {step === 2 && slowestRead && (
            <motion.div
              key="slowest"
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
                  The Marathon
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
                  {slowestRead.coverImage ? (
                    <img src={slowestRead.coverImage} alt={slowestRead.title} className="w-full h-full object-cover" />
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
                  {slowestRead.title}
                </motion.div>
                <motion.div 
                  className="text-[0.9rem] opacity-80 mb-4 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {slowestRead.author}
                </motion.div>
                <motion.div 
                  className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={slowestRead.readingDays || 0} /> days
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: AVERAGE TIME */}
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
                  <AnimatedCounter value={averageReadingTime} decimals={2} />
                </motion.div>
                <motion.div 
                  className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  days per book
                </motion.div>
                {booksWithReadingTime > 0 && (
                  <motion.div 
                    className="text-center mt-4 opacity-80"
                    variants={itemVariants}
                  >
                    <p className="m-0 text-[0.9rem] font-[var(--font-main)] text-black">
                      Based on <AnimatedCounter value={booksWithReadingTime} /> books with reading dates
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </motion.div>
  );
};

export default ReadingTime;
