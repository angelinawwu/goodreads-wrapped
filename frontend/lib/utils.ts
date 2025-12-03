import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Get background color by index (rotates through palette)
 */
export function getBackgroundColor(index: number): string {
  const colors = [
    'var(--bg-1)',
    'var(--bg-2)',
    'var(--bg-3)',
    'var(--bg-4)',
    'var(--bg-5)',
    'var(--bg-6)',
    'var(--bg-7)',
  ];
  return colors[index % colors.length];
}

/**
 * Get text color that corresponds to the background color by index
 * Each background color is paired with its corresponding text color at the same index
 */
export function getTextColor(bgIndex: number): string {
  const colors = [
    'var(--text-1)', // Dark Beige - pairs with Beige bg
    'var(--text-2)', // Dark Brown - pairs with Tan bg
    'var(--text-3)', // Light Green - pairs with Sage bg
    'var(--text-4)', // Light Red - pairs with Maroon bg
    'var(--text-5)', // Dark Grey - pairs with Stone bg
    'var(--text-6)', // Dark Orange - pairs with Rust bg
    'var(--text-7)', // Light Blue - pairs with Navy bg
  ];
  return colors[bgIndex % colors.length];
}

/**
 * Calculate percentage more than average (assuming average is 12 books/year)
 */
export function calculatePercentageMore(booksRead: number): number {
  const AVERAGE_BOOKS = 12;
  const percentMore = ((booksRead - AVERAGE_BOOKS) / AVERAGE_BOOKS) * 100;
  return Math.round(percentMore);
}

/**
 * Get dependability message based on score
 */
export function getDependabilityMessage(score: number): string {
  if (score <= 0.25) {
    return "Yikes. Dream big, I guess?";
  }
  if (score <= 0.50) {
    return "You know, it could be worse.";
  }
  if (score <= 0.75) {
    return "More than half! Not bad.";
  }
  return "That's pretty good. I'd trust you to follow through on your promises.";
}

/**
 * Find top author from books list
 */
export function getTopAuthor(books: any[]): { name: string; count: number } | null {
  if (!books || books.length === 0) return null;

  const authorCounts: { [key: string]: number } = {};

  books.forEach(book => {
    if (book.author) {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    }
  });

  const topAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];

  return topAuthor ? { name: topAuthor[0], count: topAuthor[1] } : null;
}
