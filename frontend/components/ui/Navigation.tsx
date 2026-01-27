'use client';

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
  showPrev?: boolean;
  showNext?: boolean;
}

export default function Navigation({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
}: NavigationProps) {
  return (
    <>
      {/* Mobile tap zones - 50% width each */}
      {showPrev && (
        <div
          className="fixed left-0 top-0 h-full w-1/2 z-[var(--z-nav-mobile)] cursor-pointer md:hidden"
          onClick={onPrev}
          aria-label="Previous slide"
        />
      )}
      {showNext && (
        <div
          className="fixed right-0 top-0 h-full w-1/2 z-[var(--z-nav-mobile)] cursor-pointer md:hidden"
          onClick={onNext}
          aria-label="Next slide"
        />
      )}

      {/* Desktop arrow buttons - 25% width zones */}
      {showPrev && (
        <div
          className="hidden md:flex fixed left-0 top-0 h-full w-1/4 z-10 cursor-pointer items-center justify-start pl-24 text-black/30 hover:text-[var(--bg-4)] transition-colors"
          onClick={onPrev}
        >
          <CircleChevronLeft size={48} />
        </div>
      )}
      {showNext && (
        <div
          className="hidden md:flex fixed right-0 top-0 h-full w-1/4 z-10 cursor-pointer items-center justify-end pr-24 text-black/30 hover:text-[var(--bg-4)] transition-colors"
          onClick={onNext}
        >
          <CircleChevronRight size={48} />
        </div>
      )}
    </>
  );
}
