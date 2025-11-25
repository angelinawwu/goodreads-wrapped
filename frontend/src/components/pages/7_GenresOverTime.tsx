import React, { useState } from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants } from '../motionVariants';

interface GenresOverTimeProps {
  genreCounts?: { [key: string]: number };
  monthlyGenreData?: {
    [month: string]: {
      [genre: string]: number;
    };
  };
  monthlyBookTotals?: {
    [month: string]: number;
  };
  onPrevPage: () => void;
  onNextPage: () => void;
}

const GenresOverTime: React.FC<GenresOverTimeProps> = ({ 
  genreCounts, 
  monthlyGenreData, 
  monthlyBookTotals,
  onPrevPage, 
  onNextPage 
}) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get top 5 genres for the chart
  const topGenres = genreCounts 
    ? Object.entries(genreCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([genre]) => genre)
    : [];

  // Map specific genres to consistent colors
  const genreColorMap: { [genre: string]: string } = {
    'fantasy': '#E0ABFF',           // Purple
    'romance': '#FFA5C3',           // Pink
    'mystery': '#C297CF',           // Dark blue
    'science fiction': '#8EF9C2',   // Blue
    'thriller': '#FFB48F',          // Red
    'historical fiction': '#CDF862', // Orange
    'contemporary': '#8DD6F8',      // Green
    'young adult': '#F5CB86',       // Yellow
    'horror': '#E58C8C',            // Dark purple
    'biography': '#CEB4A4',         // Gray
    'non-fiction': '#B7B7B7',       // Teal
    'memoir': '#f1c40f',            // Gold
    'literary fiction': '#95a5a6',  // Light gray
    'crime': '#C47F77',             // Dark red
    'adventure': '#EDB380'          // Orange-red
  };
  
  // Fallback colors for unmapped genres
  const fallbackColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#fd79a8', '#fdcb6e', '#6c5ce7', '#a29bfe', '#74b9ff'
  ];
  
  // Get colors for top genres
  const genreColors = topGenres.map((genre, index) => 
    genreColorMap[genre.toLowerCase()] || fallbackColors[index % fallbackColors.length]
  );

  const createBoundedSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      // Simple control points that stay close to the actual points
      const cp1x = p1.x + (p2.x - p1.x) * 0.5;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) * 0.5;
      const cp2y = p2.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path;
  };

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
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">📈 Genres Over Time</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How your reading tastes evolved in 2025</p>
      </motion.div>
      
      <motion.div 
        className="w-full max-w-[900px] my-4 flex flex-col items-center"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        {monthlyGenreData && topGenres.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-4">
            <motion.svg 
              viewBox="0 0 800 400" 
              className="w-full h-auto max-w-[800px] rounded-[10px] p-4 max-md:p-2"
              variants={itemVariants}
            >
              {/* Define drop shadow filter */}
              <defs>
                <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" floodOpacity="0.5"/>
                </filter>
              </defs>
              
              {/* Chart background */}
              <rect width="800" height="400" fill="transparent" />
              
              {/* Y-axis labels */}
              {[0, 25, 50, 75, 100].map(value => (
                <g key={value}>
                  <line 
                    x1="80" 
                    y1={350 - (value * 2.5)} 
                    x2="750" 
                    y2={350 - (value * 2.5)} 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1"
                  />
                  <text 
                    x="70" 
                    y={355 - (value * 2.5)} 
                    fill="white" 
                    fontSize="12" 
                    textAnchor="end"
                  >
                    {value}%
                  </text>
                </g>
              ))}
              
              {/* X-axis labels */}
              {months.map((month, index) => (
                <text 
                  key={month}
                  x={110 + (index * 55)} 
                  y="380" 
                  fill="white" 
                  fontSize="12" 
                  textAnchor="middle"
                >
                  {month}
                </text>
              ))}
              
              {/* Genre lines */}
              {topGenres.map((genre, genreIndex) => {
                const points = months.map((_, monthIndex) => {
                  const monthKey = `${2025}-${String(monthIndex + 1).padStart(2, '0')}`;
                  const totalBooks = monthlyBookTotals?.[monthKey] || 0;
                  const genreCount = monthlyGenreData[monthKey]?.[genre] || 0;
                  const percentage = totalBooks > 0 ? (genreCount / totalBooks) * 100 : 0;
                  
                  return {
                    x: 110 + (monthIndex * 55),
                    y: 350 - (percentage * 2.5)
                  };
                });
                
                const pathData = createBoundedSmoothPath(points);
                
                const isHovered = hoveredGenre === null || hoveredGenre === genre;
                const opacity = isHovered ? 1 : 0.2;
                const strokeWidth = isHovered ? (hoveredGenre === genre ? 4 : 3) : 2;
                
                return (
                  <g 
                    key={genre}
                    onMouseEnter={() => setHoveredGenre(genre)}
                    onMouseLeave={() => setHoveredGenre(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.path
                      d={pathData}
                      fill="none"
                      stroke={genreColors[genreIndex]}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#lineShadow)"
                      opacity={opacity}
                      style={{ transition: 'opacity 0.2s ease, stroke-width 0.2s ease' }}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: opacity }}
                      transition={{ 
                        pathLength: { duration: 1.5, delay: genreIndex * 0.2, ease: "easeOut" },
                        opacity: { duration: 0.2 }
                      }}
                    />
                    {/* Data points */}
                    {points.map((point, index) => (
                      <motion.circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={genreColors[genreIndex]}
                        opacity={opacity}
                        style={{ transition: 'opacity 0.2s ease' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: opacity }}
                        transition={{ 
                          delay: (genreIndex * 0.2) + (index * 0.1) + 1.5,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                      />
                    ))}
                  </g>
                );
              })}
            </motion.svg>
            
            {/* Legend */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-4 max-md:gap-2"
              variants={containerVariantsSlow}
              initial="hidden"
              animate="visible"
            >
              {topGenres.map((genre, index) => {
                const isHovered = hoveredGenre === null || hoveredGenre === genre;
                const opacity = isHovered ? 1 : 0.3;
                
                return (
                  <motion.div 
                    key={genre} 
                    className="flex items-center gap-2"
                    onMouseEnter={() => setHoveredGenre(genre)}
                    onMouseLeave={() => setHoveredGenre(null)}
                    style={{ 
                      cursor: 'pointer',
                      opacity: opacity,
                      transition: 'opacity 0.2s ease'
                    }}
                    variants={itemVariants}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: genreColors[index] }}
                    ></div>
                    <span className="text-[0.9rem] text-black font-medium font-[var(--font-main)] max-md:text-[0.8rem]">{genre}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="text-center p-12 text-[rgba(0,0,0,0.7)] text-[1.1rem] font-[var(--font-main)]"
            variants={itemVariants}
          >
            <p>Not enough data to generate chart</p>
          </motion.div>
        )}
      </motion.div>
      
      <Navigation onPrevPage={onPrevPage} onNextPage={onNextPage} />
    </motion.div>
  );
};

export default GenresOverTime;
