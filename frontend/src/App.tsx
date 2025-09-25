import React, { useState, useEffect } from 'react';
import './App.css';
import QRCode from 'qrcode';

interface ScrapingResult {
  yearBooks?: number;
  pagesScraped?: number;
  books?: Array<{
    title: string;
    author: string;
    userRating?: number;
    numPages?: number;          // NEW
    coverImage?: string;        // NEW
    readingDays?: number;       // NEW: Reading time in days
  }>;
  averageRating?: number;
  booksWithRatings?: number;
  // NEW: Page statistics
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
  booksWithPages?: number;
  // NEW: Genre statistics
  mostPopularGenre?: string;
  uniqueGenres?: number;
  genreCounts?: { [key: string]: number };
  // NEW: Reading time statistics
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
  error?: string;
}

type Page = 'welcome' | 'books-read' | 'average-rating' | 'book-details' | 'top-genres' | 'reading-time' | 'book-list' | 'complete';

function App() {
  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('welcome');

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
  
    const userId = Math.random().toString(36).substr(2, 9);
  
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/scrape/${username}/books/2025`);
      const data = await response.json();
      setResult(data);
      
      // Generate QR code for mobile view
      const mobileUrl = `${window.location.origin}?userId=${userId}`;
      const qrCode = await QRCode.toDataURL(mobileUrl);
      setQrCodeUrl(qrCode);
      
      // Start the wrapped experience
      setCurrentPage('books-read');
      
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    const pageOrder: Page[] = ['welcome', 'books-read', 'average-rating', 'book-details', 'top-genres', 'reading-time', 'book-list', 'complete'];
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex < pageOrder.length - 1) {
      setCurrentPage(pageOrder[currentIndex + 1]);
    }
  };

  const prevPage = () => {
    const pageOrder: Page[] = ['welcome', 'books-read', 'average-rating', 'book-details', 'top-genres', 'reading-time', 'book-list', 'complete'];
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pageOrder[currentIndex - 1]);
    }
  };

  const renderWelcomePage = () => (
    <div className="page-container">
      <h1>Goodreads Wrapped 2025</h1>
      <p className="subtitle">Discover your reading year in review!</p>
      <p style={{fontSize: '0.8rem', opacity: 0.7}}>
        Device: {isMobile ? '📱 Mobile' : '💻 Desktop'}
      </p>
      
      <form onSubmit={handleSubmit} className="username-form">
        <div className="input-group">
          <label htmlFor="username">Goodreads Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Goodreads username"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !username.trim()}>
          {loading ? 'Analyzing...' : 'Get My Reading Stats'}
        </button>
      </form>
    </div>
  );

  const renderBooksReadPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>📖 Books Read</h2>
        <p className="page-subtitle">In 2025, you read...</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{result?.yearBooks || 0}</div>
        <div className="stat-label">books</div>
      </div>
      <button className="next-button" onClick={nextPage}>
        Continue →
      </button>
    </div>
  );

  const renderAverageRatingPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>⭐ Average Rating</h2>
        <p className="page-subtitle">Your average rating for 2025 books</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{result?.averageRating?.toFixed(1) || '0.0'}</div>
        <div className="stat-label">out of 5 stars</div>
      </div>
      <div className="rating-details">
        <p>Based on {result?.booksWithRatings || 0} books you rated</p>
      </div>
      <button className="next-button" onClick={nextPage}>
        Continue →
      </button>
    </div>
  );

  const renderBookListPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>📚 Your 2025 Books</h2>
        <p className="page-subtitle">Here's what you read this year</p>
      </div>
      <div className="book-list-container">
        {result?.books && result.books.length > 0 ? (
          <ul className="book-list">
            {result.books.map((book: any, index: number) => (
              <li key={index} className="book-item">
                <div className="book-title">{book.title}</div>
                <div className="book-author">by {book.author}</div>
                {book.userRating && (
                  <div className="book-rating">⭐ {book.userRating}/5</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-books">No books found for 2025</p>
        )}
      </div>
      <button className="next-button" onClick={nextPage}>
        Finish →
      </button>
    </div>
  );

  const renderCompletePage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>🎉 That's a Wrap!</h2>
        <p className="page-subtitle">Thanks for exploring your reading year</p>
      </div>
      <div className="summary-stats">
        <div className="summary-stat">
          <div className="summary-number">{result?.yearBooks || 0}</div>
          <div className="summary-label">Books Read</div>
        </div>
        <div className="summary-stat">
          <div className="summary-number">{result?.pagesScraped || 0}</div>
          <div className="summary-label">Pages Analyzed</div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="restart-button" onClick={() => {
          setCurrentPage('welcome');
          setResult(null);
          setUsername('');
        }}>
          Start Over
        </button>
        {!isMobile && qrCodeUrl && (
          <div className="qr-section">
            <p>Share on mobile:</p>
            <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
          </div>
        )}
      </div>
    </div>
  );

  const renderBookDetailsPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>�� Book Details</h2>
        <p className="page-subtitle">Your reading patterns in 2025</p>
      </div>
      
      <div className="book-details-grid">
        <div className="detail-card">
          <h3>�� Average Length</h3>
          <div className="detail-number">{result?.averagePages || 0}</div>
          <div className="detail-label">pages per book</div>
        </div>
        
        {result?.longestBook && (
          <div className="detail-card book-card">
            <h3>�� Longest Book</h3>
            <div className="book-cover">
              {result.longestBook.coverImage ? (
                <img src={result.longestBook.coverImage} alt={result.longestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.longestBook.title}</div>
              <div className="book-author">by {result.longestBook.author}</div>
              <div className="book-pages">{result.longestBook.numPages} pages</div>
            </div>
          </div>
        )}
        
        {result?.shortestBook && (
          <div className="detail-card book-card">
            <h3>�� Shortest Book</h3>
            <div className="book-cover">
              {result.shortestBook.coverImage ? (
                <img src={result.shortestBook.coverImage} alt={result.shortestBook.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.shortestBook.title}</div>
              <div className="book-author">by {result.shortestBook.author}</div>
              <div className="book-pages">{result.shortestBook.numPages} pages</div>
            </div>
          </div>
        )}
      </div>
      
      <button className="next-button" onClick={nextPage}>
        Continue →
      </button>
    </div>
  );

  const renderTopGenresPage = () => {
    const topGenres = result?.genreCounts 
      ? Object.entries(result.genreCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
      : [];

    return (
      <div className="page-container">
        <div className="page-header">
          <h2>🏆 Top Genres</h2>
          <p className="page-subtitle">Your favorite genres in 2025</p>
        </div>
        
        <div className="top-genres-list">
          {topGenres.length > 0 ? (
            topGenres.map(([genre, count], index) => (
              <div key={genre} className="genre-rank-item">
                <div className="genre-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>
                <div className="genre-info">
                  <div className="genre-name">{genre}</div>
                  <div className="genre-fraction">{count as number}/{result?.yearBooks || 0} books</div>
                </div>
                <div className="genre-percentage">
                  {Math.round(((count as number) / (result?.yearBooks || 1)) * 100)}%
                </div>
              </div>
            ))
          ) : (
            <div className="no-genres">
              <p>No genre data available</p>
            </div>
          )}
        </div>
        
        <button className="next-button" onClick={nextPage}>
          Continue →
        </button>
      </div>
    );
  };

  const renderReadingTimePage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>⏱️ Reading Speed</h2>
        <p className="page-subtitle">How fast you read in 2025</p>
      </div>
      
      <div className="reading-time-grid">
        <div className="reading-time-stat">
          <h3>📊 Average Time</h3>
          <div className="reading-time-number">{result?.averageReadingTime?.toFixed(1) || '0.0'}</div>
          <div className="reading-time-label">days per book</div>
        </div>
        
        {result?.fastestRead && (
          <div className="reading-time-card">
            <h3>⚡ Fastest Read</h3>
            <div className="book-cover">
              {result.fastestRead.coverImage ? (
                <img src={result.fastestRead.coverImage} alt={result.fastestRead.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.fastestRead.title}</div>
              <div className="book-author">by {result.fastestRead.author}</div>
              <div className="reading-days">{result.fastestRead.readingDays} days</div>
            </div>
          </div>
        )}
        
        {result?.slowestRead && (
          <div className="reading-time-card">
            <h3>🐌 Slowest Read</h3>
            <div className="book-cover">
              {result.slowestRead.coverImage ? (
                <img src={result.slowestRead.coverImage} alt={result.slowestRead.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.slowestRead.title}</div>
              <div className="book-author">by {result.slowestRead.author}</div>
              <div className="reading-days">{result.slowestRead.readingDays} days</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="reading-time-details">
        <p>Based on {result?.booksWithReadingTime || 0} books with reading dates</p>
      </div>
      
      <button className="next-button" onClick={nextPage}>
        Continue →
      </button>
    </div>
  );

  const renderDesktopView = () => (
    <div className="desktop-container">
      <h2>Scan QR Code to View on Mobile</h2>
      {qrCodeUrl && (
        <div className="qr-section">
          <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
        </div>
      )}
      <p className="desktop-note">
        Or use the navigation below to view your stats:
      </p>
      <div className="desktop-nav">
        <button 
          className={currentPage === 'books-read' ? 'active' : ''} 
          onClick={() => setCurrentPage('books-read')}
        >
          Books Read
        </button>
        <button 
          className={currentPage === 'average-rating' ? 'active' : ''} 
          onClick={() => setCurrentPage('average-rating')}
        >
          Average Rating
        </button>
        <button 
          className={currentPage === 'book-details' ? 'active' : ''} 
          onClick={() => setCurrentPage('book-details')}
        >
          Book Details
        </button>
        <button 
          className={currentPage === 'top-genres' ? 'active' : ''} 
          onClick={() => setCurrentPage('top-genres')}
        >
          Top Genres
        </button>
        <button 
          className={currentPage === 'reading-time' ? 'active' : ''} 
          onClick={() => setCurrentPage('reading-time')}
        >
          Reading Speed
        </button>
        <button 
          className={currentPage === 'book-list' ? 'active' : ''} 
          onClick={() => setCurrentPage('book-list')}
        >
          Book List
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        {currentPage === 'welcome' && renderWelcomePage()}
        
        {result && currentPage !== 'welcome' && (
          <>
            {isMobile ? (
              <>
                {currentPage === 'books-read' && renderBooksReadPage()}
                {currentPage === 'average-rating' && renderAverageRatingPage()}
                {currentPage === 'book-details' && renderBookDetailsPage()}
                {currentPage === 'top-genres' && renderTopGenresPage()}
                {currentPage === 'reading-time' && renderReadingTimePage()}
                {currentPage === 'book-list' && renderBookListPage()}
                {currentPage === 'complete' && renderCompletePage()}
              </>
            ) : (
              <>
                {renderDesktopView()}
                {currentPage === 'books-read' && renderBooksReadPage()}
                {currentPage === 'average-rating' && renderAverageRatingPage()}
                {currentPage === 'book-details' && renderBookDetailsPage()}
                {currentPage === 'top-genres' && renderTopGenresPage()}
                {currentPage === 'reading-time' && renderReadingTimePage()}
                {currentPage === 'book-list' && renderBookListPage()}
                {currentPage === 'complete' && renderCompletePage()}
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;