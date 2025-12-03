import React, { useEffect, useState } from 'react';
import { motion, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- Types ---
interface DependabilityProps {
  dependability?: number;
  toReadReadCount?: number;
  toReadAddedCount?: number;
  year?: string;
  onPrevPage: () => void;
  onNextPage: () => void;
}

// NOTE: containerVariantsSlow and itemVariants removed as they were not defined.
// The primary movement is now handled by slideVariants.

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
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.4 },
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    }
  })
};

// --- Main Component ---

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability = 0.65, 
  toReadReadCount = 13, 
  toReadAddedCount = 20, 
  year = '2025',
  onPrevPage, 
  onNextPage 
}) => {
  
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Flow: Intro, Score Reveal, Breakdown, Conclusion (4 steps)
  const totalSteps = 4; 

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
  const totalBooks = toReadAddedCount;

  const summaryText = dependability >= 0.8 
    ? "You're incredibly reliable with your reading goals! 🎯"
    : dependability >= 0.5
    ? "You're doing well at following through on your reading plans! 📚"
    : "There's always room to improve your reading follow-through! 💪";
    
  const summaryColor = dependability >= 0.8 
    ? "text-green-600"
    : dependability >= 0.5
    ? "text-yellow-600"
    : "text-red-500";


  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-between p-4 overflow-hidden">
      
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
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[var(--color-vintage-accent)] leading-tight mb-4">
                Your Reading Dependability
              </h2>
              <p className="text-xl opacity-80 font-[var(--font-main)] italic">
                How well you follow through on your reading goals this year.
              </p>
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
              <p className="text-2xl font-bold uppercase tracking-widest opacity-60 mb-2 font-[var(--font-main)]">
                Follow-Through Rate
              </p>
              <motion.div 
                className={`text-[5rem] md:text-[8rem] font-black font-[var(--font-display)] ${summaryColor} leading-none`}
                animate={{ scale: [0.9, 1.05, 1] }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              >
                <AnimatedCounter value={dependabilityPercent} decimals={1} />%
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
              className="absolute w-full flex flex-col items-center text-center max-w-md"
            >
              <div className="flex items-center gap-6 p-6 bg-black/5 rounded-xl shadow-lg border border-black/10 w-full">
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className="text-[3rem] font-bold text-black font-[var(--font-main)] leading-none"
                  >
                    <AnimatedCounter value={toReadReadCount} />
                  </motion.div>
                  <motion.div 
                    className="text-[1rem] opacity-80 text-center font-[var(--font-main)] text-black"
                  >
                    books read in {year}
                  </motion.div>
                </div>
                <div className="text-3xl text-black/50 font-bold font-[var(--font-main)]">/</div>
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className="text-[3rem] font-bold text-black font-[var(--font-main)] leading-none"
                  >
                    <AnimatedCounter value={totalBooks} />
                  </motion.div>
                  <motion.div 
                    className="text-[1rem] opacity-80 text-center font-[var(--font-main)] text-black"
                  >
                    total goals added
                  </motion.div>
                </div>
              </div>
              <p className="text-sm opacity-60 font-[var(--font-main)] text-black mt-4">
                This measures books you read in {year} that were also added to your shelves in {year}.
              </p>
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
              className="absolute w-full flex flex-col items-center text-center max-w-lg"
            >
              <motion.div 
                className="text-center p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-xl border border-gray-200"
              >
                <p className={`m-0 text-3xl font-bold font-[var(--font-main)] ${summaryColor} mb-2`}>
                  {summaryText}
                </p>
                <p className="m-0 text-lg text-black/80 font-[var(--font-main)]">
                  You set goals, and you crushed them! Or... maybe you're leaving a little something for next year.
                </p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </div>
  );
};

export default Dependability;