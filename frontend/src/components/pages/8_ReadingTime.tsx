import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface ReadingTimeProps {
  averageReadingTime?: number;
  fastestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  slowestRead?: {
    title: string;
    author: string;
    readingDays?: number;
    coverImage?: string;
  };
  booksWithReadingTime?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  averageReadingTime = 0, 
  fastestRead, 
  slowestRead, 
  booksWithReadingTime = 0,
  onPrevPage, 
  onNextPage 
}) => {
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
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">⏱️ Reading Speed</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How fast you read in 2025</p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 gap-4 my-4 max-w-[600px] md:grid-cols-2"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] md:col-span-full"
          variants={itemVariants}
        >
          <motion.h3 
            className="m-0 text-[1.3rem] font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            📊 Average Time
          </motion.h3>
          <motion.div 
            className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]"
            variants={itemVariants}
          >
            <AnimatedCounter value={averageReadingTime} decimals={2} />
          </motion.div>
          <motion.div 
            className="text-[1.2rem] opacity-80 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            days per book
          </motion.div>
        </motion.div>
        
        {fastestRead && (
          <motion.div 
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]"
            variants={fadeScaleVariants}
          >
            <motion.h3 
              className="m-0 text-[1.3rem] font-[var(--font-main)] text-black"
              variants={itemVariants}
            >
              ⚡ Fastest Read
            </motion.h3>
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              variants={fadeScaleVariants}
            >
              {fastestRead.coverImage ? (
                <img src={fastestRead.coverImage} alt={fastestRead.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {fastestRead.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {fastestRead.author}
              </motion.div>
              <motion.div 
                className="text-[1.1rem] text-black font-bold font-[var(--font-main)]"
                variants={itemVariants}
              >
                <AnimatedCounter value={fastestRead.readingDays || 0} /> days
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {slowestRead && (
          <motion.div 
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]"
            variants={fadeScaleVariants}
          >
            <motion.h3 
              className="m-0 text-[1.3rem] font-[var(--font-main)] text-black"
              variants={itemVariants}
            >
              🐌 Slowest Read
            </motion.h3>
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              variants={fadeScaleVariants}
            >
              {slowestRead.coverImage ? (
                <img src={slowestRead.coverImage} alt={slowestRead.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {slowestRead.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {slowestRead.author}
              </motion.div>
              <motion.div 
                className="text-[1.1rem] text-black font-bold font-[var(--font-main)]"
                variants={itemVariants}
              >
                <AnimatedCounter value={slowestRead.readingDays || 0} /> days
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="text-center my-4 opacity-80"
        variants={itemVariants}
      >
        <p className="m-0 text-[0.9rem] font-[var(--font-main)] text-black">
          Based on <AnimatedCounter value={booksWithReadingTime} /> books with reading dates
        </p>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default ReadingTime;
