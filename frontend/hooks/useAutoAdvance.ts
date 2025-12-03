import { useEffect, useRef, useState } from 'react';

interface UseAutoAdvanceOptions {
  isEnabled: boolean;
  onAdvance: () => void;
  pauseDuration?: number; // ms to pause after manual interaction
}

export function useAutoAdvance({
  isEnabled,
  onAdvance,
  pauseDuration = 10000, // 10s pause after manual interaction
}: UseAutoAdvanceOptions) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlideComplete, setCurrentSlideComplete] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const advanceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Called when user manually navigates
  const pauseAutoAdvance = () => {
    setIsPaused(true);
    setCurrentSlideComplete(false);

    // Clear any existing timers
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);

    // Resume after pauseDuration
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, pauseDuration);
  };

  // Called when slide animations complete
  const onSlideAnimationComplete = () => {
    setCurrentSlideComplete(true);
  };

  // Auto-advance when conditions are met
  useEffect(() => {
    if (!isEnabled || isPaused || !currentSlideComplete) {
      return;
    }

    // Wait 3s after animations complete, then advance
    advanceTimerRef.current = setTimeout(() => {
      onAdvance();
      setCurrentSlideComplete(false);
    }, 3000);

    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [isEnabled, isPaused, currentSlideComplete, onAdvance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  return {
    pauseAutoAdvance,
    onSlideAnimationComplete,
    isPaused,
  };
}
