import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';

interface BooksReadProps {
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BooksRead: React.FC<BooksReadProps> = ({ yearBooks, onPrevPage, onNextPage }) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <motion.h2 className="text-2xl font-medium mb-2 font-[var(--font-display)] text-[var(--color-vintage-accent)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Books Read
        </motion.h2>
        <motion.p className="text-lg opacity-80 m-0 font-[var(--font-main)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          In 2025, you read...
        </motion.p>
      </div>
      <div className="my-4 text-center">
        <motion.div className="text-6xl font-medium m-0 text-black font-[var(--font-main)] shadow-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {yearBooks || 0}
        </motion.div>
        <motion.div className="text-lg mt-2 opacity-90 font-[var(--font-main)] text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          books
        </motion.div>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BooksRead;
