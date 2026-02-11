import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SEARCH_ITEMS = [
  { path: '/', label: 'Dashboard', category: 'Tools', icon: 'grid' },
  { path: '/email', label: 'Email Sender', category: 'Tools', icon: 'envelope' },
  { path: '/invoicing', label: 'Invoicing', category: 'Tools', icon: 'document' },
  { path: '/appointments', label: 'Appointments', category: 'Tools', icon: 'calendar' },
  { path: '/call-agent', label: 'Call Agent', category: 'Tools', icon: 'phone' },
  { path: '/video-creator', label: 'Video Creator', category: 'Tools', icon: 'video' },
  { path: '/settings', label: 'Settings', category: 'Tools', icon: 'cog' },
  { path: '/help', label: 'Help', category: 'Tools', icon: 'help' },
  { label: 'Files', category: 'Files', icon: 'file', path: null },
  { label: 'Books', category: 'Books', icon: 'book', path: null },
] as const;

function SearchIcon({ focused }: { focused: boolean }) {
  return (
    <svg
      className={`shrink-0 w-4 h-4 transition-transform duration-300 ${focused ? 'scale-110 text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (path: string | null) => {
    if (path) {
      navigate(path);
      setQuery('');
      setShowDropdown(false);
      setFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative px-3 py-2">
      <div
        className={`flex items-center gap-2 rounded-lg border bg-[var(--bg-dark)] px-3 py-2 transition-all duration-200 ${
          focused ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/30' : 'border-[var(--border)]'
        }`}
      >
        <SearchIcon focused={focused} />
        <input
          type="search"
          placeholder="Search tools, files, books..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setFocused(true);
            setShowDropdown(true);
          }}
          className="flex-1 min-w-0 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
          aria-label="Search"
        />
      </div>

      {showDropdown && (query.trim() || focused) && (
        <div
          className="absolute left-3 right-3 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-1 shadow-lg animate-fade-in"
          role="listbox"
        >
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={`${item.category}-${item.label}`}
                type="button"
                role="option"
                onClick={() => handleSelect(item.path)}
                disabled={!item.path}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  item.path
                    ? 'text-[var(--text-primary)] hover:bg-[var(--accent)]/15 hover:text-[var(--accent)] cursor-pointer'
                    : 'text-[var(--text-muted)] cursor-default'
                }`}
              >
                <span className="text-[var(--text-muted)] text-xs w-12 shrink-0">{item.category}</span>
                {item.label}
                {!item.path && <span className="ml-auto text-xs">Coming soon</span>}
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-sm text-[var(--text-muted)]">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
