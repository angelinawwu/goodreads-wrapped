'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import Navigation from './ui/Navigation';
import ProgressBar from './ui/ProgressBar';
import Decor from './ui/Decor';
import { DECOR_BY_SLIDE } from '@/lib/decorConfig';
import { getBackgroundColor, getTextColor } from '@/lib/utils';
import { slideTransitionVariants, EASING } from '@/lib/motionVariants';
import type { ReadingStats } from '@/lib/types';

// Import all slide components
import Slide01_BooksRead from './slides/Slide01_BooksRead';
import Slide02_AverageRating from './slides/Slide02_AverageRating';
import Slide03_TopFiveBooks from './slides/Slide03_TopFiveBooks';
// import Slide04_ReadingSpeed from './slides/Slide04_ReadingSpeed'; // Temporarily hidden - RSS feed doesn't provide readingDays
import Slide05_AuthorCount from './slides/Slide05_AuthorCount';
import Slide06_TopAuthor from './slides/Slide06_TopAuthor';
import Slide07_GenreCount from './slides/Slide07_GenreCount';
import Slide08_TopGenres from './slides/Slide08_TopGenres';
// import Slide09_GenresChart from './slides/Slide09_GenresChart'; // Temporarily hidden - RSS feed doesn't provide monthlyGenreData
import Slide11_Dependability from './slides/Slide11_Dependability';
import Slide13_BiggestHater from './slides/Slide13_BiggestHater';
import Slide15_BiggestFan from './slides/Slide15_BiggestFan';
import Slide16_Thanks from './slides/Slide16_Thanks';
import Slide17_Recap from './slides/Slide17_Recap';

interface StoryViewerProps {
  stats: ReadingStats;
}

const TOTAL_SLIDES = 12; // Reduced from 14 (removed ReadingSpeed and GenresChart)

export default function StoryViewer({ stats }: StoryViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (currentSlideIndex < TOTAL_SLIDES - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [currentSlideIndex]);

  const goToPrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [currentSlideIndex]);

  const { pauseAutoAdvance, onSlideAnimationComplete, isPaused } = useAutoAdvance({
    isEnabled: currentSlideIndex < TOTAL_SLIDES - 1, // Stop at last slide
    onAdvance: goToNext,
    pauseDuration: 10000,
  });

  const handleNext = () => {
    pauseAutoAdvance();
    goToNext();
  };

  const handlePrev = () => {
    pauseAutoAdvance();
    goToPrev();
  };

  useKeyboardNavigation({
    onNext: handleNext,
    onPrev: handlePrev,
    onPause: pauseAutoAdvance,
  });

  // Render current slide
  const renderSlide = () => {
    const commonProps = {
      stats,
      onAnimationComplete: onSlideAnimationComplete,
    };

    switch (currentSlideIndex) {
      case 0:
        return <Slide01_BooksRead {...commonProps} />;
      case 1:
        return <Slide02_AverageRating {...commonProps} />;
      case 2:
        return <Slide03_TopFiveBooks {...commonProps} />;
      // case 3: Slide04_ReadingSpeed - Temporarily hidden
      case 3:
        return <Slide05_AuthorCount {...commonProps} />;
      case 4:
        return <Slide06_TopAuthor {...commonProps} />;
      case 5:
        return <Slide07_GenreCount {...commonProps} />;
      case 6:
        return <Slide08_TopGenres {...commonProps} />;
      // case 8: Slide09_GenresChart - Temporarily hidden
      case 7:
        return <Slide11_Dependability {...commonProps} />;
      case 8:
        return <Slide13_BiggestHater {...commonProps} />;
      case 9:
        return <Slide15_BiggestFan {...commonProps} />;
      case 10:
        return <Slide16_Thanks {...commonProps} />;
      case 11:
        return <Slide17_Recap {...commonProps} />;
      default:
        return null;
    }
  };

  // Get decor for current slide
  const currentDecor = DECOR_BY_SLIDE[currentSlideIndex] || [];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: getBackgroundColor(currentSlideIndex),
        color: getTextColor(currentSlideIndex),
        transition: `background-color 0.4s cubic-bezier(${EASING.easeOutCubic.join(', ')}), color 0.4s cubic-bezier(${EASING.easeOutCubic.join(', ')})`,
      }}
    >
      {/* Progress bar */}
      <ProgressBar current={currentSlideIndex} total={TOTAL_SLIDES} />

      {/* Decor elements */}
      {currentDecor.map((decor, i) => (
        <Decor
          key={`${currentSlideIndex}-${i}`}
          id={decor.id}
          position={decor.position}
          className={decor.className}
        />
      ))}

      {/* Slide content with blur transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlideIndex}
          variants={slideTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Navigation
        onNext={handleNext}
        onPrev={handlePrev}
        showPrev={currentSlideIndex > 0}
        showNext={currentSlideIndex < TOTAL_SLIDES - 1}
        textColor={getTextColor(currentSlideIndex)}
      />
    </div>
  );
}
