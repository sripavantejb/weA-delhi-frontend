import { Card, CardTitle } from './ui/Card';

const TIPS = [
  'Post at consistent times to grow engagement.',
  'Use the 30-day generator below to plan ahead in one go.',
  'Mix content types: tips, questions, and updates.',
];

export function QuickTips() {
  const scrollToGenerator = () => {
    document.getElementById('content-plan-generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card>
      <CardTitle className="mb-3">Quick tips</CardTitle>
      <ul className="mb-4 space-y-2 text-sm text-[var(--text-secondary)]">
        {TIPS.map((tip, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            {tip}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollToGenerator}
        className="w-full rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20"
      >
        Plan 30 days with AI
      </button>
    </Card>
  );
}
