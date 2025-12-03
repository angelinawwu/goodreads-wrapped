import type { ReadingStats, UserProfile } from './types';

// Use environment variable for API URL
// In dev: http://localhost:3001
// In prod: Vercel backend URL (both deployed on Vercel)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchReadingStats(
  username: string,
  year: number = 2025
): Promise<ReadingStats> {
  const response = await fetch(
    `${API_BASE_URL}/scrape/${username}/books/${year}`,
    {
      cache: 'no-store', // Always fetch fresh data
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch reading stats: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchUserProfile(username: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/scrape/${username}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const data = await response.json();
  return data.userData;
}
