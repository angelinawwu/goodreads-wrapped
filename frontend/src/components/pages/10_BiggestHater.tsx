import React, { useState } from 'react';
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

const BiggestHater: React.FC<BiggestHaterProps> = ({ 
  biggestHaterMoment, 
  biggestDisparity = 0, 
  booksWithBothRatings = 0,
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = biggestHaterMoment ? 4 : 1; // Intro, Book Reveal, Disparity, Summary (or just Intro if no data)

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
                  The Public Disagreement
                </motion.h2>
                <motion.p 
                  className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  You weren't afraid to stand alone this year.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: BOOK REVEAL - The Subject */}
          {step === 1 && biggestHaterMoment && (
            <motion.div
              key="book-reveal"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-6 relative"
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
                  The book that got your lowest score:
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
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="flex justify-center items-end gap-6 md:gap-10 w-full mb-8 max-md:flex-col max-md:items-center max-md:gap-6"
                variants={itemVariants}
              >
                <div className="flex flex-col items-center">
                  <p className="text-[0.85rem] uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black">Your Rating</p>
                  <div className="text-[3rem] md:text-[4rem] font-black font-[var(--font-display)] text-black">
                    {biggestHaterMoment.userRating} / 5
                  </div>
                </div>
                <div className="text-[4rem] md:text-[5rem] font-black font-[var(--font-display)] text-black/10">
                  ≠
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-[0.85rem] uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)] text-black">The World's Rating</p>
                  <div className="text-[3rem] md:text-[4rem] font-black font-[var(--font-display)] text-black">
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
                  className="text-[4rem] md:text-[6rem] leading-none font-black font-[var(--font-display)] text-[var(--color-vintage-accent)]"
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
                  (Maybe the world just wasn't ready for that truth.)
                </motion.p>
                
                {booksWithBothRatings > 0 && (
                  <motion.p 
                    className="m-0 text-[0.9rem] opacity-60 font-[var(--font-main)] text-black mt-4"
                    variants={itemVariants}
                  >
                    Stat calculated from <AnimatedCounter value={booksWithBothRatings} /> mutual ratings.
                  </motion.p>
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

export default BiggestHater;

