import React, { useState } from 'react';
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

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability = 0, 
  toReadReadCount = 0, 
  toReadAddedCount = 0, 
  year,
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = 4; // Intro, Score Reveal, Breakdown, Reflection

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

  const dependabilityPercent = dependability * 100;
  const totalBooks = toReadAddedCount + toReadReadCount;

  const summaryText = dependability >= 0.8 
    ? "You're incredibly reliable with your reading goals!"
    : dependability >= 0.5
    ? "You're doing well at following through on your reading plans!"
    : "There's always room to improve your reading follow-through!";

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
          
          {/* STEP 0: INTRO - The Hook */}
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
                  Your Reading Dependability
                </motion.h2>
                <motion.p 
                  className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  How well you follow through on your reading goals this year.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: SCORE REVEAL - The Big Metric */}
          {step === 1 && (
            <motion.div
              key="score"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-[1.2rem] font-bold uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  Follow-Through Rate
                </motion.p>
                <motion.div 
                  className="text-[4rem] md:text-[5rem] font-black text-black my-2 font-[var(--font-display)] leading-none"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={dependabilityPercent} decimals={1} />%
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: BREAKDOWN - The Numbers */}
          {step === 2 && (
            <motion.div
              key="breakdown"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
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
                <motion.p 
                  className="text-[0.9rem] opacity-80 font-[var(--font-main)] text-black mt-4"
                  variants={itemVariants}
                >
                  This measures how many books you read in {year || '2025'} that were also added to your shelves in {year || '2025'}.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: REFLECTION - Interpretation */}
          {step === 3 && (
            <motion.div
              key="reflection"
              custom={direction}
              variants={slideVariants}
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
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </motion.div>
  );
};

export default Dependability;
