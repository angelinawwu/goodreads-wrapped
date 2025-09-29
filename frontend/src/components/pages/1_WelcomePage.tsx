import React from 'react';
import './1_WelcomePage.css';

interface WelcomePageProps {
  username: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  username,
  loading,
  onUsernameChange,
  onSubmit
}) => {
  return (
    <div className="page-container">
      <h1 className="welcome-title">Goodreads Wrapped 2025</h1>
      <p className="subtitle">Discover your reading year in review!</p>
        
      <form onSubmit={onSubmit} className="username-form">
        <div className="input-group">
          <label htmlFor="username">Goodreads Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
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
};

export default WelcomePage;
