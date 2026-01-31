'use client';

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  textColor?: string;
}

export default function Navigation({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  textColor = 'currentColor',
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
      {/* Hover transitions only on devices that support hover (not touch) */}
      <style jsx>{`
        .nav-arrow {
          opacity: 0.3;
          transition: opacity 100ms ease, transform 100ms ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .nav-arrow:hover {
            opacity: 0.8;
            transform: scale(1.05);
          }
          .nav-arrow:active {
            transform: scale(0.95);
          }
        }
      `}</style>
      {showPrev && (
        <div
          className="nav-arrow hidden md:flex fixed left-0 top-0 h-full w-1/4 z-[var(--z-nav-desktop)] cursor-pointer items-center justify-start pl-24"
          style={{ color: textColor }}
          onClick={onPrev}
        >
          <CircleChevronLeft size={48} />
        </div>
      )}
      {showNext && (
        <div
          className="nav-arrow hidden md:flex fixed right-0 top-0 h-full w-1/4 z-[var(--z-nav-desktop)] cursor-pointer items-center justify-end pr-24"
          style={{ color: textColor }}
          onClick={onNext}
        >
          <CircleChevronRight size={48} />
        </div>
      )}
    </>
  );
}
