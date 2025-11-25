import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';

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
  averagePages, 
  longestBook, 
  shortestBook, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <motion.h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Book Details
        </motion.h2>
        <motion.p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Your reading patterns in 2025
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 my-4 max-w-[600px] md:grid-cols-2">
        <div className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] md:col-span-full">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            📏 Average Length
          </motion.h3>
          <motion.div className="text-[2rem] font-bold text-black my-2 font-[var(--font-main)] md:text-[2.5rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {averagePages || 0}
          </motion.div>
          <motion.div className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            pages per book
          </motion.div>
        </div>
        
        {longestBook && (
          <div className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              📚 Longest Book
            </motion.h3>
            <motion.div className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {longestBook.coverImage ? (
                <img src={longestBook.coverImage} alt={longestBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.05 }}
              >
                {longestBook.title}
              </motion.div>
              <motion.div className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                by {longestBook.author}
              </motion.div>
              <motion.div className="text-[0.9rem] text-black font-bold font-[var(--font-main)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.35 }}
              >
                {longestBook.numPages} pages
              </motion.div>
            </div>
          </div>
        )}
        
        {shortestBook && (
          <div className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              📖 Shortest Book
            </motion.h3>
            <motion.div className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {shortestBook.coverImage ? (
                <img src={shortestBook.coverImage} alt={shortestBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.05 }}
              >
                {shortestBook.title}
              </motion.div>
              <motion.div className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                by {shortestBook.author}
              </motion.div>
              <motion.div className="text-[0.9rem] text-black font-bold font-[var(--font-main)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.35 }}
              >
                {shortestBook.numPages} pages
              </motion.div>
            </div>
          </div>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BookDetails;
