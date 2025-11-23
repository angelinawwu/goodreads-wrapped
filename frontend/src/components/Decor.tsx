import React from 'react';
import './Decor.css';

export type DecorPosition = 
  | 'top' 
  | 'bottom' 
  | 'center' 
  | 'frame' 
  | 'corner-tl' 
  | 'corner-tr' 
  | 'corner-bl' 
  | 'corner-br'
  | 'left'
  | 'right';

interface DecorProps {
  id?: number; // 1-10
  position?: DecorPosition;
  className?: string;
  style?: React.CSSProperties;
}

const Decor: React.FC<DecorProps> = ({ 
  id = 1, 
  position = 'center', 
  className = '',
  style = {}
}) => {
  // Ensure id is between 1-10
  const safeId = Math.max(1, Math.min(10, Math.floor(id)));
  const imagePath = `/decor/decor-${safeId}.jpg`;

  return (
    <div 
      className={`vintage-decor decor-pos-${position} ${className}`}
      style={style}
    >
      <img 
        src={imagePath} 
        alt="Vintage ornamentation" 
        className="decor-image"
      />
    </div>
  );
};

export default Decor;

