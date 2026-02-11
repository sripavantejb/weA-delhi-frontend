import type { Post } from '../types/content';
import { Card, CardTitle } from './ui/Card';

interface RecentPostsPerformanceProps {
  posts: Post[];
}

export function RecentPostsPerformance({ posts }: RecentPostsPerformanceProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Recent Posts Performance</CardTitle>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] p-3"
          >
            <p className="text-sm text-[var(--text-primary)] line-clamp-2">{post.caption}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {post.views} views · {post.likes} likes · {post.shares} shares
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
