import React from 'react';
import Navigation from '../Navigation';

interface BiggestHaterProps {
  biggestHaterMoment?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
  };
  biggestDisparity?: number;
  booksWithBothRatings?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BiggestHater: React.FC<BiggestHaterProps> = ({ 
  biggestHaterMoment, 
  biggestDisparity, 
  booksWithBothRatings,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">😤 Biggest Hater Moment</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">When you disagreed with everyone else</p>
      </div>
      
      {biggestHaterMoment ? (
        <div className="flex flex-col items-center gap-8 my-8 max-w-[600px]">
          <div className="flex flex-col items-center gap-4 p-8 rounded-xl w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
            <div className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)]">
              {biggestHaterMoment.coverImage ? (
                <img src={biggestHaterMoment.coverImage} alt={biggestHaterMoment.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black">{biggestHaterMoment.title}</div>
              <div className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black">by {biggestHaterMoment.author}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-8 p-8 rounded-xl w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] max-md:flex-col max-md:gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">Your Rating</div>
              <div className="flex items-center gap-2 text-[1.5rem] text-black">
                {'⭐'.repeat(biggestHaterMoment.userRating || 0)}
                <span className="text-[1.2rem] font-bold text-black font-[var(--font-main)]">{biggestHaterMoment.userRating}/5</span>
              </div>
            </div>
            
            <div className="text-[1.5rem] font-bold text-black bg-[rgba(255,210,245,0.4)] px-4 py-2 rounded-full min-w-[60px] text-center font-[var(--font-main)]">VS</div>
            
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">Everyone Else</div>
              <div className="flex items-center gap-2 text-[1.5rem] text-black">
                {'⭐'.repeat(Math.floor(biggestHaterMoment.avgRating || 0))}
                <span className="text-[1.2rem] font-bold text-black font-[var(--font-main)]">{biggestHaterMoment.avgRating?.toFixed(2)}/5</span>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-[rgba(255,165,236,0.2)] p-6 rounded-xl backdrop-blur-[10px] w-full border border-[rgba(0,0,0,0.1)]">
            <div className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]">{biggestDisparity?.toFixed(2)}</div>
            <div className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black">stars difference</div>
          </div>
          
          <div className="text-center p-6 rounded-xl w-full bg-[rgba(255,210,245,0.2)] border border-[rgba(0,0,0,0.1)]">
            <p className="m-0 text-[1.1rem] text-black font-bold font-[var(--font-main)]">You were {biggestDisparity?.toFixed(2)} stars more critical than the average reader!</p>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 rounded-xl w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
          <p className="m-0 text-[1.2rem] text-black font-[var(--font-main)]">No hater moments found - you're too agreeable! 😊</p>
        </div>
      )}
      
      <div className="text-center my-4 opacity-80">
        <p className="m-0 text-[0.9rem] font-[var(--font-main)] text-black">Based on {booksWithBothRatings || 0} books with both your rating and average rating</p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default BiggestHater;
