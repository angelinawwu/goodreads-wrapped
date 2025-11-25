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
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">📚 Your 2025 Books</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">Here's what you read this year</p>
      </motion.div>
      <div className="w-full my-4 h-[60vh] overflow-visible flex items-center justify-center max-md:h-[50vh] max-md:pt-8">
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
                className="flex justify-center transition-transform duration-200 hover:scale-105"
                variants={fadeScaleVariants}
                custom={index}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <div className="w-full aspect-[2/3] max-w-[80px] max-h-[120px] min-w-[40px] min-h-[60px] rounded-lg overflow-visible relative group max-md:max-w-[60px] max-md:max-h-[90px] max-md:min-w-[35px] max-md:min-h-[52px] z-[100]">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[2rem] text-black">
                      <span>📖</span>
                    </div>
                  )}
                  <div className="absolute bottom-[105px] left-1/2 -translate-x-1/2 bg-[var(--color-vintage-accent)] text-[var(--color-vintage-bg)] py-2 px-3 rounded-lg text-[0.8rem] font-medium font-[var(--font-main)] whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis opacity-0 invisible transition-all duration-300 z-[99999] pointer-events-none group-hover:opacity-100 group-hover:visible max-md:text-[0.7rem] max-md:py-1.5 max-md:px-2.5 max-md:max-w-[150px] max-md:bottom-[80px]">
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
