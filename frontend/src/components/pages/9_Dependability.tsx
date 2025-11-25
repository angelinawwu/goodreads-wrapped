import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface DependabilityProps {
  dependability?: number;
  toReadReadCount?: number;
  toReadAddedCount?: number;
  year?: string;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Dependability: React.FC<DependabilityProps> = ({ 
  dependability = 0, 
  toReadReadCount = 0, 
  toReadAddedCount = 0, 
  year,
  onPrevPage, 
  onNextPage 
}) => {
  const dependabilityPercent = dependability * 100;
  const totalBooks = toReadAddedCount + toReadReadCount;

  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center min-h-[60vh] mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">📋 Dependability</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How well you follow through on your reading goals</p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col items-center gap-4 my-4 max-w-[600px]"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center p-4 rounded-xl w-full"
          variants={itemVariants}
        >
          <motion.div 
            className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]"
            variants={itemVariants}
          >
            <AnimatedCounter value={dependabilityPercent} decimals={1} />%
          </motion.div>
          <motion.div 
            className="text-[1.2rem] opacity-80 font-[var(--font-main)] text-black"
            variants={itemVariants}
          >
            follow-through rate
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4 p-3 rounded-xl w-full max-md:flex-col max-md:gap-2"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center flex-1">
            <motion.div 
              className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]"
              variants={itemVariants}
            >
              <AnimatedCounter value={toReadReadCount} />
            </motion.div>
            <motion.div 
              className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black"
              variants={itemVariants}
            >
              books read in {year || '2025'}
            </motion.div>
          </div>
          <div className="text-[1.2rem] text-black font-bold font-[var(--font-main)]">of</div>
          <div className="flex flex-col items-center flex-1">
            <motion.div 
              className="text-[2rem] font-bold text-black font-[var(--font-main)] max-md:text-[1.5rem]"
              variants={itemVariants}
            >
              <AnimatedCounter value={totalBooks} />
            </motion.div>
            <motion.div 
              className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black"
              variants={itemVariants}
            >
              total books added in {year || '2025'}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="text-center p-6 rounded-xl w-full"
        variants={itemVariants}
      >
        <p className="m-0 text-[1.1rem] text-black font-[var(--font-main)]">
          {dependability >= 0.8 
            ? "You're incredibly reliable with your reading goals! 🎯"
            : dependability >= 0.5
            ? "You're doing well at following through on your reading plans! 📚"
            : "There's always room to improve your reading follow-through! 💪"
          }
        </p>
        <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem'}} className="font-[var(--font-main)] text-black">
          This measures how many books you read in {year || '2025'} that were also added to your shelves in {year || '2025'}.
        </p>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default Dependability;
