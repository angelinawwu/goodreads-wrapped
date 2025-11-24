import React from 'react';
import Navigation from '../Navigation';

interface ReadingTimeProps {
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
  onPrevPage: () => void;
  onNextPage: () => void;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  averageReadingTime, 
  fastestRead, 
  slowestRead, 
  booksWithReadingTime,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">⏱️ Reading Speed</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How fast you read in 2025</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 my-4 max-w-[600px] md:grid-cols-2">
        <div className="p-4 rounded-xl text-center bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] md:col-span-full">
          <h3 className="m-0 text-[1.3rem] font-[var(--font-main)] text-black">📊 Average Time</h3>
          <div className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]">{averageReadingTime?.toFixed(2) || '0.00'}</div>
          <div className="text-[1.2rem] opacity-80 font-[var(--font-main)] text-black">days per book</div>
        </div>
        
        {fastestRead && (
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
            <h3 className="m-0 text-[1.3rem] font-[var(--font-main)] text-black">⚡ Fastest Read</h3>
            <div className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]">
              {fastestRead.coverImage ? (
                <img src={fastestRead.coverImage} alt={fastestRead.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black">{fastestRead.title}</div>
              <div className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black">by {fastestRead.author}</div>
              <div className="text-[1.1rem] text-black font-bold font-[var(--font-main)]">{fastestRead.readingDays} days</div>
            </div>
          </div>
        )}
        
        {slowestRead && (
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
            <h3 className="m-0 text-[1.3rem] font-[var(--font-main)] text-black">🐌 Slowest Read</h3>
            <div className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]">
              {slowestRead.coverImage ? (
                <img src={slowestRead.coverImage} alt={slowestRead.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black">{slowestRead.title}</div>
              <div className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black">by {slowestRead.author}</div>
              <div className="text-[1.1rem] text-black font-bold font-[var(--font-main)]">{slowestRead.readingDays} days</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center my-4 opacity-80">
        <p className="m-0 text-[0.9rem] font-[var(--font-main)] text-black">Based on {booksWithReadingTime || 0} books with reading dates</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default ReadingTime;
