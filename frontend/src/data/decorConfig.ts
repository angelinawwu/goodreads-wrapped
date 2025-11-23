import type { DecorPosition } from '../components/Decor';

export interface DecorItem {
  id: number;
  position: DecorPosition;
}

export const decorMap: { [key: string]: DecorItem[] } = {
  '/': [
    { id: 1, position: 'top' },
    { id: 2, position: 'bottom' }
  ],
  '/desktop': [
    { id: 3, position: 'top' },
    { id: 4, position: 'bottom' }
  ],
  '/books-read': [
    { id: 5, position: 'top' }
  ],
  '/average-rating': [
    { id: 6, position: 'bottom' }
  ],
  '/book-details': [
    { id: 8, position: 'corner-tr' },
    { id: 8, position: 'corner-bl' }
  ],
  '/top-genres': [
    { id: 9, position: 'top' }
  ],
  '/genres-over-time': [
    { id: 10, position: 'bottom' }
  ],
  '/reading-time': [
    { id: 1, position: 'top' }
  ],
  '/dependability': [
    { id: 2, position: 'bottom' }
  ],
  '/biggest-hater': [
    { id: 3, position: 'top' }
  ],
  '/most-scathing-review': [
    { id: 4, position: 'bottom' }
  ],
  '/most-positive-review': [
    { id: 5, position: 'top' }
  ],
  '/book-list': [
    { id: 6, position: 'frame' }
  ],
  '/complete': [
    { id: 7, position: 'top' },
    { id: 7, position: 'bottom' }
  ]
};

