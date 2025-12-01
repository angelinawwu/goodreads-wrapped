import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariantsSlow, itemVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface DependabilityProps {
  dependability?: number;
  toReadReadCount?: number;
  toReadAddedCount?: number;
  year?: string;
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

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability = 0, 
  toReadReadCount = 0, 
  toReadAddedCount = 0, 
  year,
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);

  // Intro, Combined Score + Breakdown, Reflection
  const totalSteps = 3;

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

  const dependabilityPercent = dependability * 100;
  const totalBooks = toReadAddedCount + toReadReadCount;

  const summaryText = dependability >= 0.8 
    ? "You're actually doing pretty well. Keep checking those off the list."
    : dependability >= 0.5
    ? "You know, it could be worse."
    : "Yikes. Dream big I guess?";

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
          
          {/* STEP 0: INTRO - The Hook */}
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
                  variants={itemVariants}
                >
                  You added a lot of books to your TBR this year.
                </motion.h2>
                <motion.p 
                  className="text-lg opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  But how well did you follow through?
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: SCORE + BREAKDOWN */}
          {step === 1 && (
            <motion.div
              key="score-breakdown"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              {/* Score reveal */}
              <motion.div 
                className="text-center mb-6"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-[1.2rem] font-bold uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  Follow-Through Rate
                </motion.p>
                <motion.div 
                  className="text-6xl font-black text-var(--color-vintage-accent) my-2 font-[var(--font-display)] leading-none"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={dependabilityPercent} decimals={1} />%
                </motion.div>
              </motion.div>

              {/* Breakdown numbers */}
              <motion.div 
                className="flex flex-col items-center gap-4 my-4 max-w-[600px] w-full"
                variants={itemVariants}
              >
                <motion.div 
                  className="flex items-center gap-4 p-3 rounded-xl w-full max-md:flex-col max-md:gap-2"
                  variants={itemVariants}
                >
                  <div className="flex flex-col items-center flex-1">
                    <motion.div 
                      className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]"
                      variants={itemVariants}
                    >
                      <AnimatedCounter value={toReadReadCount} />
                    </motion.div>
                    <motion.div 
                      className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black"
                      variants={itemVariants}
                    >
                      books read in {year || '2025'}
                    </motion.div>
                  </div>
                  <div className="text-[1.2rem] text-black font-bold font-[var(--font-main)]">of</div>
                  <div className="flex flex-col items-center flex-1">
                    <motion.div 
                      className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]"
                      variants={itemVariants}
                    >
                      <AnimatedCounter value={totalBooks} />
                    </motion.div>
                    <motion.div 
                      className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black"
                      variants={itemVariants}
                    >
                      total books added in {year || '2025'}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: REFLECTION - Interpretation */}
          {step === 2 && (
            <motion.div
              key="reflection"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="text-center p-6 rounded-xl w-full"
                variants={itemVariants}
              >
                <motion.p 
                  className="m-0 text-[1.1rem] text-black font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  {summaryText}
                </motion.p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default Dependability;
