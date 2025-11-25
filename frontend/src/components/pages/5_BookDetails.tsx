import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface BookDetailsProps {
  averagePages?: number;
  longestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  shortestBook?: {
    title: string;
    author: string;
    numPages?: number;
    coverImage?: string;
  };
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ 
  averagePages = 0, 
  longestBook, 
  shortestBook, 
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
        <motion.h2 
          className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          variants={itemVariants}
        >
          📊 Book Details
        </motion.h2>
        <motion.p 
          className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
          variants={itemVariants}
        >
          Your reading patterns in 2025
        </motion.p>
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
          <motion.h3 variants={itemVariants}>
            📏 Average Length
          </motion.h3>
          <motion.div 
            className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)] md:text-[2.5rem]"
            variants={itemVariants}
          >
            <AnimatedCounter value={averagePages} />
          </motion.div>
          <motion.div 
            className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            pages per book
          </motion.div>
        </motion.div>
        
        {longestBook && (
          <motion.div 
            className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-4"
            variants={fadeScaleVariants}
          >
            <motion.h3 variants={itemVariants}>
              📚 Longest Book
            </motion.h3>
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              variants={fadeScaleVariants}
            >
              {longestBook.coverImage ? (
                <img src={longestBook.coverImage} alt={longestBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {longestBook.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {longestBook.author}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] text-black font-bold font-[var(--font-main)]"
                variants={itemVariants}
              >
                <AnimatedCounter value={longestBook.numPages || 0} /> pages
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {shortestBook && (
          <motion.div 
            className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-4"
            variants={fadeScaleVariants}
          >
            <motion.h3 variants={itemVariants}>
              📖 Shortest Book
            </motion.h3>
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              variants={fadeScaleVariants}
            >
              {shortestBook.coverImage ? (
                <img src={shortestBook.coverImage} alt={shortestBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {shortestBook.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {shortestBook.author}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] text-black font-bold font-[var(--font-main)]"
                variants={itemVariants}
              >
                <AnimatedCounter value={shortestBook.numPages || 0} /> pages
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default BookDetails;
