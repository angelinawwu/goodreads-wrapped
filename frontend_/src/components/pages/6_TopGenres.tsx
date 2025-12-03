import React, { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  containerVariantsSlow,
  itemVariants,
  stagedHeadline,
  stagedSubheadline,
} from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface TopGenresProps {
  genreCounts?: { [key: string]: number };
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}


const zoomVariants: Variants = {
  enter: {
    scale: 0.8,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: { type: 'spring', stiffness: 200, damping: 20 },
      opacity: { duration: 0.3 },
    },
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: {
      scale: { type: 'spring', stiffness: 200, damping: 20 },
      opacity: { duration: 0.2 },
    },
  },
};

const TopGenres: React.FC<TopGenresProps> = ({
  genreCounts,
  yearBooks = 0,
  onPrevPage,
  onNextPage,
}) => {
  const [step, setStep] = useState(0);
  const totalSteps = 2;

  useEffect(() => {
    if (step < totalSteps - 1) {
      const timer = setTimeout(() => setStep(step + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, totalSteps]);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onNextPage();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
    else onPrevPage();
  };

  const topGenres = genreCounts 
    ? Object.entries(genreCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
    : [];

  const uniqueGenresCount = genreCounts ? Object.keys(genreCounts).length : 0;

  return (
    <motion.div
      className="page-container flex flex-col items-center justify-center mt-16 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <div className="flex-1 flex items-center justify-center w-full max-w-[600px] relative min-h-[320px]">
        <AnimatePresence initial={false} mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div className="pt-6 w-full text-center" variants={itemVariants}>
              <motion.h2
                className="text-2xl font-medium mb-4 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
                variants={stagedHeadline}
                initial="hidden"
                animate="visible"
              >
                In 2025, you read across {uniqueGenresCount} different genres.
              </motion.h2>
                <motion.p
                  className="text-lg opacity-80 m-0 font-[var(--font-main)] italic"
                  variants={stagedSubheadline}
                  initial="hidden"
                  animate="visible"
                >
                  Here were your top 5.
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="list"
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full flex flex-col items-center text-center"
            >
              <motion.div
                className="w-full my-4"
                variants={containerVariantsSlow}
                initial="hidden"
                animate="visible"
              >
                {topGenres.length > 0 ? (
                  topGenres.map(([genre, count]) => {
                    const percentage = ((count as number) / (yearBooks || 1)) * 100;
                    return (
                      <motion.div
                        key={genre}
                        className="flex items-center p-3 transition-all duration-200 max-md:flex-col max-md:text-center max-md:gap-4"
                        variants={itemVariants}
                      >
                        <div className="flex-1 text-left max-md:text-center">
                          <div className="text-lg font-bold mb-1 font-[var(--font-main)] text-black">
                            {genre}
                          </div>
                          <div className="text-base opacity-80 text-black font-[var(--font-main)]">
                            <AnimatedCounter value={count as number} /> books
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color-vintage-accent)] min-w-[60px] text-right font-[var(--font-main)] max-md:text-center">
                          <AnimatedCounter value={percentage} decimals={0} />%
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div className="text-center p-8 opacity-70" variants={itemVariants}>
                    <p className="text-[1.2rem] m-0 font-[var(--font-main)] text-black">No genre data available</p>
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

export default TopGenres;
