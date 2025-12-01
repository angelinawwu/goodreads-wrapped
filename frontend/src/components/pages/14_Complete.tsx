import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import {
  containerVariantsSlow,
  itemVariants,
  fadeScaleVariants,
  stagedHeadline,
  stagedMetric,
  stagedLabel,
} from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface TopGenre {
  name: string;
  count: number;
  percentage: number;
}

interface TopRatedBook {
  title: string;
  author: string;
  userRating?: number;
  avgRating?: number;
  coverImage?: string;
}

interface CompleteProps {
  yearBooks?: number;
  topGenres?: TopGenre[];
  topRatedBooks?: TopRatedBook[];
  uniqueGenres?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Complete: React.FC<CompleteProps> = ({
  yearBooks = 0,
  topGenres = [],
  topRatedBooks = [],
  uniqueGenres,
  onPrevPage,
  onNextPage,
}) => {
  const safeTopGenres = topGenres.slice(0, 3);
  const safeTopRatedBooks = topRatedBooks.slice(0, 3);

  return (
    <motion.div
      className="page-container flex flex-col items-center justify-center mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      {/* Top rated books - at the top, no background */}
      <motion.div
        className="w-full flex items-center justify-center mb-6"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        {safeTopRatedBooks.length > 0 ? (
          <div className="relative w-[180px] h-[140px] flex items-center justify-center">
            {safeTopRatedBooks.map((book, index) => {
              const offsets = [
                '-translate-x-8 rotate-[-5deg]',
                'translate-y-1',
                'translate-x-8 rotate-[5deg]',
              ];
              const classOffset = offsets[index] || '';
              return (
                <motion.div
                  key={book.title}
                  className={`absolute w-[80px] h-[120px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.18)] border border-[rgba(0,0,0,0.12)] bg-white ${classOffset}`}
                  variants={fadeScaleVariants}
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-black bg-gray-200">
                      No cover
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm opacity-70 font-[var(--font-main)] text-black text-center">
            Not enough ratings to surface favorite books.
          </p>
        )}
      </motion.div>
      {/* Hero intro */}
      <div className="w-full text-center mb-2">
        <motion.h2
          className="text-3xl md:text-4xl font-medium font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={stagedHeadline}
          initial="hidden"
          animate="visible"
        >
          That&apos;s a wrap on your reading year!
        </motion.h2>
      </div>

      

      {/* Stats strip */}
      <motion.div
        className="flex justify-center gap-8 my-2 max-md:flex-col max-md:gap-4"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div
            className="text-3xl md:text-4xl font-black text-[var(--color-vintage-accent)] mb-1 font-[var(--font-display)]"
            variants={stagedMetric}
            initial="hidden"
            animate="visible"
          >
            <AnimatedCounter value={yearBooks || 0} />
          </motion.div>
          <motion.div
            className="text-sm md:text-base opacity-80 font-[var(--font-main)] text-black uppercase tracking-wide"
            variants={stagedLabel}
            initial="hidden"
            animate="visible"
          >
            Books read
          </motion.div>
        </div>

        {typeof uniqueGenres === 'number' && uniqueGenres > 0 && (
          <div className="text-center">
            <motion.div
              className="text-3xl md:text-4xl font-black text-[var(--color-vintage-accent)] mb-1 font-[var(--font-display)]"
              variants={stagedMetric}
              initial="hidden"
              animate="visible"
            >
              <AnimatedCounter value={uniqueGenres} />
            </motion.div>
            <motion.div
              className="text-sm md:text-base opacity-80 font-[var(--font-main)] text-black uppercase tracking-wide"
              variants={stagedLabel}
              initial="hidden"
              animate="visible"
            >
              Genres explored
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Top genres - full width */}
      <motion.div
        className="w-full mt-4"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full bg-[var(--color-vintage-light)] border border-[rgba(0,0,0,0.08)] rounded-2xl p-4 pt-6"
          variants={itemVariants}
        >
          <motion.h3
            className="text-lg font-semibold font-[var(--font-display)] text-[var(--color-vintage-accent)]"
            variants={stagedHeadline}
            initial="hidden"
            animate="visible"
          >
            Your top genres
          </motion.h3>
          {safeTopGenres.length > 0 ? (
            <div className="space-y-2">
              {safeTopGenres.map((genre) => (
                <motion.div
                  key={genre.name}
                  className="flex items-center justify-between text-sm md:text-base"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-[var(--font-main)] text-black font-semibold">
                      {genre.name}
                    </span>
                  </div>
                  <span className="font-[var(--font-main)] text-black/70">
                    <AnimatedCounter value={genre.percentage} decimals={1} />%
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-70 font-[var(--font-main)] text-black">
              Not enough data to determine your top genres.
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Share / restart section */}
      {/* <motion.div
        className="flex flex-col items-center gap-4 mt-6"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        

        <motion.button
          className="bg-[var(--color-vintage-accent)] text-[var(--color-vintage-bg)] py-3 px-8 rounded-full text-base md:text-lg font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-2 shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-[var(--color-vintage-accent-light)] hover:-translate-y-0.5"
          onClick={onRestart}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Over
        </motion.button>
      </motion.div> */}

      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default Complete;
