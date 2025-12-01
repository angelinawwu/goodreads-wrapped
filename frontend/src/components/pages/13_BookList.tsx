import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';

interface Book {
  title: string;
  author: string;
  userRating?: number;
  numPages?: number;
  coverImage?: string;
  readingDays?: number;
}

interface BookListProps {
  books?: Book[];
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BookList: React.FC<BookListProps> = ({ books, onPrevPage, onNextPage }) => {
  const getGridCols = (count: number) => {
    if (count === 1) return 'repeat(1, 1fr)';
    if (count === 2 || count === 4) return 'repeat(2, 1fr)';
    if (count === 3 || count === 5 || count === 6 || count === 9) return 'repeat(3, 1fr)';
    if (count === 7 || count === 8 || count === 11 || count === 12) return 'repeat(4, 1fr)';
    if (count === 10) return 'repeat(5, 1fr)';
    return 'repeat(auto-fit, minmax(50px, 1fr))';
  };

  const bookCount = books?.length || 0;
  const gridStyle = bookCount <= 12 ? { gridTemplateColumns: getGridCols(bookCount) } : {};

  const getBookSizeClasses = (count: number) => {
    if (count <= 12) {
      return 'max-w-[80px] max-h-[120px] min-w-[40px] min-h-[60px] max-md:max-w-[60px] max-md:max-h-[90px] max-md:min-w-[35px] max-md:min-h-[52px]';
    }
    if (count <= 24) {
      return 'max-w-[64px] max-h-[96px] min-w-[36px] min-h-[54px] max-md:max-w-[52px] max-md:max-h-[78px] max-md:min-w-[32px] max-md:min-h-[48px]';
    }
    // Lots of books: make icons smaller so they all fit more comfortably
    return 'max-w-[52px] max-h-[78px] min-w-[32px] min-h-[48px] max-md:max-w-[44px] max-md:max-h-[66px] max-md:min-w-[28px] max-md:min-h-[42px]';
  };

  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">Your 2025 Books</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">Here's what you read this year</p>
      </motion.div>
      <div className="w-full my-4 flex items-center justify-center max-md:pt-8">
        {books && books.length > 0 ? (
          <motion.div 
            className="grid gap-1 p-2 w-full h-full content-center justify-center z-[150] md:grid-cols-[repeat(auto-fit,minmax(60px,1fr))] max-md:grid-cols-[repeat(auto-fit,minmax(45px,1fr))]"
            style={bookCount <= 12 ? gridStyle : undefined}
            variants={containerVariantsSlow}
            initial="hidden"
            animate="visible"
          >
            {books.map((book: any, index: number) => (
              <motion.div 
                key={index} 
                className="relative z-[100] flex justify-center transition-transform duration-200 hover:scale-105 hover:z-[99999]"
                variants={fadeScaleVariants}
                custom={index}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <div className={`w-full aspect-[2/3] rounded-lg overflow-visible relative group ${getBookSizeClasses(bookCount)}`}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[2rem] text-black">
                    </div>
                  )}
                  <div className="absolute bottom-[105px] -mb-6 left-1/2 -translate-x-1/2 bg-[var(--color-vintage-accent)] text-[var(--color-vintage-bg)] py-2 px-3 rounded-lg text-[0.8rem] font-medium font-[var(--font-main)] whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis opacity-0 invisible transition-all duration-300 z-[99999] pointer-events-none group-hover:opacity-100 group-hover:visible max-md:text-[0.7rem] max-md:py-1.5 max-md:px-2.5 max-md:max-w-[100px] max-md:bottom-[80px]">
                    {book.title}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[var(--color-vintage-text)]"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            className="text-[1.2rem] opacity-70 my-8 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            No books found for 2025
          </motion.p>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default BookList;
