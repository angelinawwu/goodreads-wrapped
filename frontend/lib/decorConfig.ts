import type { DecorPosition } from '@/components/ui/Decor';

interface DecorItem {
  id: number; // 1-10
  position: DecorPosition;
  className?: string;
}

/**
 * Decor configuration for each slide
 * Slide indices: 0-11 (12 total slides)
 * Note: Slide04_ReadingSpeed (was index 3) and Slide09_GenresChart (was index 8) are temporarily hidden
 */
export const DECOR_BY_SLIDE: Record<number, DecorItem[]> = {
  0: [{ id: 9, position: 'frame-c', className: 'scale-150 md:scale-100 origin-center' }], // Slide01_BooksRead
  1: [{ id: 1, position: 'frame-c', className: 'scale-300 md:scale-175 origin-center' }], // Slide02_AverageRating
  2: [{ id: 10, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }], // Slide03_TopFiveBooks
  // 3: Slide04_ReadingSpeed - REMOVED
  3: [{ id: 5, position: 'bottom' }], // Slide05_AuthorCount (was index 4)
  4: [{ id: 6, position: 'bottom' }, { id: 6, position: 'top' }], // Slide06_TopAuthor (was index 5)
  5: [{ id: 7, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }], // Slide07_GenreCount (was index 6)
  6: [{ id: 9, position: 'frame-c', className: 'scale-200 md:scale-75 origin-center' }], // Slide08_TopGenres (was index 7)
  // 8: Slide09_GenresChart - REMOVED
  7: [{ id: 10, position: 'top', className: 'scale-200 translate-y-1/2 md:translate-y-0 md:scale-100 origin-center' }], // Slide11_Dependability (was index 9)
  8: [{ id: 1, position: 'frame-c', className: 'scale-300 md:scale-175 origin-center' }], // Slide13_BiggestHater (was index 10)
  9: [{ id: 5, position: 'bottom' }], // Slide15_BiggestFan (was index 11)
  10: [{ id: 9, position: 'frame-c', className: 'scale-200 md:scale-100 origin-center' }], // Slide16_Thanks (was index 12)
  11: [{ id: 5, position: 'center', className: 'scale-200' }], // Slide17_Recap (was index 13)
};
