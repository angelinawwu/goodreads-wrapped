import type { DecorPosition } from '@/components/ui/Decor';

interface DecorItem {
  id: number; // 1-10
  position: DecorPosition;
  className?: string;
}

/**
 * Decor configuration for each slide
 * Slide indices: 0-16 (17 total slides)
 */
export const DECOR_BY_SLIDE: Record<number, DecorItem[]> = {
  0: [{ id: 9, position: 'frame-c', className: 'scale-150 origin-center' }],
  1: [{ id: 1, position: 'frame-c', className: 'scale-300 md:scale-175 origin-center' }],
  2: [{ id: 10, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }],
  3: [{ id: 4, position: 'top' }],
  4: [{ id: 5, position: 'bottom' }],
  5: [{ id: 6, position: 'bottom' }, { id: 6, position: 'top' }],
  6: [{ id: 7, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }],
  7: [{ id: 8, position: 'bottom' }],
  8: [{ id: 9, position: 'bottom' }],
  9: [{ id: 10, position: 'top', className: 'scale-200 translate-y-1/2 md:translate-y-0 md:scale-100 origin-center' }],
  10: [{ id: 1, position: 'frame-c', className: 'scale-300 md:scale-175 origin-center' }],
  11: [{ id: 5, position: 'bottom' }],
  12: [{ id: 9, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }],
  13: [{ id: 5, position: 'center', className: 'scale-200' }],
  14: [{ id: 6, position: 'bottom' }, { id: 6, position: 'top', className: 'block md:hidden' }],
  15: [{ id: 7, position: 'bottom' }],
  16: [
    { id: 8, position: 'top' },
    { id: 9, position: 'bottom' },
  ],
};
