import React, { useEffect } from 'react';
import { motion, useTransform, animate, useMotionValue } from 'framer-motion';

// --- Types ---
interface BooksReadProps {
  yearBooks?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

// --- Sub-components ---

/** * Internal Navigation Component 
 * (Included locally to ensure the preview works without external dependencies)
 */
const Navigation = ({ onPrevPage, onNextPage }: { onPrevPage: () => void, onNextPage: () => void }) => {
  return (
    <div className="flex justify-between w-full max-w-xs mx-auto">
      <button 
        onClick={onPrevPage}
        className="px-6 py-3 rounded-full bg-zinc-800/50 backdrop-blur-md text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all font-medium border border-zinc-700/50"
      >
        Back
      </button>
      <button 
        onClick={onNextPage}
        className="px-6 py-3 rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        Next
      </button>
    </div>
  );
};

/**
 * A number that counts up from 0 to the target value.
 * Uses useMotionValue and useTransform for performant, non-render-blocking updates.
 */
const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 2.5, // Slightly longer for dramatic effect
      ease: "circOut", 
    });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

/**
 * The Spiky Star Background Graphic
 * This provides that "Spotify Wrapped" geometric chaos.
 */
const SpikyStar = () => (
  <motion.svg
    viewBox="0 0 200 200"
    className="absolute w-[180%] h-[180%] text-lime-400 opacity-20 md:opacity-30 mix-blend-screen pointer-events-none"
    initial={{ rotate: 0, scale: 0 }}
    animate={{ 
      rotate: 360, 
      scale: [0, 1.5, 1.2], // Pop out huge, then settle
    }}
    transition={{
      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
      scale: { duration: 1.5, type: "spring", bounce: 0.5 }
    }}
  >
    {/* A 12-point star polygon */}
    <path 
      fill="currentColor" 
      d="M100 0 L115 70 L195 50 L140 100 L195 150 L115 130 L100 200 L85 130 L5 150 L60 100 L5 50 L85 70 Z" 
    />
  </motion.svg>
);

// --- Main Component ---

const BooksRead: React.FC<BooksReadProps> = ({ yearBooks = 0, onPrevPage, onNextPage }) => {
  
  // Stagger children for a sequential "reveal" effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each element showing up
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 } 
    },
  };

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-900 text-white rounded-xl p-6">
      
      {/* 1. Dynamic Background Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
         <motion.div 
           className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-[80px]"
           animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
           transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
         />
         <motion.div 
           className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-pink-600 rounded-full blur-[80px]"
           animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
           transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
         />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 2. Intro Text */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-purple-300 font-sans">
            The Results Are In
          </h2>
          <p className="text-lg md:text-xl font-light text-zinc-300 mt-1 font-sans">
            In 2025, you devoured...
          </p>
        </motion.div>

        {/* 3. The "Hero" Section */}
        <div className="relative flex items-center justify-center w-full aspect-square max-w-[300px]">
          {/* Animated Spiky Star Background */}
          <SpikyStar />
          
          {/* The Big Number */}
          <motion.div 
            className="relative z-20 font-black text-[8rem] md:text-[10rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-2xl font-sans"
            // Override the standard variant for extra dramatic pop
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.5 // Wait for star to expand first
            }}
          >
            <AnimatedCounter value={yearBooks} />
          </motion.div>
        </div>

        {/* 4. Bottom Label */}
        <motion.div variants={itemVariants} className="-mt-8 z-20 mb-12">
          <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-lime-400 font-sans" style={{ textShadow: '0px 4px 20px rgba(0,0,0,0.5)' }}>
            BOOKS
          </span>
        </motion.div>

      </motion.div>

      {/* Navigation (Positioned relative to content for better mobile flow) */}
      <div className="relative z-30 w-full px-8 mt-auto">
         <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
      </div>
    </div>
  );
};

export default BooksRead;