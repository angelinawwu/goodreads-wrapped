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

function App() {
  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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
      
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Goodreads Wrapped 2025</h1>
        <p>Discover your reading year in review!</p>
        <p style={{fontSize: '0.8rem', opacity: 0.7}}>
          Device: {isMobile ? '📱 Mobile' : '�� Desktop'}
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
  
        {result && (
          <div className="results">
            {isMobile ? (
              // Mobile layout (current design)
              <div>
                <h2>Your 2025 Reading Stats</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>📖 Books Read</h3>
                    <p className="stat-number">{result.yearBooks || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>📄 Pages Scraped</h3>
                    <p className="stat-number">{result.pagesScraped || 0}</p>
                  </div>
                </div>
                
                {result.books && result.books.length > 0 && (
                  <div className="book-list">
                    <h3>Your 2025 Books</h3>
                    <ul>
                      {result.books.map((book: any, index: number) => (
                        <li key={index}>
                          <strong>{book.title}</strong> by {book.author}
                          {book.userRating && <span className="rating"> ⭐ {book.userRating}/5</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // Desktop layout with QR code
              <div>
                <h2>Scan QR Code to View on Mobile</h2>
                {qrCodeUrl && (
                  <div style={{textAlign: 'center', margin: '2rem 0'}}>
                    <img src={qrCodeUrl} alt="QR Code" style={{maxWidth: '200px'}} />
                  </div>
                )}
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                  Or, view in browser below:
                </p>
                
                {/* Same content as mobile but desktop-optimized */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>📖 Books Read</h3>
                    <p className="stat-number">{result.yearBooks || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>📄 Pages Scraped</h3>
                    <p className="stat-number">{result.pagesScraped || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;