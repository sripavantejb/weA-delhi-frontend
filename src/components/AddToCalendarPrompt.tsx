import type { ContentPlanIdea } from '../types/content';

interface AddToCalendarPromptProps {
  ideas: ContentPlanIdea[];
  onConfirm: () => void;
  onCancel: () => void;
  inserting: boolean;
  inserted: boolean;
  error: string | null;
}

export function AddToCalendarPrompt({
  ideas,
  onConfirm,
  onCancel,
  inserting,
  inserted,
  error,
}: AddToCalendarPromptProps) {
  if (inserted) {
    return (
      <p className="rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-3 text-sm text-[var(--accent)]">
        Added {ideas.length} posts to your calendar.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <p className="mb-4 text-[var(--text-primary)]">
        Do you want to add these {ideas.length} posts to your calendar?
      </p>
      {error && (
        <p className="mb-3 text-sm text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={inserting}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-black)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {inserting ? 'Adding...' : 'Yes, add to calendar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={inserting}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-black)] disabled:opacity-50"
        >
          No, thanks
        </button>
      </div>
    </div>
  );
}
