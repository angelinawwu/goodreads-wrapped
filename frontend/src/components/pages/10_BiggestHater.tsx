import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface BiggestHaterProps {
  biggestHaterMoment?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
  };
  biggestDisparity?: number;
  booksWithBothRatings?: number;
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

const BiggestHater: React.FC<BiggestHaterProps> = ({
  biggestHaterMoment,
  biggestDisparity = 0,
  booksWithBothRatings = 0,
  onPrevPage,
  onNextPage,
}) => {
  const [step, setStep] = useState(0);

  const totalSteps = biggestHaterMoment ? 4 : 1; // Intro, Book Reveal, Disparity, Summary (or just Intro if no data)

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
                  You weren't afraid to stand alone this year.
                </motion.h2>
                <motion.p 
                  className="text-lg opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  Let's see your most controversial opinion.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: BOOK REVEAL - The Subject */}
          {step === 1 && biggestHaterMoment && (
            <motion.div
              key="book-reveal"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center mb-24"
            >
              <motion.div 
                className="mb-12 relative"
                variants={fadeScaleVariants}
              >
                <motion.div 
                  className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)] mx-auto"
                  variants={fadeScaleVariants}
                >
                  {biggestHaterMoment.coverImage ? (
                    <img src={biggestHaterMoment.coverImage} alt={biggestHaterMoment.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
                  )}
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center mb-4"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-[1.1rem] text-black/60 mb-2 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  This was your biggest hater moment:
                </motion.p>
                <motion.div 
                  className="text-[1.3rem] font-bold mb-1 font-[var(--font-display)] text-black"
                  variants={itemVariants}
                >
                  {biggestHaterMoment.title}
                </motion.div>
                <motion.div 
                  className="text-[0.95rem] opacity-80 mb-4 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {biggestHaterMoment.author}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: DISPARITY - The Conflict */}
          {step === 2 && biggestHaterMoment && (
            <motion.div
              key="disparity-climax"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center mb-24"
            >
              <motion.div 
                className="flex justify-center items-end gap-6 md:gap-10 w-full mb-8 max-md:flex-col max-md:items-center max-md:gap-6"
                variants={itemVariants}
              >
                <div className="flex flex-col items-center">
                  <p className="text-[0.85rem] uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black">Your Rating</p>
                  <div className="text-3xl md:text-4xl font-black font-[var(--font-display)] text-black">
                    {biggestHaterMoment.userRating?.toFixed(2)} / 5
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black font-[var(--font-display)] text-black/10">
                  ≠
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-[0.85rem] uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black">The World's Rating</p>
                  <div className="text-3xl md:text-4xl font-black font-[var(--font-display)] text-black">
                    {biggestHaterMoment.avgRating?.toFixed(2)} / 5
                  </div>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-[1.1rem] font-bold font-[var(--font-main)] mb-4 text-black"
                variants={itemVariants}
              >
                That's a difference of...
              </motion.p>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-4xl md:text-6xl leading-none font-black font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={biggestDisparity} decimals={2} />
                </motion.div>
                <motion.div 
                  className="text-[1.2rem] font-medium mt-2 opacity-70 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  stars
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: SUMMARY - The Punchline */}
          {step === 3 && biggestHaterMoment && (
            <motion.div
              key="punchline"
              variants={zoomVariants}
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
                  className="m-0 text-[1.4rem] md:text-[1.6rem] font-bold font-[var(--font-main)] text-black mb-4 leading-tight"
                  variants={itemVariants}
                >
                  You were a full{' '}
                  <span className="text-[var(--color-vintage-accent)] font-black">
                    <AnimatedCounter value={biggestDisparity} decimals={2} /> stars
                  </span>
                  {' '}more critical than the average reader.
                </motion.p>
                
                <motion.p
                  className="text-[1rem] italic opacity-80 font-[var(--font-main)] mt-6 text-black"
                  variants={itemVariants}
                >
                  Maybe the world just isn't ready for the truth?
                </motion.p>

                {booksWithBothRatings > 0 && (
                  <motion.p
                    className="text-[0.85rem] opacity-70 font-[var(--font-main)] mt-4 text-black"
                    variants={itemVariants}
                  >
                    Stat calculated from{' '}
                    <span className="font-semibold">
                      <AnimatedCounter value={booksWithBothRatings} />
                    </span>{' '}
                    mutual ratings.
                  </motion.p>
                )}

              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default BiggestHater;

