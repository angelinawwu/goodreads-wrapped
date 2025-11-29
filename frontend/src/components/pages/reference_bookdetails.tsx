import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate, useMotionValue, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- Types ---
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

// --- Helper Components ---

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

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

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
    rotate: direction > 0 ? 10 : -10,
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
    rotate: direction < 0 ? -10 : 10,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    }
  })
};

const floatingShapeVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- Main Component ---

const BookDetails: React.FC<BookDetailsProps> = ({ 
  averagePages = 320, 
  longestBook = { title: "The Power Broker", author: "Robert Caro", numPages: 1200, coverImage: "" }, 
  shortestBook = { title: "The Metamorphosis", author: "Franz Kafka", numPages: 45, coverImage: "" }, 
  onPrevPage, 
  onNextPage 
}) => {
  
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Define the total number of internal slides
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
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-between p-4 overflow-hidden">
      
      {/* Background Elements */}
      <motion.div 
        className="absolute top-10 left-[-50px] w-64 h-64 rounded-full bg-[var(--color-vintage-accent)] opacity-10 blur-3xl"
        variants={floatingShapeVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-10 right-[-50px] w-80 h-80 rounded-full bg-orange-200 opacity-20 blur-3xl"
        variants={floatingShapeVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl relative">
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
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-8xl mb-6"
              >
                📚
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[var(--color-vintage-accent)] leading-tight mb-4">
                You covered some<br/>serious ground.
              </h2>
              <p className="text-xl opacity-60 font-[var(--font-main)] italic">
                From short stories to epic sagas...
              </p>
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
              <div className="mb-6 relative">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--color-vintage-accent)] text-white px-4 py-1 rounded-full font-[var(--font-display)] text-sm whitespace-nowrap z-10 shadow-lg rotate-[-2deg]">
                  The Marathon Read
                </div>
                <div className="w-40 h-60 rounded-lg shadow-2xl overflow-hidden rotate-[-3deg] border-4 border-white">
                  {longestBook.coverImage ? (
                    <img src={longestBook.coverImage} alt={longestBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">🏔️</div>
                  )}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold font-[var(--font-display)] text-black mb-2">
                {longestBook.title}
              </h3>
              <p className="text-xl text-black/60 font-[var(--font-main)] mb-6">{longestBook.author}</p>
              
              <div className="text-5xl font-black font-[var(--font-display)] text-[var(--color-vintage-accent)] mb-2">
                 <AnimatedCounter value={longestBook.numPages || 0} />
              </div>
              <div className="text-lg font-bold uppercase tracking-widest opacity-40">Pages</div>
              
              <p className="mt-8 text-lg italic opacity-70 font-[var(--font-main)]">
                "Hope you didn't drop this on your foot."
              </p>
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
               <div className="mb-6 relative">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full font-[var(--font-display)] text-sm whitespace-nowrap z-10 shadow-lg rotate-[2deg]">
                  The Sprint
                </div>
                <div className="w-32 h-48 rounded-lg shadow-2xl overflow-hidden rotate-[3deg] border-4 border-white">
                  {shortestBook.coverImage ? (
                    <img src={shortestBook.coverImage} alt={shortestBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">⚡</div>
                  )}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold font-[var(--font-display)] text-black mb-2">
                {shortestBook.title}
              </h3>
              <p className="text-xl text-black/60 font-[var(--font-main)] mb-6">{shortestBook.author}</p>
              
              <div className="text-5xl font-black font-[var(--font-display)] text-blue-500 mb-2">
                 <AnimatedCounter value={shortestBook.numPages || 0} />
              </div>
              <div className="text-lg font-bold uppercase tracking-widest opacity-40">Pages</div>

              <p className="mt-8 text-lg italic opacity-70 font-[var(--font-main)]">
                "Short, sweet, and to the point."
              </p>
            </motion.div>
          )}

          {/* STEP 3: AVERAGE */}
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
                className="text-7xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
               >
                 📏
               </motion.div>
               <div className="text-xl font-bold uppercase tracking-widest opacity-50 mb-4 font-[var(--font-main)]">Your Average</div>
               <div className="text-[8rem] leading-none font-black font-[var(--font-display)] text-[var(--color-vintage-accent)] drop-shadow-sm">
                  <AnimatedCounter value={averagePages} />
               </div>
               <div className="text-2xl font-medium mt-2 opacity-70 font-[var(--font-main)]">pages per book</div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <Navigation onPrevPage={handlePrev} onNextPage={handleNext} />
    </div>
  );
};

export default BookDetails;