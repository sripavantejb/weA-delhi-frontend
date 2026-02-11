import type { PlatformStats } from '../types/content';
import { Card, CardTitle } from './ui/Card';

interface PlatformPerformanceProps {
  stats: PlatformStats[];
}

export function PlatformPerformance({ stats }: PlatformPerformanceProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Platform Performance</CardTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
              <th className="pb-2 font-medium">Platform</th>
              <th className="pb-2 font-medium">Posts</th>
              <th className="pb-2 font-medium">Views</th>
              <th className="pb-2 font-medium">Likes</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.platform} className="border-b border-[var(--border)]">
                <td className="py-3 font-medium text-[var(--text-primary)]">{row.platform}</td>
                <td className="py-3 text-[var(--text-secondary)]">{row.posts}</td>
                <td className="py-3 text-[var(--text-secondary)]">{row.views}</td>
                <td className="py-3 text-[var(--text-secondary)]">{row.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
