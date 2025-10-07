import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import QRCode from 'qrcode';
import Navigation from './components/Navigation';
import WelcomePage from './components/pages/1_WelcomePage';
import DesktopView from './components/pages/2_DesktopView';
import BooksRead from './components/pages/3_BooksRead';
import AverageRating from './components/pages/4_AverageRating';
import BookDetails from './components/pages/5_BookDetails';
import TopGenres from './components/pages/6_TopGenres';
import GenresOverTime from './components/pages/7_GenresOverTime';
import ReadingTime from './components/pages/8_ReadingTime';
import Dependability from './components/pages/9_Dependability';
import BiggestHater from './components/pages/10_BiggestHater';
import MostScathingReview from './components/pages/11_MostScathingReview';
import MostPositiveReview from './components/pages/12_MostPositiveReview';
import BookList from './components/pages/13_BookList';
import Complete from './components/pages/14_Complete';



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
  // NEW: Monthly genre data
  monthlyGenreData?: {
    [month: string]: {
      [genre: string]: number;
    };
  };
  monthlyBookTotals?: {
    [month: string]: number;
  };
}


function App() {


  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  // const [currentPage, setCurrentPage] = useState<Page>('welcome'); // Removed

  // Progress bar logic
  const getProgressData = () => {
    const pageOrder = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/genres-over-time', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    
    return {
      totalPages: pageOrder.length,
      currentIndex: currentIndex === -1 ? -1 : currentIndex,
      isOnProgressPage: currentIndex !== -1
    };
  };

  const shouldShowProgressBar = () => {
    const progressPages = ['/books-read', '/average-rating', '/book-details', '/top-genres', '/genres-over-time', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
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
    const pageOrder = ['/','/desktop', '/books-read', '/average-rating', '/book-details', '/top-genres', '/genres-over-time', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    if (currentIndex < pageOrder.length - 1) {
      navigate(pageOrder[currentIndex + 1]);
    }
  };

  const prevPage = () => {
    const pageOrder = ['/','/desktop', '/books-read', '/average-rating', '/book-details', '/top-genres', '/genres-over-time', '/reading-time', '/dependability', '/biggest-hater', '/most-scathing-review', '/most-positive-review', '/book-list', '/complete'];
    const currentPath = location.pathname;
    const currentIndex = pageOrder.indexOf(currentPath);
    if (currentIndex > 0) {
      navigate(pageOrder[currentIndex - 1]);
    }
  };

  const renderWelcomePage = () => (
    <WelcomePage
      username={username}
      loading={loading}
      onUsernameChange={setUsername}
      onSubmit={handleSubmit}
    />
  );

  const renderBooksReadPage = () => (
    <BooksRead
      yearBooks={result?.yearBooks}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderAverageRatingPage = () => (
    <AverageRating
      averageRating={result?.averageRating}
      booksWithRatings={result?.booksWithRatings}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderBookListPage = () => (
    <BookList
      books={result?.books}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderCompletePage = () => (
    <Complete
      yearBooks={result?.yearBooks}
      pagesScraped={result?.pagesScraped}
      qrCodeUrl={qrCodeUrl}
      isMobile={isMobile}
      onRestart={() => {
        navigate('/');
        setResult(null);
        setUsername('');
      }}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderBookDetailsPage = () => (
    <BookDetails
      averagePages={result?.averagePages}
      longestBook={result?.longestBook}
      shortestBook={result?.shortestBook}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderTopGenresPage = () => (
    <TopGenres
      genreCounts={result?.genreCounts}
      yearBooks={result?.yearBooks}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderGenresOverTimePage = () => (
    <GenresOverTime
      genreCounts={result?.genreCounts}
      monthlyGenreData={result?.monthlyGenreData}
      monthlyBookTotals={result?.monthlyBookTotals}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderReadingTimePage = () => (
    <ReadingTime
      averageReadingTime={result?.averageReadingTime}
      fastestRead={result?.fastestRead}
      slowestRead={result?.slowestRead}
      booksWithReadingTime={result?.booksWithReadingTime}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderBiggestHaterPage = () => (
    <BiggestHater
      biggestHaterMoment={result?.biggestHaterMoment}
      biggestDisparity={result?.biggestDisparity}
      booksWithBothRatings={result?.booksWithBothRatings}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderMostScathingReviewPage = () => (
    <MostScathingReview
      mostScathingReview={result?.mostScathingReview}
      booksWithReviews={result?.booksWithReviews}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderMostScathingReviewPageOLD = () => (
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
    
    <Navigation onPrevPage={prevPage} onNextPage={nextPage} />
  </div>
);
  const renderMostPositiveReviewPage = () => (
    <MostPositiveReview
      mostPositiveReview={result?.mostPositiveReview}
      booksWithReviews={result?.booksWithReviews}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderMostPositiveReviewPageOLD = () => (
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
      
      <Navigation onPrevPage={prevPage} onNextPage={nextPage} />
    </div>
  );

  const renderDependabilityPage = () => (
    <Dependability
      dependability={result?.dependability}
      toReadReadCount={result?.toReadReadCount}
      toReadAddedCount={result?.toReadAddedCount}
      year={result?.year}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
  );

  const renderDependabilityPageOLD = () => (
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
      
      <Navigation onPrevPage={prevPage} onNextPage={nextPage} />
    </div>
  );

  const renderDesktopView = () => (
    <DesktopView
      qrCodeUrl={qrCodeUrl}
      onContinue={nextPage}
    />
  );

  return (
    <div className="App">
      <div className="App-wrapper">
        <div className="background-container">
          {/* GradientBlinds hidden - using static gradient SVG files instead */}
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
          <Route path="/genres-over-time" element={
            result ? renderGenresOverTimePage() : <div>Loading...</div>
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