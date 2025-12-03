import React from 'react';
import { motion } from 'framer-motion';
import { slideVariants, slideVariantsTop, fadeScaleVariants } from './motionVariants';

export type DecorPosition = 
  | 'top' 
  | 'bottom' 
  | 'center' 
  | 'frame' 
  | 'frame-c'
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

const getPositionClasses = (position: DecorPosition): string => {
  const baseClasses = 'absolute pointer-events-none z-[1] mix-blend-multiply opacity-80';
  
  const positionMap: Record<DecorPosition, string> = {
    'top': 'top-0 left-1/2 -translate-x-1/2 w-full overflow-hidden',
    'bottom': 'bottom-0 left-1/2 -translate-x-1/2 w-full max-h-[150px] overflow-hidden',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[80%] z-0 opacity-[0.15]',
    'frame': 'top-0 left-0 w-full h-auto z-10',
    'frame-c': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0',
    'corner-tl': 'top-0 left-0 w-[150px]',
    'corner-tr': 'top-0 right-0 w-[150px] scale-x-[-1]',
    'corner-bl': 'bottom-0 left-0 w-[150px] scale-y-[-1]',
    'corner-br': 'bottom-0 right-0 w-[150px] scale-[-1]',
    'left': 'top-1/2 left-0 -translate-y-1/2 w-[100px]',
    'right': 'top-1/2 right-0 -translate-y-1/2 scale-x-[-1] w-[100px]',
  };

  return `${baseClasses} ${positionMap[position]}`;
};

const getImageClasses = (position: DecorPosition): string => {
  if (position === 'top' || position === 'bottom') {
    return 'block w-full object-cover';
  }
  if (position === 'frame') {
    return 'block w-full h-full object-fill';
  }
  return 'block max-w-full h-auto';
};

const getAnimationVariants = (position: DecorPosition) => {
  if (position === 'top') {
    return slideVariantsTop;
  }
  if (position === 'bottom') {
    return slideVariants;
  }
  return fadeScaleVariants;
};

const Decor: React.FC<DecorProps> = ({ 
  id = 1, 
  position = 'center', 
  className = '',
  style = {}
}) => {
  // Ensure id is between 1-10
  const safeId = Math.max(1, Math.min(10, Math.floor(id)));
  const imagePath = `/decor/decor-${safeId}.jpg`;
  const variants = getAnimationVariants(position);

  return (
    <motion.div 
      className={`${getPositionClasses(position)} ${className}`}
      style={style}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: 0.5 // Animate in after initial page content
      }}
    >
      <img 
        src={imagePath} 
        alt="Vintage ornamentation" 
        className={getImageClasses(position)}
      />
    </motion.div>
  );
};

export default Decor;
