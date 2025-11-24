import React from 'react';
import Navigation from '../Navigation';

interface CompleteProps {
  yearBooks?: number;
  pagesScraped?: number;
  qrCodeUrl?: string | null;
  isMobile: boolean;
  onRestart: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Complete: React.FC<CompleteProps> = ({ 
  yearBooks, 
  pagesScraped, 
  qrCodeUrl, 
  isMobile, 
  onRestart, 
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20">
      <div className="mb-4 w-full text-center">
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">🎉 That's a Wrap!</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">Thanks for exploring your reading year</p>
      </div>
      <div className="flex justify-center gap-12 my-12 max-md:flex-col max-md:gap-8">
        <div className="text-center">
          <div className="text-[3rem] font-bold text-black mb-2 font-[var(--font-main)]">{yearBooks || 0}</div>
          <div className="text-[1rem] opacity-80 font-[var(--font-main)] text-black">Books Read</div>
        </div>
        <div className="text-center">
          <div className="text-[3rem] font-bold text-black mb-2 font-[var(--font-main)]">{pagesScraped || 0}</div>
          <div className="text-[1rem] opacity-80 font-[var(--font-main)] text-black">Pages Analyzed</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <button className="bg-[#FFD2F5] text-black border border-black py-4 px-8 rounded-xl text-[1.1rem] font-[var(--font-main)] cursor-pointer transition-all duration-300 mt-8 min-w-[150px] hover:bg-[#FFA5EC] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(255,165,236,0.4)]" onClick={onRestart}>
          Start Over
        </button>
        {!isMobile && qrCodeUrl && (
          <div className="text-center my-8">
            <p className="mb-2 font-[var(--font-main)] text-black">Share on mobile:</p>
            <img src={qrCodeUrl} alt="QR Code" className="max-w-[150px] rounded-xl border border-[rgba(0,0,0,0.1)]" />
          </div>
        )}
      </div>
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </div>
  );
};

export default Complete;
