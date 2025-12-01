import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import QRCode from 'qrcode';
import Decor from './components/Decor';
import { decorMap } from './data/decorConfig';
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

// 💡 Vite uses import.meta.env for environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
      const response = await fetch(`${API_BASE_URL}/scrape/${username}/books/2025`);
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

  const renderMostPositiveReviewPage = () => (
    <MostPositiveReview
      mostPositiveReview={result?.mostPositiveReview}
      booksWithReviews={result?.booksWithReviews}
      onPrevPage={prevPage}
      onNextPage={nextPage}
    />
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

  const renderDesktopView = () => (
    <DesktopView
      qrCodeUrl={qrCodeUrl}
      onContinue={nextPage}
    />
  );

  const currentDecor = decorMap[location.pathname] || [];

  return (
    <div className="App">
      {/* Vintage Background */}
      <div className="vintage-background"></div>
      
      {/* Phone Frame Container */}
      <div className={`phone-container ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
        {/* Desktop Phone Frame Image */}
        {!isMobile && (
          <div className="phone-frame-overlay">
            <img src="/phone-frame.png" alt="Phone Frame" />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="phone-content-area">
          <div className="phone-screen-content">
            <div className="content-wrapper">
              
              {/* Dynamic Decor Elements */}
              {currentDecor.map((decor, index) => (
                <Decor key={`${location.pathname}-${index}`} id={decor.id} position={decor.position} className={decor.className || ''} />
              ))}
              
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
        </div>
      </div>
    </div>
  );
}

export default App;
