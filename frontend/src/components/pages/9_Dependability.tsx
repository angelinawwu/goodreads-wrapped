import React from 'react';
import Navigation from '../Navigation';

interface DependabilityProps {
  dependability?: number;
  toReadReadCount?: number;
  toReadAddedCount?: number;
  year?: string;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability, 
  toReadReadCount, 
  toReadAddedCount, 
  year,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">📋 Dependability</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How well you follow through on your reading goals</p>
      </div>
      
      <div className="flex flex-col items-center gap-4 my-4 max-w-[600px]">
        <div className="text-center p-4 rounded-xl w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)]">
          <div className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]">
            {dependability ? (dependability * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="text-[1.2rem] opacity-80 font-[var(--font-main)] text-black">follow-through rate</div>
        </div>
        
        <div className="flex items-center gap-4 p-3 rounded-xl w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] border border-[rgba(0,0,0,0.1)] max-md:flex-col max-md:gap-2">
          <div className="flex flex-col items-center flex-1">
            <div className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]">{toReadReadCount || 0}</div>
            <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">books read in {year || '2025'}</div>
          </div>
          <div className="text-[1.2rem] text-black font-bold font-[var(--font-main)]">of</div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]">{(toReadAddedCount || 0) + (toReadReadCount || 0)}</div>
            <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">total books added in {year || '2025'}</div>
          </div>
        </div>
      </div>
      
      <div className="text-center p-6 rounded-xl w-full bg-[rgba(255,210,245,0.2)] border border-[rgba(0,0,0,0.1)]">
        <p className="m-0 text-[1.1rem] text-black font-[var(--font-main)]">
          {dependability && dependability >= 0.8 
            ? "You're incredibly reliable with your reading goals! 🎯"
            : dependability && dependability >= 0.5
            ? "You're doing well at following through on your reading plans! 📚"
            : "There's always room to improve your reading follow-through! 💪"
          }
        </p>
        <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem'}} className="font-[var(--font-main)] text-black">
          This measures how many books you read in {year || '2025'} that were also added to your shelves in {year || '2025'}.
        </p>
      </div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default Dependability;
