import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface TopGenresProps {
  genreCounts?: { [key: string]: number };
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const TopGenres: React.FC<TopGenresProps> = ({ 
  genreCounts, 
  yearBooks = 0, 
  onPrevPage, 
  onNextPage 
}) => {
  const topGenres = genreCounts 
    ? Object.entries(genreCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
    : [];

  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={itemVariants}
        >
          🏆 Top Genres
        </motion.h2>
        <motion.p 
          className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
          variants={itemVariants}
        >
          Your favorite genres in 2025
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="max-w-[600px] w-full my-4"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        {topGenres.length > 0 ? (
          topGenres.map(([genre, count], index) => {
            const percentage = ((count as number) / (yearBooks || 1)) * 100;
            return (
              <motion.div 
                key={genre} 
                className="flex items-center my-2 p-3 rounded-xl bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,210,245,0.3)] max-md:flex-col max-md:text-center max-md:gap-4"
                variants={itemVariants}
              >
                <div className="mr-6 min-w-[60px] max-md:mr-0">
                  <span className="text-[1.5rem] font-bold text-black bg-[rgba(255,210,245,0.4)] px-4 py-2 rounded-full inline-block min-w-[40px] text-center font-[var(--font-main)]">#{index + 1}</span>
                </div>
                <div className="flex-1 text-left max-md:text-center">
                  <div className="text-[1.3rem] font-bold mb-1 font-[var(--font-main)] text-black">{genre}</div>
                  <div className="text-[1rem] opacity-80 text-black font-[var(--font-main)]">
                    <AnimatedCounter value={count as number} />/<AnimatedCounter value={yearBooks} /> books
                  </div>
                </div>
                <div className="text-[1.5rem] font-bold text-black min-w-[60px] text-right font-[var(--font-main)] max-md:text-center">
                  <AnimatedCounter value={percentage} decimals={0} />%
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            className="text-center p-8 opacity-70"
            variants={itemVariants}
          >
            <p className="text-[1.2rem] m-0 font-[var(--font-main)] text-black">No genre data available</p>
          </motion.div>
        )}
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default TopGenres;
