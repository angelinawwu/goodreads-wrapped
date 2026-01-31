'use client';

import { motion } from 'framer-motion';
import { EASING } from '@/lib/motionVariants';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[var(--z-progress)] p-4">
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-[var(--bg-4)]"
              initial={{ width: '0%' }}
              animate={{
                width: i <= current ? '100%' : '0%',
              }}
              transition={{
                // Active bar fills linearly, completed bars snap in quickly
                duration: i === current ? 3 : 0.2,
                ease: i === current ? 'linear' : EASING.easeOutQuart,
              }}
              style={{
                boxShadow: i === current ? '0 0 10px var(--bg-4)' : 'none',
                willChange: i === current ? 'width' : 'auto',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
