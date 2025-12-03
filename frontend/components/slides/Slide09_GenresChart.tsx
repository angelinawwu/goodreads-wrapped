'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  containerVariants,
  stagedHeadline,
  itemVariants,
  calculateAnimationDuration,
} from '@/lib/motionVariants';
import { getTextColor } from '@/lib/utils';
import type { SlideProps } from '@/lib/types';

// Chart colors from the palette
const CHART_COLORS = ['#436407', '#3A1010', '#357160', '#190606', '#6B4426']

export default function Slide09_GenresChart({ stats, onAnimationComplete }: SlideProps) {
  // Slide 9 is at index 8
  const textColor = getTextColor(8);
  
  // Get top 5 genres in consistent order
  const topFiveGenres = stats.topGenres.slice(0, 5);

  useEffect(() => {
    const duration = calculateAnimationDuration({
      hasStaged: true,
    });

    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration * 1000 + 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // Transform monthly genre data for chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group data by month number (ignoring year) to avoid duplicates
  const chartData = stats.monthlyGenreData
    ? (() => {
        const monthGroups: { [monthNum: number]: { genres: { [genre: string]: number }; total: number } } = {};
        
        Object.entries(stats.monthlyGenreData).forEach(([monthKey, genres]) => {
          const monthNum = parseInt(monthKey.split('-')[1], 10); // Get month number (1-12)
          const total = stats.monthlyBookTotals?.[monthKey] || 1;
          
          if (!monthGroups[monthNum]) {
            monthGroups[monthNum] = { genres: {}, total: 0 };
          }
          
          // Aggregate genre counts
          Object.entries(genres as any).forEach(([genre, count]) => {
            monthGroups[monthNum].genres[genre] = (monthGroups[monthNum].genres[genre] || 0) + (count as number);
          });
          
          // Aggregate totals
          monthGroups[monthNum].total += total;
        });
        
        // Convert to chart data format
        return Object.entries(monthGroups)
          .map(([monthNumStr, data]) => {
            const monthNum = parseInt(monthNumStr, 10);
            const monthName = monthNames[monthNum - 1]; // Convert to 0-based index
            const dataPoint: any = { month: monthName };
            
            // Calculate percentages for top 5 genres
            topFiveGenres.forEach((genre) => {
              const count = data.genres[genre.name] || 0;
              dataPoint[genre.name] = ((count / data.total) * 100).toFixed(1);
            });
            
            return { ...dataPoint, monthNum }; // Include monthNum for sorting
          })
          .sort((a, b) => a.monthNum - b.monthNum)
          .map(({ monthNum, ...rest }) => rest); // Remove monthNum from final data
      })()
    : [];

  return (
    <motion.div
      className="min-h-screen flex flex-col mx-auto max-w-5xl items-center justify-center p-8 relative z-[var(--z-content)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={stagedHeadline} className="text-headline text-center mb-12">
        Let's see how your taste changed during the year.
      </motion.h2>

      <motion.div variants={itemVariants} className="w-full max-w-4xl">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '12px', fill: textColor }}
              tick={{ fill: textColor }}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '12px', fill: textColor }}
              tick={{ fill: textColor }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: textColor,
              }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            {topFiveGenres.map((genre, i) => (
              <Area
                key={genre.name}
                type="monotone"
                dataKey={genre.name}
                stackId="1"
                stroke={CHART_COLORS[i]}
                fill={CHART_COLORS[i]}
                fillOpacity={0.6}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: textColor }}
              iconType="circle"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
