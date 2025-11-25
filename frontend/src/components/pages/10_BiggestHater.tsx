import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface BiggestHaterProps {
  biggestHaterMoment?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
  };
  biggestDisparity?: number;
  booksWithBothRatings?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const BiggestHater: React.FC<BiggestHaterProps> = ({ 
  biggestHaterMoment, 
  biggestDisparity = 0, 
  booksWithBothRatings = 0,
  onPrevPage, 
  onNextPage 
}) => {
  return (
    <motion.div 
      className="page-container flex flex-col items-center justify-center mt-8 relative z-20"
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-4 w-full text-center"
        variants={itemVariants}
      >
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">😤 Biggest Hater Moment</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">When you disagreed with everyone else</p>
      </motion.div>
      
      {biggestHaterMoment ? (
        <motion.div 
          className="flex flex-col items-center gap-8 my-8"
          variants={containerVariantsSlow}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex flex-col items-center gap-4 p-8 rounded-xl w-full"
            variants={fadeScaleVariants}
          >
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden"
              variants={fadeScaleVariants}
            >
              {biggestHaterMoment.coverImage ? (
                <img src={biggestHaterMoment.coverImage} alt={biggestHaterMoment.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {biggestHaterMoment.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {biggestHaterMoment.author}
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-8 p-8 rounded-xl w-full max-md:flex-col max-md:gap-4"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">Your Rating</div>
              <div className="flex items-center gap-2 text-[1.5rem] text-black">
                {'⭐'.repeat(biggestHaterMoment.userRating || 0)}
                <span className="text-[1.2rem] font-bold text-black font-[var(--font-main)]">{biggestHaterMoment.userRating}/5</span>
              </div>
            </div>
            
            <div className="text-[1.5rem] font-bold text-black px-4 py-2 rounded-full text-center font-[var(--font-main)]">VS</div>
            
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="text-[0.9rem] opacity-80 text-center font-[var(--font-main)] text-black">Everyone Else</div>
              <div className="flex items-center gap-2 text-[1.5rem] text-black">
                {'⭐'.repeat(Math.floor(biggestHaterMoment.avgRating || 0))}
                <span className="text-[1.2rem] font-bold text-black font-[var(--font-main)]">{biggestHaterMoment.avgRating?.toFixed(2)}/5</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-xl w-full"
            variants={itemVariants}
          >
            <motion.div 
              className="text-[3rem] font-bold text-black my-2 font-[var(--font-main)] max-md:text-[2rem]"
              variants={itemVariants}
            >
              <AnimatedCounter value={biggestDisparity} decimals={2} />
            </motion.div>
            <motion.div 
              className="text-[1.1rem] opacity-80 font-[var(--font-main)] text-black"
              variants={itemVariants}
            >
              stars difference
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-xl w-full"
            variants={itemVariants}
          >
            <p className="m-0 text-[1.1rem] text-black font-bold font-[var(--font-main)]">
              You were <AnimatedCounter value={biggestDisparity} decimals={2} /> stars more critical than the average reader!
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="text-center p-12 rounded-xl w-full"
          variants={itemVariants}
        >
          <p className="m-0 text-[1.2rem] text-black font-[var(--font-main)]">No hater moments found - you're too agreeable! 😊</p>
        </motion.div>
      )}
      
      <motion.div 
        className="text-center my-4 opacity-80"
        variants={itemVariants}
      >
        <p className="m-0 text-[0.9rem] font-[var(--font-main)] text-black">
          Based on <AnimatedCounter value={booksWithBothRatings} /> books with both your rating and average rating
        </p>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default BiggestHater;
