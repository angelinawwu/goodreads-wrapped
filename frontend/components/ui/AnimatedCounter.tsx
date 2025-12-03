'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * A number that counts up from 0 to the target value.
 * Uses useMotionValue and useTransform for performant, non-render-blocking updates.
 * Supports decimal numbers for ratings and percentages.
 */
export default function AnimatedCounter({
  value,
  decimals = 0,
  duration = 2.5,
  delay = 0,
  className = '',
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toString();
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      delay,
      ease: 'circOut',
    });
    return () => {
      controls.stop();
    };
  }, [value, duration, delay, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
