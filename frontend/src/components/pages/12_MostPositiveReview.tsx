import React, { useState } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface SentimentData {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  fullReview: string;
}

interface MostPositiveReviewProps {
  mostPositiveReview?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
    sentiment?: SentimentData;
  };
  booksWithReviews?: number;
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

const MostPositiveReview: React.FC<MostPositiveReviewProps> = ({ 
  mostPositiveReview, 
  booksWithReviews = 0,
  onPrevPage, 
  onNextPage 
}) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = mostPositiveReview ? 3 : 1; // Intro, Target (Book + Rating), The Positive (Review + Sentiment) (or just Intro if no data)

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
      <div className="flex-1 flex items-center justify-center w-full max-w-[700px] relative min-h-[400px]">
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
                  The Year's Most Positive Review
                </motion.h2>
                <motion.p 
                  className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={itemVariants}
                >
                  When you couldn't hold back your enthusiasm.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 1: TARGET - Book Reveal & Rating */}
          {step === 1 && mostPositiveReview && (
            <motion.div
              key="target"
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
                  className="w-[160px] h-[240px] rounded-lg overflow-hidden shadow-2xl rotate-[3deg] border-4 border-white mx-auto"
                  variants={fadeScaleVariants}
                >
                  {mostPositiveReview.coverImage ? (
                    <img src={mostPositiveReview.coverImage} alt={mostPositiveReview.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
                  )}
                </motion.div>
                {mostPositiveReview.userRating && (
                  <motion.div 
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-lg font-bold shadow-xl rotate-[-5deg] border-2 border-white"
                    variants={itemVariants}
                  >
                    {mostPositiveReview.userRating}/5
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                className="text-center mb-4"
                variants={itemVariants}
              >
                <motion.h3 
                  className="text-[2rem] font-bold mb-1 font-[var(--font-display)] text-black leading-none mt-4"
                  variants={itemVariants}
                >
                  {mostPositiveReview.title}
                </motion.h3>
                <motion.div 
                  className="text-[1rem] opacity-40 mb-6 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  by {mostPositiveReview.author}
                </motion.div>
                <motion.p 
                  className="text-[1rem] italic opacity-70 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  This book received your most positive review of the year.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: THE POSITIVE - Review Text & Sentiment Score */}
          {step === 2 && mostPositiveReview && (
            <motion.div
              key="the-positive"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div 
                className="mb-8 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-inner w-full max-w-xl"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-[1.2rem] leading-snug italic text-black/90 font-[var(--font-main)] max-md:text-[1rem]"
                  variants={itemVariants}
                >
                  "{mostPositiveReview.sentiment?.fullReview || 'No review text available'}"
                </motion.p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center"
                variants={itemVariants}
              >
                <motion.p 
                  className="text-[1rem] font-bold uppercase tracking-widest opacity-60 mb-1 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  Sentiment Score
                </motion.p>
                <motion.div 
                  className="text-[4rem] md:text-[5rem] leading-none font-black font-[var(--font-display)] text-green-600 drop-shadow-sm"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={mostPositiveReview.sentiment?.comparative || 0} decimals={3} />
                </motion.div>
                <motion.p 
                  className="text-[1rem] font-medium mt-2 opacity-70 font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  ({(mostPositiveReview.sentiment?.positive?.length || 0)} positive terms detected)
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

export default MostPositiveReview;
