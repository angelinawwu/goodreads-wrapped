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
  }>;
  error?: string;
}

type Page = 'welcome' | 'books-read' | 'pages-scraped' | 'book-list' | 'complete';

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
    const pageOrder: Page[] = ['welcome', 'books-read', 'pages-scraped', 'book-list', 'complete'];
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex < pageOrder.length - 1) {
      setCurrentPage(pageOrder[currentIndex + 1]);
    }
  };

  const prevPage = () => {
    const pageOrder: Page[] = ['welcome', 'books-read', 'pages-scraped', 'book-list', 'complete'];
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

  const renderPagesScrapedPage = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>📄 Data Processed</h2>
        <p className="page-subtitle">We analyzed...</p>
      </div>
      <div className="big-stat">
        <div className="stat-number">{result?.pagesScraped || 0}</div>
        <div className="stat-label">pages of your reading history</div>
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
          className={currentPage === 'pages-scraped' ? 'active' : ''} 
          onClick={() => setCurrentPage('pages-scraped')}
        >
          Data Processed
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
                {currentPage === 'pages-scraped' && renderPagesScrapedPage()}
                {currentPage === 'book-list' && renderBookListPage()}
                {currentPage === 'complete' && renderCompletePage()}
              </>
            ) : (
              <>
                {renderDesktopView()}
                {currentPage === 'books-read' && renderBooksReadPage()}
                {currentPage === 'pages-scraped' && renderPagesScrapedPage()}
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