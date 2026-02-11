import { useState } from 'react';
import type { ContentPlanInputs } from '../types/content';

const GOALS = ['Followers', 'Leads', 'Sales', 'Branding'];
const DURATIONS = [7, 30, 90];
const PLATFORM_OPTIONS = ['Instagram', 'LinkedIn', 'Twitter', 'YouTube'];
const NICHES = [
  'Tech',
  'Education',
  'Startup',
  'Personal Brand',
  'Health & Fitness',
  'Food & Cooking',
  'Travel',
  'Finance',
  'Fashion & Beauty',
  'Marketing',
  'E-commerce',
  'Photography',
  'Music',
  'Gaming',
  'Lifestyle',
  'Art & Design',
  'Other',
];

function toDateString(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function IconCheck() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

interface ContentPlanFormProps {
  onSubmit: (inputs: ContentPlanInputs) => void;
  loading: boolean;
  error: string | null;
}

export function ContentPlanForm({ onSubmit, loading, error }: ContentPlanFormProps) {
  const [goal, setGoal] = useState('Branding');
  const [duration, setDuration] = useState(30);
  const [platforms, setPlatforms] = useState<string[]>(['Instagram', 'LinkedIn']);
  const [niche, setNiche] = useState('Tech');
  const [nicheOther, setNicheOther] = useState('');
  const [startDate, setStartDate] = useState(() => toDateString(new Date()));

  const togglePlatform = (p: string) => {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nicheValue = niche === 'Other' ? nicheOther.trim() || 'General' : niche;
    onSubmit({
      goal,
      duration,
      platforms: platforms.length ? platforms : ['Instagram'],
      niche: nicheValue,
      startDate,
    });
  };

  const labelClass = 'mb-2 block text-sm font-medium text-[var(--text-secondary)]';
  const inputClass =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-3 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputClass}>
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Duration (days)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={inputClass}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Start date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Platforms</label>
        <p className="mb-3 text-xs text-[var(--text-muted)]">Select one or more platforms for your content plan.</p>
        <div className="flex flex-wrap gap-3">
          {PLATFORM_OPTIONS.map((p) => {
            const selected = platforms.includes(p);
            return (
              <label
                key={p}
                className={`flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg-black)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:bg-white/5'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => togglePlatform(p)}
                  className="sr-only"
                />
                {selected ? <IconCheck /> : <span className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--bg-dark)]" />}
                <span>{p}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div>
        <label className={labelClass}>Niche</label>
        <select value={niche} onChange={(e) => setNiche(e.target.value)} className={inputClass}>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {niche === 'Other' && (
          <input
            type="text"
            value={nicheOther}
            onChange={(e) => setNicheOther(e.target.value)}
            placeholder="Describe your niche"
            className={`mt-3 ${inputClass}`}
          />
        )}
      </div>
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--bg-black)] hover:bg-[var(--accent-hover)] disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
        >
          {loading ? 'Generating plan…' : 'Generate plan'}
        </button>
      </div>
    </form>
  );
}
