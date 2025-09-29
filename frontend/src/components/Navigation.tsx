import React from 'react';
import './Navigation.css';
import { CircleArrowRight, CircleArrowLeft } from 'lucide-react';

interface NavigationProps {
  onPrevPage: () => void;
  onNextPage: () => void;
  showPrev?: boolean;
  showNext?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onPrevPage, 
  onNextPage, 
  showPrev = true, 
  showNext = true 
}) => {
  return (
    <>
      {showPrev && (
        <div className="nav-left" onClick={onPrevPage}>
          <CircleArrowLeft />
        </div>
      )}
      {showNext && (
        <div className="nav-right" onClick={onNextPage}>
          <CircleArrowRight />
        </div>
      )}
    </>
  );
};

export default Navigation;
