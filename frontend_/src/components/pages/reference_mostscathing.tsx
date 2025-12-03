import React, { useEffect, useState } from 'react';
import { motion, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- Types ---
interface SentimentData {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  fullReview: string;
}

interface MostScathingReviewProps {
  mostScathingReview?: {
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

// --- Helper Components (Inline for portability) ---

const Navigation = ({ onPrevPage, onNextPage }: { onPrevPage: () => void, onNextPage: () => void }) => {
  return (
    <div className="flex justify-between w-full max-w-xs mx-auto mt-auto pb-8 z-50 relative">
      <button 
        onClick={onPrevPage}
        className="px-6 py-3 rounded-full bg-black/5 backdrop-blur-md text-black/60 hover:bg-black/10 hover:text-black transition-all font-medium border border-black/5 font-[var(--font-main)]"
      >
        Back
      </button>
      <button 
        onClick={onNextPage}
        className="px-6 py-3 rounded-full bg-[var(--color-vintage-accent)] text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all font-bold shadow-lg font-[var(--font-main)]"
      >
        Next
      </button>
    </div>
  );
};

const AnimatedCounter = ({ value, decimals = 0 }: { value: number, decimals?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 2,
      ease: "circOut", 
    });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

// --- Animations ---

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotate: direction > 0 ? 5 : -5,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.4 },
      rotate: { duration: 0.4, ease: "backOut" }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotate: direction < 0 ? -5 : 5,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    }
  })
};

// --- Main Component ---

const MostScathingReview: React.FC<MostScathingReviewProps> = ({ 
  mostScathingReview = { 
    title: "The Bestseller Everyone Loved", 
    author: "Fictional Author", 
    userRating: 1, 
    avgRating: 4.2, 
    coverImage: "",
    sentiment: { 
      score: -0.8, 
      comparative: -0.75, 
      positive: ['well-intentioned'], 
      negative: ['clichéd', 'boring', 'unnecessary', 'painful'], 
      fullReview: "This book was a truly clichéd and boring experience. The ending felt completely unnecessary, and reading the middle section was actually painful." 
    } 
  }, 
  booksWithReviews = 18,
  onPrevPage, 
  onNextPage 
}) => {
  
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // New flow: Intro, Target, The Scathing, The Verdict (4 steps)
  const totalSteps = mostScathingReview ? 4 : 1; 

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
  
  const negativeWordCount = mostScathingReview.sentiment?.negative?.length || 0;
  const sentimentScore = mostScathingReview.sentiment?.comparative || 0;

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-between p-4 overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <motion.div 
        className="absolute top-10 left-[-50px] w-64 h-64 rounded-full bg-red-200 opacity-10 blur-3xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-10 right-[-50px] w-80 h-80 rounded-full bg-red-300 opacity-10 blur-3xl"
        animate={{ y: [0, 30, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl relative">
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
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                className="text-8xl mb-6"
              >
                💥
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-red-600 leading-tight mb-4">
                The Year's Most Scathing Critique
              </h2>
              <p className="text-xl opacity-60 font-[var(--font-main)] italic">
                When you held absolutely nothing back.
              </p>
            </motion.div>
          )}

          {/* STEP 1: THE TARGET - Book Reveal & Rating */}
          {step === 1 && mostScathingReview && (
            <motion.div
              key="target-book"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <div className="mb-6 relative">
                 <div className="w-40 h-60 rounded-lg shadow-2xl overflow-hidden rotate-[3deg] border-4 border-white">
                  {mostScathingReview.coverImage ? (
                    <img src={mostScathingReview.coverImage} alt={mostScathingReview.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">🎯</div>
                  )}
                </div>
                <div className="absolute -bottom-4 right-1/2 translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold shadow-xl rotate-[-5deg] border-2 border-white">
                  {mostScathingReview.userRating}/5
                </div>
              </div>
              
              <h3 className="text-4xl font-bold font-[var(--font-display)] text-black mb-1 leading-none mt-4">
                {mostScathingReview.title}
              </h3>
              <p className="text-xl text-black/40 font-[var(--font-main)] mb-6">{mostScathingReview.author}</p>
              
              <p className="text-lg italic opacity-70 font-[var(--font-main)]">
                This book received your most negative review of the year.
              </p>
            </motion.div>
          )}

          {/* STEP 2: THE SCATHING - Review Text & Sentiment Score */}
          {step === 2 && mostScathingReview && (
            <motion.div
              key="the-scathing"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <div className="mb-8 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-inner w-full max-w-xl">
                <p 
                  className="text-2xl leading-snug italic text-black/90 font-[var(--font-main)] max-md:text-xl"
                >
                  "{mostScathingReview.sentiment?.fullReview || 'No review text available'}"
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xl font-bold uppercase tracking-widest opacity-60 mb-1 font-[var(--font-main)]">
                  Sentiment Score
                </p>
                <div className="text-7xl leading-none font-black font-[var(--font-display)] text-red-600 drop-shadow-sm">
                   <AnimatedCounter value={sentimentScore} decimals={3} />
                </div>
                <p className="text-xl font-medium mt-2 opacity-70 font-[var(--font-main)]">
                  ({negativeWordCount} negative terms detected)
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </div>
  );
};

export default MostScathingReview;