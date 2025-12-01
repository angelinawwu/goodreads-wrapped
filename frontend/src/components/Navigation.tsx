import React from 'react';
import './Navigation.css';
import { CircleArrowRight, CircleArrowLeft } from 'lucide-react';

interface NavigationProps {
  onPrevPage: () => void;
  onNextPage: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onPrevPage, 
  onNextPage, 
  showPrev = true, 
  showNext = true,
  disablePrev = false,
  disableNext = false
}) => {
  return (
    <>
      {showPrev && (
        <div 
          className={`nav-left ${disablePrev ? 'nav-disabled' : ''}`} 
          onClick={disablePrev ? undefined : onPrevPage}
        >
          <CircleArrowLeft />
        </div>
      )}
      {showNext && (
        <div 
          className={`nav-right ${disableNext ? 'nav-disabled' : ''}`} 
          onClick={disableNext ? undefined : onNextPage}
        >
          <CircleArrowRight />
        </div>
      )}
    </>
  );
};

export default Navigation;
