import { useMemo } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onAddPost: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  datesWithPosts: Set<string>; // "YYYY-MM-DD"
}

function toDateKey(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(d: Date): boolean {
  const t = new Date();
  return isSameDay(d, t);
}

export function Calendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onAddPost,
  onPrevMonth,
  onNextMonth,
  onToday,
  datesWithPosts,
}: CalendarProps) {
  const { firstDay, daysInMonth, startPadding } = useMemo(() => {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startPadding = first.getDay();
    return { firstDay: first, daysInMonth, startPadding };
  }, [year, month]);

  const cells = useMemo(() => {
    const list: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < startPadding; i++) {
      const d = new Date(year, month, 1 - (startPadding - i));
      list.push({ date: d, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      list.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    const remainder = list.length % 7;
    const pad = remainder === 0 ? 0 : 7 - remainder;
    for (let i = 0; i < pad; i++) {
      list.push({ date: new Date(year, month, daysInMonth + i + 1), isCurrentMonth: false });
    }
    return list;
  }, [year, month, daysInMonth, startPadding]);

  const monthName = firstDay.toLocaleString('default', { month: 'long' });

  return (
    <div
      className="border border-[var(--border)] bg-[var(--bg-card)] p-5"
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-black)]"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-black)]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-black)]"
          >
            &rarr;
          </button>
        </div>
        <h3 className="text-center text-lg font-semibold text-[var(--text-primary)]">
          {monthName} {year}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {DAYS.map((day) => (
          <div key={day} className="py-1 font-medium text-[var(--text-muted)]">
            {day}
          </div>
        ))}
        {cells.map(({ date, isCurrentMonth }, idx) => {
          const key = toDateKey(date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const today = isCurrentMonth && isToday(date);
          const hasPosts = datesWithPosts.has(key);

          return (
            <div
              key={idx}
              className={`relative flex min-h-[44px] flex-col items-center justify-center rounded-lg border transition-colors ${
                !isCurrentMonth ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
              } ${selected ? 'border-[var(--accent)] bg-[var(--accent)]/20' : today ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-transparent hover:bg-white/5'}`}
            >
              <button
                type="button"
                onClick={() => onSelectDate(date)}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-lg"
                aria-label={`Select ${key}`}
              />
              <span className={today ? 'font-semibold text-[var(--accent)]' : ''}>
                {date.getDate()}
              </span>
              {hasPosts && (
                <span className="mt-0.5 h-1 w-6 rounded-full bg-[var(--accent)]" />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddPost(date);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[var(--bg-black)]"
                aria-label={`Add post on ${key}`}
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
