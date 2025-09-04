import React, { useState } from 'react';
import './App.css';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      // Call your backend endpoint
      const response = await fetch(`http://localhost:3001/scrape/${username}/books/2025`);
      const data = await response.json();
      setResult(data);
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
                  {result.books.slice(0, 10).map((book: any, index: number) => (
                    <li key={index}>
                      <strong>{book.title}</strong> by {book.author}
                      {book.userRating && <span className="rating"> ⭐ {book.userRating}/5</span>}
                    </li>
                  ))}
                </ul>
                {result.books.length > 10 && (
                  <p>...and {result.books.length - 10} more books!</p>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;