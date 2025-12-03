export interface Book {
  title: string;
  author: string;
  rating?: string;
  dateRead?: string;
  dateAdded?: string;
  dateStarted?: string;
  readingDays?: number;
  userRating?: number;
  avgRating?: number;
  numRatings?: number;
  numPages?: number;
  coverImage?: string;
  genres?: string[];
  review?: string;
  sentiment?: {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
    fullReview: string;
  };
}

export interface TopGenre {
  name: string;
  count: number;
  percentage: number;
}

export interface ReadingStats {
  message?: string;
  username: string;
  year: string;
  totalBooks: number;
  yearBooks: number;
  books: Book[];

  // Rating stats
  averageRating: number;
  booksWithRatings: number;
  topRatedBooks: Book[];

  // Page stats
  averagePages?: number;
  longestBook?: Book;
  shortestBook?: Book;
  booksWithPages?: number;

  // Genre stats
  mostPopularGenre?: string;
  uniqueGenres: number;
  genreCounts: { [key: string]: number };
  topGenres: TopGenre[];
  monthlyGenreData?: {
    [month: string]: {
      [genre: string]: number;
    };
  };
  monthlyBookTotals?: {
    [month: string]: number;
  };

  // Reading time stats
  averageReadingTime?: number;
  fastestRead?: Book;
  slowestRead?: Book;
  booksWithReadingTime?: number;

  // Dependability
  toReadAddedCount: number;
  toReadReadCount: number;
  dependability: number;

  // Special moments
  biggestHaterMoment?: Book;
  biggestDisparity?: number;
  biggestFanMoment?: Book;
  biggestFanDisparity?: number;
  booksWithBothRatings?: number;

  // Sentiment
  mostScathingReview?: Book;
  mostPositiveReview?: Book;
  booksWithReviews?: number;

  url?: string;
}

export interface UserProfile {
  name: string;
  profilePicture?: string;
}

export interface SlideProps {
  stats: ReadingStats;
  onAnimationComplete?: () => void;
}
