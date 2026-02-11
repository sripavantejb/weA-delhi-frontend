import { useState } from 'react';
import type { Post } from '../types/content';

interface DateDetailDrawerProps {
  isOpen: boolean;
  date: Date | null;
  posts: Post[];
  onClose: () => void;
  onAddPost: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
}

function formatFullDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m || '00'} ${ampm}`;
}

export function DateDetailDrawer({
  isOpen,
  date,
  posts,
  onClose,
  onAddPost,
  onEditPost,
  onDeletePost,
}: DateDetailDrawerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = (post: Post) => {
    if (deletingId === post.id) {
      onDeletePost(post);
      setDeletingId(null);
      return;
    }
    setDeletingId(post.id);
  };

  const cancelDelete = () => setDeletingId(null);

  if (!date) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-250 ease-out"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--bg-card)] shadow-xl transition-transform duration-250 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
        aria-modal="true"
        aria-label={`Details for ${formatFullDate(date)}`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <h2 className="text-lg font-semibold text-[var(--accent)]">
              {formatFullDate(date)}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
              aria-label="Close"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <p className="text-sm text-[var(--text-muted)]">No posts scheduled for this date.</p>
                <button
                  type="button"
                  onClick={onAddPost}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg-black)] hover:bg-[var(--accent-hover)]"
                >
                  Add post
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="shrink-0 rounded bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                        {post.type}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatTime(post.time)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                      {post.caption || 'No caption'}
                    </p>
                    {post.platforms && post.platforms.length > 0 && (
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {post.platforms.join(', ')}
                      </p>
                    )}
                    <div className="mt-2 flex gap-3 text-xs text-[var(--text-muted)]">
                      <span>{post.views} views</span>
                      <span>{post.likes} likes</span>
                      <span>{post.shares} shares</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEditPost(post)}
                        className="rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                      >
                        Edit
                      </button>
                      {deletingId === post.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(post)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Confirm delete
                          </button>
                          <button
                            type="button"
                            onClick={cancelDelete}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(post)}
                          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {posts.length > 0 && (
            <div className="shrink-0 border-t border-[var(--border)] p-4">
              <button
                type="button"
                onClick={onAddPost}
                className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--bg-black)] hover:bg-[var(--accent-hover)]"
              >
                Add post
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
