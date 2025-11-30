import React, { useState } from 'react';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';
import { containerVariantsSlow, itemVariants } from '../motionVariants';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
} from '../ui/chart';
import type { ChartConfig } from '../ui/chart';

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

  // Create chart config for shadcn chart
  const chartConfig: ChartConfig = topGenres.reduce((acc, genre, index) => {
    acc[genre.toLowerCase().replace(/\s+/g, '_')] = {
      label: genre,
      color: genreColors[index],
    };
    return acc;
  }, {} as ChartConfig);

  // Transform data for Recharts
  const chartData = months.map((month, monthIndex) => {
    const monthKey = `${2025}-${String(monthIndex + 1).padStart(2, '0')}`;
    const totalBooks = monthlyBookTotals?.[monthKey] || 0;
    
    const dataPoint: { month: string; [key: string]: number | string } = {
      month: month,
    };
    
    topGenres.forEach((genre) => {
      const genreCount = monthlyGenreData?.[monthKey]?.[genre] || 0;
      const percentage = totalBooks > 0 ? (genreCount / totalBooks) * 100 : 0;
      const genreKey = genre.toLowerCase().replace(/\s+/g, '_');
      dataPoint[genreKey] = Math.round(percentage * 10) / 10; // Round to 1 decimal
    });
    
    return dataPoint;
  });

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
        <h2 className="text-[2rem] mb-[0.3rem] font-[var(--font-display)] text-[var(--color-vintage-accent)]">Genres Over Time</h2>
        <p className="text-[1.1rem] opacity-80 m-0 font-[var(--font-main)] italic">How your reading tastes evolved in 2025</p>
      </motion.div>
      
      <motion.div 
        className="w-full my-4 flex flex-col items-center"
        variants={containerVariantsSlow}
        initial="hidden"
        animate="visible"
      >
        {monthlyGenreData && topGenres.length > 0 ? (
          <motion.div 
            className="w-full flex flex-col items-center gap-4"
            variants={itemVariants}
          >
            <ChartContainer 
              config={chartConfig} 
              className="w-full h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 6,
                    right: 6,
                    top: 6,
                    bottom: 6,
                  }}
                  onMouseMove={(e) => {
                    if (e && 'activePayload' in e && e.activePayload && Array.isArray(e.activePayload) && e.activePayload[0]?.dataKey) {
                      const genreKey = e.activePayload[0].dataKey as string;
                      const genre = topGenres.find(g => g.toLowerCase().replace(/\s+/g, '_') === genreKey);
                      if (genre) setHoveredGenre(genre);
                    }
                  }}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-black/10" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(0,0,0,0.7)', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }: any) => (
                    <ChartTooltipContent active={active} payload={payload} label={label} indicator="line" />
                  )}
                />
                {topGenres.map((genre) => {
                  const genreKey = genre.toLowerCase().replace(/\s+/g, '_');
                  const isHovered = hoveredGenre === null || hoveredGenre === genre;
                  const opacity = isHovered ? 0.4 : 0.1;
                  
                  // FIXED: Safely retrieve the color directly from your config
                  // instead of relying on CSS variables
                  const genreColor = chartConfig[genreKey]?.color || '#8884d8';

                  return (
                    <Area
                      key={genreKey}
                      dataKey={genreKey}
                      type="natural"
                      // Use direct color reference
                      fill={genreColor}
                      fillOpacity={opacity}
                      stroke={genreColor}
                      strokeWidth={isHovered ? (hoveredGenre === genre ? 3 : 2) : 1.5}
                      stackId="a"
                      style={{
                        transition: 'opacity 0.2s ease, stroke-width 0.2s ease',
                      }}
                    />
                  );
                })}
                <ChartLegend 
                  payload={topGenres.map((genre, idx) => ({
                    value: genre,
                    type: 'line',
                    id: genre.toLowerCase().replace(/\s+/g, '_'),
                    color: genreColors[idx],
                  }))} 
                  config={chartConfig} 
                />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            {/* Custom Legend with hover functionality */}
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
                    className="flex items-center gap-2 cursor-pointer"
                    onMouseEnter={() => setHoveredGenre(genre)}
                    onMouseLeave={() => setHoveredGenre(null)}
                    style={{ 
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
          </motion.div>
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
