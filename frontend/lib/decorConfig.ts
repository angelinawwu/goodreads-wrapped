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
  0: [{ id: 1, position: 'top' }],
  1: [{ id: 2, position: 'bottom' }],
  2: [{ id: 3, position: 'top' }],
  3: [{ id: 4, position: 'bottom' }],
  4: [{ id: 5, position: 'top' }],
  5: [{ id: 6, position: 'center' }],
  6: [{ id: 7, position: 'bottom' }],
  7: [{ id: 8, position: 'top' }],
  8: [{ id: 9, position: 'bottom' }],
  9: [{ id: 10, position: 'top' }],
  10: [{ id: 1, position: 'corner-tl' }, { id: 2, position: 'corner-br' }],
  11: [{ id: 3, position: 'corner-tr' }],
  12: [{ id: 4, position: 'corner-bl' }],
  13: [{ id: 5, position: 'center' }],
  14: [{ id: 6, position: 'top' }],
  15: [{ id: 7, position: 'bottom' }],
  16: [
    { id: 8, position: 'top' },
    { id: 9, position: 'bottom' },
  ],
};
