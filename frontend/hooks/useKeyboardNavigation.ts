import { useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  onNext: () => void;
  onPrev: () => void;
  onPause: () => void;
}

export function useKeyboardNavigation({
  onNext,
  onPrev,
  onPause,
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ': // Space bar
          e.preventDefault();
          onPause();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPause();
          onPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onPause]);
}
