import React from 'react';
import Navigation from '../Navigation';
import './12_BookList.css';

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
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📚 Your 2025 Books</h2>
        <p className="page-subtitle">Here's what you read this year</p>
      </div>
      <div className="book-grid-container">
        {books && books.length > 0 ? (
          <div className="book-grid" data-count={books.length <= 12 ? books.length : 'auto'}>
            {books.map((book: any, index: number) => (
              <div key={index} className="book-grid-item">
                <div className="book-cover-grid">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} />
                  ) : (
                    <div className="no-cover-grid">
                      <span>📖</span>
                    </div>
                  )}
                  <div className="book-title-tooltip">{book.title}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-books">No books found for 2025</p>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BookList;
