import type { EngagementStats } from '../types/content';
import { Card, CardTitle } from './ui/Card';

interface StatsOverviewProps {
  stats: EngagementStats;
}

const STAT_ITEMS: { key: keyof EngagementStats; label: string }[] = [
  { key: 'totalViews', label: 'Total Views' },
  { key: 'totalLikes', label: 'Total Likes' },
  { key: 'totalShares', label: 'Total Shares' },
  { key: 'comments', label: 'Comments' },
];

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Engagement Overview</CardTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] p-3 text-center"
          >
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {stats[key] ?? 0}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
