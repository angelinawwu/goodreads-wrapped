import React from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants, fadeScaleVariants, slideVariants } from '../motionVariants';
import AnimatedCounter from '../AnimatedCounter';

interface SentimentData {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
  fullReview: string;
}

interface MostScathingReviewProps {
  mostScathingReview?: {
    title: string;
    author: string;
    userRating?: number;
    avgRating?: number;
    coverImage?: string;
    sentiment?: SentimentData;
  };
  booksWithReviews?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const MostScathingReview: React.FC<MostScathingReviewProps> = ({ 
  mostScathingReview, 
  booksWithReviews = 0,
  onPrevPage, 
  onNextPage 
}) => {
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
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">🔥 Most Scathing Review</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">Your most critical review of 2025</p>
      </motion.div>
      
      {mostScathingReview ? (
        <motion.div 
          className="flex flex-col items-center gap-8 my-8"
          variants={containerVariantsSlow}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex items-center gap-6 p-4 max-w-[600px] w-full bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px] rounded-xl border border-[rgba(0,0,0,0.1)] max-md:flex-col max-md:text-center"
            variants={fadeScaleVariants}
          >
            <motion.div 
              className="w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)] flex-shrink-0"
              variants={fadeScaleVariants}
            >
              {mostScathingReview.coverImage ? (
                <img src={mostScathingReview.coverImage} alt={mostScathingReview.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[3rem] bg-[rgba(237,240,245,0.5)] text-black">📖</div>
              )}
            </motion.div>
            <div className="text-center md:text-left">
              <motion.div 
                className="text-[1.1rem] font-bold mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                {mostScathingReview.title}
              </motion.div>
              <motion.div 
                className="text-[0.9rem] opacity-80 mb-2 font-[var(--font-main)] text-black"
                variants={itemVariants}
              >
                by {mostScathingReview.author}
              </motion.div>
              {mostScathingReview.userRating && (
                <motion.div 
                  className="text-[1rem] font-bold text-black font-[var(--font-main)]"
                  variants={itemVariants}
                >
                  ⭐ {mostScathingReview.userRating}/5
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="p-4 max-w-[700px] w-full"
            variants={containerVariantsSlow}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="text-[1.1rem] leading-relaxed italic mb-8 text-black text-center font-[var(--font-main)] opacity-90 max-md:text-[1rem]"
              variants={slideVariants}
            >
              "{mostScathingReview.sentiment?.fullReview || 'No review text available'}"
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center gap-6"
              variants={containerVariantsSlow}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-[3rem] font-bold text-[#FFA5EC] mb-2 font-[var(--font-main)] max-md:text-[2rem]"
                  variants={itemVariants}
                >
                  <AnimatedCounter value={mostScathingReview.sentiment?.comparative || 0} decimals={3} />
                </motion.div>
                <motion.div 
                  className="text-[1rem] opacity-80 font-[var(--font-main)] text-black"
                  variants={itemVariants}
                >
                  sentiment score
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex gap-8 max-md:flex-col max-md:gap-4"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 text-[0.9rem] font-[var(--font-main)] text-black">
                  <span className="text-[1.2rem]">😊</span>
                  <span><AnimatedCounter value={mostScathingReview.sentiment?.positive?.length || 0} /> positive words</span>
                </div>
                <div className="flex items-center gap-2 text-[0.9rem] font-[var(--font-main)] text-black">
                  <span className="text-[1.2rem]">😠</span>
                  <span><AnimatedCounter value={mostScathingReview.sentiment?.negative?.length || 0} /> negative words</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center text-[1.2rem] text-[#FFA5EC] font-bold font-[var(--font-main)]"
            variants={itemVariants}
          >
            <p>This was your most critical review of the year! 💥</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="text-center p-12 rounded-xl border border-[rgba(0,0,0,0.1)] bg-[rgba(237,240,245,0.3)] backdrop-blur-[10px]"
          variants={itemVariants}
        >
          <p className="m-0 text-[1.2rem] text-black font-[var(--font-main)]">No scathing reviews found - you're too nice! 😊</p>
        </motion.div>
      )}
      
      <motion.div 
        className="text-center text-[0.9rem] opacity-70 mt-4 font-[var(--font-main)] text-black"
        variants={itemVariants}
      >
        <p>Based on <AnimatedCounter value={booksWithReviews} /> books with reviews</p>
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default MostScathingReview;
