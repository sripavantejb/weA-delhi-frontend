import type { ContentPlanIdea } from '../types/content';
import { Card, CardTitle } from './ui/Card';

interface ContentPlanResultsProps {
  ideas: ContentPlanIdea[];
}

export function ContentPlanResults({ ideas }: ContentPlanResultsProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Generated content ideas</CardTitle>
      <ul className="max-h-[400px] space-y-3 overflow-y-auto">
        {ideas.map((idea, i) => (
          <li
            key={`${idea.date}-${i}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] p-3"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-[var(--accent)]">
                Day {i + 1} · {idea.date}
              </span>
              <span className="rounded bg-[var(--accent)]/20 px-2 py-0.5 text-xs text-[var(--accent)]">
                {idea.type}
              </span>
              <span className="text-[var(--text-muted)]">
                {Array.isArray(idea.platforms) ? idea.platforms.join(', ') : ''}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--text-primary)]">{idea.caption}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
