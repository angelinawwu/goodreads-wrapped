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
const CHART_COLORS = ['#737437', '#3A1010', '#757160', '#B76039', '#0B2426'];

export default function Slide09_GenresChart({ stats, onAnimationComplete }: SlideProps) {
  // Slide 9 is at index 8
  const textColor = getTextColor(8);

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
  const chartData = stats.monthlyGenreData
    ? Object.entries(stats.monthlyGenreData).map(([month, genres]) => {
        const total = stats.monthlyBookTotals?.[month] || 1;
        const dataPoint: any = { month: month.split('-')[1] }; // Just MM

        // Calculate percentages for top 5 genres
        stats.topGenres.slice(0, 5).forEach((genre) => {
          const count = (genres as any)[genre.name] || 0;
          dataPoint[genre.name] = ((count / total) * 100).toFixed(1);
        });

        return dataPoint;
      })
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
            {stats.topGenres.slice(0, 5).map((genre, i) => (
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
