'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { ArrowClockwise } from 'phosphor-react';
import { containerVariants, itemVariants, calculateAnimationDuration } from '@/lib/motionVariants';
import { useImageExport } from '@/hooks/useImageExport';
import { getTopAuthor, formatAuthorName } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';
import { track } from '@vercel/analytics';

export default function Slide17_Recap({ stats, onAnimationComplete }: SlideProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { exportToImage } = useImageExport();
  const router = useRouter();
  const topAuthor = getTopAuthor(stats.books);

  useEffect(() => {
    track('Finished Wrapped');
  }, []);

  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
      hasStaggeredList: true,
      listItemCount: 3,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const handleExport = async () => {
    setIsExporting(true);
    track('Download Recap');
    try {
      await exportToImage('recap-content');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleStartAgain = () => {
    router.push('/');
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Start Again button - upper right corner */}
      <motion.button
        variants={itemVariants}
        onClick={() => {
          track('Start again');
          handleStartAgain();
        }}
        className="absolute top-8 right-8 flex items-center gap-2 text-[var(--text-1)] hover:scale-105 transition-transform z-10"
        aria-label="Start again"
      >
        <ArrowClockwise size={20} weight="regular" />
        <span className="text-sm font-medium">Start again</span>
      </motion.button>
      {/* Exportable content */}
      <div
        id="recap-content"
        className="w-full max-w-2xl bg-[var(--bg-1)] text-[#331700] p-8 rounded-lg"
      >
        {/* Top 3 book covers */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
          {stats.topRatedBooks.slice(0, 3).map((book, i) => (
            <div
              key={i}
              className="w-24 h-36 rounded shadow-lg overflow-hidden"
              style={{
                transform: `rotate(${(i - 1) * 5}deg)`,
              }}
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--bg-5)] flex items-center justify-center text-2xl">
                  📖
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          {/* Books read */}
          <div className="text-center">
            <div className="text-6xl font-bold font-[family-name:var(--font-display)]">
              {stats.yearBooks}
            </div>
            <div className="text-sm opacity-70 uppercase tracking-wide mt-2">books read</div>
          </div>

          {/* Average rating */}
          <div className="text-center">
            <div className="text-6xl font-bold font-[family-name:var(--font-display)]">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm opacity-70 uppercase tracking-wide mt-2">avg rating</div>
          </div>
        </motion.div>

        {/* Bottom row: Genres and Author */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-12"
        >
          {/* Top 3 genres */}
          <div>
            <div className="text-sm font-bold uppercase tracking-wide mb-3">Top Genres</div>
            <div className="space-y-2">
              {stats.topGenres.slice(0, 3).map((genre, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{genre.name}</span>
                  <span className="opacity-70">{genre.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top author */}
          <div>
            <div className="text-sm font-bold uppercase tracking-wide mb-3">Top Author</div>
            {topAuthor && (
              <div>
                <div className="font-semibold">{formatAuthorName(topAuthor.name)}</div>
                <div className="text-sm opacity-70">{topAuthor.count} books</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-black/10">
          <div className="text-xs opacity-50">Goodreads Wrapped 2025</div>
        </div>
      </div>

      {/* Download button (not in exported image) */}
      <motion.button
        variants={itemVariants}
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-6 py-3 mt-8 bg-[var(--bg-4)] text-[var(--text-3)] rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={20} />
        {isExporting ? 'Exporting...' : 'Download'}
      </motion.button>
    </motion.div>
  );
}
