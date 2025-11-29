import React, { useEffect, useState } from 'react';
import { motion, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';


// --- Types ---
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

const BiggestHater: React.FC<BiggestHaterProps> = ({ 
  biggestHaterMoment = { title: "A Very Loved Book", author: "Everyone Else", userRating: 1, avgRating: 4.5, coverImage: "" }, 
  biggestDisparity = 3.5, 
  booksWithBothRatings = 42,
  onPrevPage, 
  onNextPage 
}) => {
  
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Updated to 4 steps for better narrative flow: Intro, Book Reveal, Disparity, Conclusion
  const totalSteps = biggestHaterMoment ? 4 : 1; 

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
  
  const formattedAvgRating = biggestHaterMoment.avgRating?.toFixed(2) || 0;
  const formattedDisparity = biggestDisparity?.toFixed(2) || 0;

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-between p-4 overflow-hidden">
      
      {/* Dynamic Background Elements (using neutral colors to focus on typography) */}
      <motion.div 
        className="absolute top-10 left-[-50px] w-64 h-64 rounded-full bg-gray-200 opacity-10 blur-3xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-10 right-[-50px] w-80 h-80 rounded-full bg-gray-300 opacity-10 blur-3xl"
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
                🤨
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[var(--color-vintage-accent)] leading-tight mb-4">
                The Public Disagreement
              </h2>
              <p className="text-xl opacity-60 font-[var(--font-main)] italic">
                You weren't afraid to stand alone this year.
              </p>
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
              <div className="mb-6 relative">
                 <div className="w-40 h-60 rounded-lg shadow-2xl overflow-hidden rotate-[-3deg] border-4 border-white">
                  {biggestHaterMoment.coverImage ? (
                    <img src={biggestHaterMoment.coverImage} alt={biggestHaterMoment.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">📖</div>
                  )}
                </div>
              </div>
              
              <p className="text-xl text-black/60 font-[var(--font-main)] mb-2">
                The book that got your lowest score:
              </p>
              <h3 className="text-4xl font-bold font-[var(--font-display)] text-black mb-1 leading-none">
                {biggestHaterMoment.title}
              </h3>
              <p className="text-xl text-black/40 font-[var(--font-main)]">{biggestHaterMoment.author}</p>
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
              <div className="flex justify-center items-end gap-10 w-full mb-10">
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase tracking-widest opacity-60 mb-2">Your Rating</p>
                  <div className="text-5xl font-black font-[var(--font-display)] text-red-500/80">
                    {biggestHaterMoment.userRating} / 5
                  </div>
                </div>
                <div className="text-8xl font-black font-[var(--font-display)] text-black/10">
                    ≠
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase tracking-widest opacity-60 mb-2">The World's Rating</p>
                  <div className="text-6xl font-black font-[var(--font-display)] text-green-600/80">
                    {formattedAvgRating} / 5
                  </div>
                </div>
              </div>
              
              <p className="text-xl font-bold font-[var(--font-main)] mb-4">
                That's a difference of...
              </p>

              <div className="text-[6rem] leading-none font-black font-[var(--font-display)] text-[var(--color-vintage-accent)] drop-shadow-sm">
                 <AnimatedCounter value={biggestDisparity} decimals={2} />
              </div>
              <div className="text-2xl font-medium mt-2 opacity-70 font-[var(--font-main)]">stars</div>
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
                className="text-7xl mb-6"
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, type: "spring", stiffness: 200, delay: 0.1 }}
               >
                 🎤
               </motion.div>
              <p className="text-3xl font-bold font-[var(--font-main)] text-black mb-4 leading-tight">
                You were a full 
                <span className="text-[var(--color-vintage-accent)] mx-2 font-black">
                    {formattedDisparity} stars
                </span>
                more critical than the average reader.
              </p>
              
              <p className="text-lg italic opacity-80 font-[var(--font-main)] mt-6">
                (Maybe the world just wasn't ready for that truth.)
              </p>
              {booksWithBothRatings > 0 && (
                <p 
                  className="m-0 text-[0.9rem] opacity-60 font-[var(--font-main)] text-black mt-4"
                >
                  Stat calculated from {booksWithBothRatings} mutual ratings.
                </p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </div>
  );
};

export default BiggestHater;