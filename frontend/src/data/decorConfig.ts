import type { DecorPosition } from '../components/Decor';

export interface DecorItem {
  id: number;
  position: DecorPosition;
  className?: string;
}

export const decorMap: { [key: string]: DecorItem[] } = {
  '/': [
    { id: 9, position: 'frame-c', className: 'scale-150 origin-center' }
  ],
  '/books-read': [
    { id: 3, position: 'top' }
  ],
  '/average-rating': [
    { id: 4, position: 'top' }
  ],
  '/book-details': [
    { id: 5, position: 'bottom' },
  ],
  '/top-genres': [
    { id: 6, position: 'top' }
  ],
  '/genres-over-time': [
    { id: 7, position: 'top' }
  ],
  '/reading-time': [
    { id: 8, position: 'top' }
  ],
  '/dependability': [
    { id: 9, position: 'frame-c', className: 'scale-150 origin-center' }
  ],
  '/biggest-hater': [
    { id: 10, position: 'frame-c', className: 'scale-180 origin-center' }
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

