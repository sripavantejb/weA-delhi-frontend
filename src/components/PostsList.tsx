import type { Post } from '../types/content';
import { Card, CardTitle } from './ui/Card';

interface PostsListProps {
  date: Date | null;
  posts: Post[];
  onSchedulePost?: () => void;
}

function formatFullDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PostsList({ date, posts, onSchedulePost }: PostsListProps) {
  if (!date) {
    return (
      <Card>
        <CardTitle>Posts for selected date</CardTitle>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Select a date on the calendar to view posts.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Posts for {formatFullDate(date)}</CardTitle>
      {posts.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-dark)]/50 py-8">
          <p className="text-sm text-[var(--text-muted)]">No posts scheduled for this date.</p>
          {onSchedulePost && (
            <button
              type="button"
              onClick={onSchedulePost}
              className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg-black)] hover:bg-[var(--accent-hover)]"
            >
              Schedule a post
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-3 space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="rounded bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                  {post.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--text-primary)] line-clamp-3">{post.caption}</p>
                  <div className="mt-2 flex gap-4 text-xs text-[var(--text-muted)]">
                    <span>{post.views} views</span>
                    <span>{post.likes} likes</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
