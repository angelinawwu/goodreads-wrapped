import React, { useEffect } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * A number that counts up from 0 to the target value.
 * Uses useMotionValue and useTransform for performant, non-render-blocking updates.
 * Supports decimal numbers for ratings and percentages.
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  decimals = 0,
  duration = 2.5,
  className = ''
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toString();
  });

  useEffect(() => {
    const animation = animate(count, value, {
      duration: duration,
      ease: "circOut", 
    });
    return animation.stop;
  }, [value, count, duration]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default AnimatedCounter;

