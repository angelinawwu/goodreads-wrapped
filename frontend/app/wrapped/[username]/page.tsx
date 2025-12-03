import { fetchReadingStats } from '@/lib/api';
import StoryViewer from '@/components/StoryViewer';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function WrappedPage({ params }: PageProps) {
  const { username } = await params;
  const stats = await fetchReadingStats(username, 2025);

  return <StoryViewer stats={stats} />;
}
