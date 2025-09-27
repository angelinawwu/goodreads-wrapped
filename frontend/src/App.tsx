import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import QRCode from 'qrcode';
import GradientBlinds from './components/GradientBlinds';



interface ScrapingResult {
  year?: string;
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
  // NEW: Biggest hater moment
  biggestHaterMoment?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
  };
  biggestDisparity?: number;
  booksWithBothRatings?: number;
  error?: string;
  // NEW: Dependability statistics
  toReadAddedCount?: number;
  toReadReadCount?: number;
  dependability?: number;
  // NEW: Most scathing review
  mostScathingReview?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
    sentiment?: {
      score: number;
      comparative: number;
      positive: string[];
      negative: string[];
      fullReview: string;
    };
  };
  mostPositiveReview?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
    sentiment?: {
      score: number;
      comparative: number;
      positive: string[];
      negative: string[];
      fullReview: string;
    };
  };
  booksWithReviews?: number;
}


function App() {


  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  // const [currentPage, setCurrentPage] = useState<Page>('welcome'); // Removed

  // Progress bar logic
  const getProgressData = () => {
    const pageOrder = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    
    return {
      totalPages: pageOrder.length,
      currentIndex: currentIndex === -1 ? -1 : currentIndex,
      isOnProgressPage: currentIndex !== -1
    };
  };

  const shouldShowProgressBar = () => {
    const progressPages = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    return progressPages.includes(location.pathname);
  };

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
      
      // Navigate to the first page instead of setting state
      if (isMobile) {
        navigate('/books-read');
      } else {
        navigate('/desktop');
      }      
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    const pageOrder = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    if (currentIndex < pageOrder.length - 1) {
      navigate(pageOrder[currentIndex + 1]);
    }
  };

  const prevPage = () => {
    const pageOrder = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    if (currentIndex > 0) {
      navigate(pageOrder[currentIndex - 1]);
    }
  };

  const renderWelcomePage = () => (
    <div className="page-container">
      <h1 className="welcome-title">Goodreads Wrapped 2025</h1>
      <p className="subtitle">Discover your reading year in review!</p>
      {/* <p style={{fontSize: '0.8rem', opacity: 0.7}}>
        Device: {isMobile ? '📱 Mobile' : '💻 Desktop'}
      </p> */}
        
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
        <button className="submit-button" type="submit" disabled={loading || !username.trim()}>
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
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
    </div>
  );

  const renderAverageRatingPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>⭐ Average Rating</h2>
        <p className="page-subtitle">Your average rating for 2025 books</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{result?.averageRating?.toFixed(2) || '0.0'}</div>
        <div className="stat-label">out of 5 stars</div>
      </div>
      <div className="rating-details">
        <p>Based on {result?.booksWithRatings || 0} books you rated</p>
      </div>
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
    </div>
  );

  const renderBookListPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>📚 Your 2025 Books</h2>
        <p className="page-subtitle">Here's what you read this year</p>
      </div>
      <div className="book-grid-container">
        {result?.books && result.books.length > 0 ? (
          <div className="book-grid" data-count={result.books.length <= 12 ? result.books.length : 'auto'}>
            {result.books.map((book: any, index: number) => (
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
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
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
          navigate('/');
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
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
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
        
        {/* Navigation areas */}
        <div className="nav-left" onClick={prevPage}></div>
        <div className="nav-right" onClick={nextPage}></div>
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
          <div className="reading-time-number">{result?.averageReadingTime?.toFixed(2) || '0.00'}</div>
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
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
    </div>
  );

  const renderBiggestHaterPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>😤 Biggest Hater Moment</h2>
        <p className="page-subtitle">When you disagreed with everyone else</p>
      </div>
      
      {result?.biggestHaterMoment ? (
        <div className="hater-moment-container">
          <div className="hater-book-card">
            <div className="book-cover">
              {result.biggestHaterMoment.coverImage ? (
                <img src={result.biggestHaterMoment.coverImage} alt={result.biggestHaterMoment.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.biggestHaterMoment.title}</div>
              <div className="book-author">by {result.biggestHaterMoment.author}</div>
            </div>
          </div>
          
          <div className="rating-comparison">
            <div className="rating-display">
              <div className="rating-label">Your Rating</div>
              <div className="rating-stars user-rating">
                {'⭐'.repeat(result.biggestHaterMoment.userRating || 0)}
                <span className="rating-number">{result.biggestHaterMoment.userRating}/5</span>
              </div>
            </div>
            
            <div className="vs-divider">VS</div>
            
            <div className="rating-display">
              <div className="rating-label">Everyone Else</div>
              <div className="rating-stars avg-rating">
                {'⭐'.repeat(Math.floor(result.biggestHaterMoment.avgRating || 0))}
                <span className="rating-number">{result.biggestHaterMoment.avgRating?.toFixed(2)}/5</span>
              </div>
            </div>
          </div>
          
          <div className="disparity-display">
            <div className="disparity-number">{result.biggestDisparity?.toFixed(2)}</div>
            <div className="disparity-label">stars difference</div>
                </div>
                
          <div className="hater-message">
            <p>You were {result.biggestDisparity?.toFixed(2)} stars more critical than the average reader!</p>
          </div>
        </div>
      ) : (
        <div className="no-hater-moment">
          <p>No hater moments found - you're too agreeable! 😊</p>
                  </div>
                )}
      
      <div className="hater-details">
        <p>Based on {result?.booksWithBothRatings || 0} books with both your rating and average rating</p>
      </div>
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
    </div>
  );

  const renderMostScathingReviewPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>🔥 Most Scathing Review</h2>
        <p className="page-subtitle">Your most critical review of 2025</p>
      </div>
      
      {result?.mostScathingReview ? (
        <div className="scathing-review-container">
          <div className="scathing-book-card">
            <div className="book-cover">
              {result.mostScathingReview.coverImage ? (
                <img src={result.mostScathingReview.coverImage} alt={result.mostScathingReview.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.mostScathingReview.title}</div>
              <div className="book-author">by {result.mostScathingReview.author}</div>
              {result.mostScathingReview.userRating && (
                <div className="book-rating">⭐ {result.mostScathingReview.userRating}/5</div>
              )}
            </div>
          </div>
          
          <div className="review-content">
            <div className="review-text">
              "{result.mostScathingReview.sentiment?.fullReview || 'No review text available'}"
            </div>
            
            <div className="sentiment-stats">
              <div className="sentiment-score">
                <div className="sentiment-number">
                  {result.mostScathingReview.sentiment?.comparative?.toFixed(3) || '0.000'}
                </div>
                <div className="sentiment-label">sentiment score</div>
              </div>
              
              <div className="sentiment-breakdown">
                <div className="sentiment-positive">
                  <span className="sentiment-icon">😊</span>
                  <span>{result.mostScathingReview.sentiment?.positive?.length || 0} positive words</span>
                </div>
                <div className="sentiment-negative">
                  <span className="sentiment-icon">😠</span>
                  <span>{result.mostScathingReview.sentiment?.negative?.length || 0} negative words</span>
                </div>
              </div>
            </div>
          </div>
          
        <div className="scathing-message">
          <p>This was your most critical review of the year! 💥</p>
        </div>
              </div>
            ) : (
      <div className="no-scathing-review">
        <p>No scathing reviews found - you're too nice! ��</p>
                  </div>
                )}
    
    <div className="review-details">
      <p>Based on {result?.booksWithReviews || 0} books with reviews</p>
    </div>
    
    {/* Navigation areas */}
    <div className="nav-left" onClick={prevPage}></div>
    <div className="nav-right" onClick={nextPage}></div>
  </div>
);
  const renderMostPositiveReviewPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>🔥 Most Positive Review</h2>
        <p className="page-subtitle">Your most positive review of 2025</p>
      </div>
      
      {result?.mostPositiveReview ? (
        <div className="scathing-review-container">
          <div className="scathing-book-card">
            <div className="book-cover">
              {result.mostPositiveReview.coverImage ? (
                <img src={result.mostPositiveReview.coverImage} alt={result.mostPositiveReview.title} />
              ) : (
                <div className="no-cover">📖</div>
              )}
            </div>
            <div className="book-info">
              <div className="book-title">{result.mostPositiveReview.title}</div>
              <div className="book-author">by {result.mostPositiveReview.author}</div>
              {result.mostPositiveReview.userRating && (
                <div className="book-rating">⭐ {result.mostPositiveReview.userRating}/5</div>
              )}
            </div>
          </div>
          
          <div className="review-content">
            <div className="review-text">
              "{result.mostPositiveReview.sentiment?.fullReview || 'No review text available'}"
            </div>
            
            <div className="sentiment-stats">
              <div className="sentiment-score">
                <div className="sentiment-number">
                  {result.mostPositiveReview.sentiment?.comparative?.toFixed(3) || '0.000'}
                </div>
                <div className="sentiment-label">sentiment score</div>
                  </div>
              
              <div className="sentiment-breakdown">
                <div className="sentiment-positive">
                  <span className="sentiment-icon">😊</span>
                  <span>{result.mostPositiveReview.sentiment?.positive?.length || 0} positive words</span>
                  </div>
                <div className="sentiment-negative">
                  <span className="sentiment-icon">😠</span>
                  <span>{result.mostPositiveReview.sentiment?.negative?.length || 0} negative words</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="positive-message">
            <p>This was your most positive review of the year! 💥</p>
          </div>
        </div>
      ) : (
        <div className="no-positive-review">
          <p>No positive reviews found - are you a hater?</p>
        </div>
      )}
      
      <div className="review-details">
        <p>Based on {result?.booksWithReviews || 0} books with reviews</p>
      </div>
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
    </div>
  );

  const renderDependabilityPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>📋 Dependability</h2>
        <p className="page-subtitle">How well you follow through on your reading goals</p>
      </div>
      
      <div className="dependability-stats">
        <div className="dependability-main">
          <div className="dependability-number">
            {result?.dependability ? (result.dependability * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="dependability-label">follow-through rate</div>
        </div>
        
        <div className="dependability-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-number">{result?.toReadReadCount || 0}</div>
            <div className="breakdown-label">books read in {result?.year || '2025'}</div>
          </div>
          <div className="breakdown-divider">of</div>
          <div className="breakdown-item">
            <div className="breakdown-number">{(result?.toReadAddedCount || 0) + (result?.toReadReadCount || 0)}</div>
            <div className="breakdown-label">total books added in {result?.year || '2025'}</div>
          </div>
        </div>
      </div>
      
      <div className="dependability-message">
        <p>
          {result?.dependability && result.dependability >= 0.8 
            ? "You're incredibly reliable with your reading goals! 🎯"
            : result?.dependability && result.dependability >= 0.5
            ? "You're doing well at following through on your reading plans! 📚"
            : "There's always room to improve your reading follow-through! 💪"
          }
        </p>
        <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem'}}>
          This measures how many books you read in {result?.year || '2025'} that were also added to your shelves in {result?.year || '2025'}.
        </p>
      </div>
      
      {/* Navigation areas */}
      <div className="nav-left" onClick={prevPage}></div>
      <div className="nav-right" onClick={nextPage}></div>
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
          className={location.pathname === '/books-read' ? 'active' : ''} 
          onClick={() => navigate('/books-read')}
        >
          Books Read
        </button>
        <button 
          className={location.pathname === '/average-rating' ? 'active' : ''} 
          onClick={() => navigate('/average-rating')}
        >
          Average Rating
        </button>
        <button 
          className={location.pathname === '/book-details' ? 'active' : ''} 
          onClick={() => navigate('/book-details')}
        >
          Book Details
        </button>
        <button 
          className={location.pathname === '/top-genres' ? 'active' : ''} 
          onClick={() => navigate('/top-genres')}
        >
          Top Genres
        </button>
        <button 
          className={location.pathname === '/reading-time' ? 'active' : ''} 
          onClick={() => navigate('/reading-time')}
        >
          Reading Speed
        </button>
        <button 
          className={location.pathname === '/dependability' ? 'active' : ''} 
          onClick={() => navigate('/dependability')}
        >
          Dependability
        </button>
        <button 
          className={location.pathname === '/biggest-hater' ? 'active' : ''} 
          onClick={() => navigate('/biggest-hater')}
        >
          Biggest Hater
        </button>
        <button 
          className={location.pathname === '/most-scathing-review' ? 'active' : ''} 
          onClick={() => navigate('/most-scathing-review')}
        >
          Most Scathing Review
        </button>
        <button 
          className={location.pathname === '/most-positive-review' ? 'active' : ''} 
          onClick={() => navigate('/most-positive-review')}
        >
          Most Positive Review
        </button>
        <button 
          className={location.pathname === '/book-list' ? 'active' : ''} 
          onClick={() => navigate('/book-list')}
        >
          Book List
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="App-wrapper">
        <div className="background-container">
          <GradientBlinds
            gradientColors={['#EF6B46', '#ED5EFD', '#4447EA']}
            angle={20}
            noise={0.3}
            blindCount={12}
            blindMinWidth={50}
            spotlightRadius={0.5}
            spotlightSoftness={2}
            spotlightOpacity={0.3}
            mouseDampening={0.1}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="normal"
          />
        </div>
        
        {/* Instagram-style Segmented Progress Bar */}
        {shouldShowProgressBar() && (
          <div className="progress-container">
            <div className="progress-segments">
              {Array.from({ length: getProgressData().totalPages }, (_, index) => (
                <div
                  key={index}
                  className={`progress-segment ${
                    index <= getProgressData().currentIndex ? 'completed' : 'incomplete'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        <header className="App-header">
        <Routes>
          <Route path="/" element={renderWelcomePage()} />
          <Route path="/desktop" element={
            result && !isMobile ? renderDesktopView() : <div>Loading...</div>
          } />
          <Route path="/books-read" element={
            result ? renderBooksReadPage() : <div>Loading...</div>
          } />
          <Route path="/average-rating" element={
            result ? renderAverageRatingPage() : <div>Loading...</div>
          } />
          <Route path="/book-details" element={
            result ? renderBookDetailsPage() : <div>Loading...</div>
          } />
          <Route path="/top-genres" element={
            result ? renderTopGenresPage() : <div>Loading...</div>
          } />
          <Route path="/reading-time" element={
            result ? renderReadingTimePage() : <div>Loading...</div>
          } />
          <Route path="/dependability" element={
            result ? renderDependabilityPage() : <div>Loading...</div>
          } />
          <Route path="/biggest-hater" element={
            result ? renderBiggestHaterPage() : <div>Loading...</div>
          } />
          <Route path="/most-scathing-review" element={
            result ? renderMostScathingReviewPage() : <div>Loading...</div>
          } />
          <Route path="/most-positive-review" element={
            result ? renderMostPositiveReviewPage() : <div>Loading...</div>
          } />
          <Route path="/book-list" element={
            result ? renderBookListPage() : <div>Loading...</div>
          } />
          <Route path="/complete" element={
            result ? renderCompletePage() : <div>Loading...</div>
          } />
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;