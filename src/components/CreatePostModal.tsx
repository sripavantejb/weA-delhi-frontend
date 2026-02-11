import { useState, useCallback, useEffect } from 'react';
import { polishCaption } from '../api/client';
import type { PostType, Platform, CreatePostForm } from '../types/content';
import type { Post } from '../types/content';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string; // YYYY-MM-DD
  initialPost?: Post | null;
  onSave: (form: CreatePostForm) => void;
  onUpdate?: (id: string, form: CreatePostForm) => void | Promise<void>;
}

const POST_TYPES: PostType[] = ['Text', 'Image', 'Video'];
const PLATFORMS: { key: Platform; label: string }[] = [
  { key: 'Twitter', label: 'X (Twitter)' },
  { key: 'LinkedIn', label: 'LinkedIn' },
  { key: 'Instagram', label: 'Instagram' },
];

function toDateString(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function formatScheduledDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const inputClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]';
const labelClass = 'mb-1 block text-sm font-medium text-[var(--text-secondary)]';

const pillBase = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors';
const pillSelected = 'bg-[var(--accent)] text-[var(--bg-black)]';
const pillUnselected = 'border border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/5';

function IconText() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconImage() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
function IconPencil() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg className="h-8 w-8 shrink-0 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

export function CreatePostModal({
  isOpen,
  onClose,
  initialDate,
  initialPost,
  onSave,
  onUpdate,
}: CreatePostModalProps) {
  const today = toDateString(new Date());
  const [type, setType] = useState<PostType>('Text');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(initialDate ?? today);
  const [time, setTime] = useState('09:00');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [aiMode, setAiMode] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const defaultDate = initialDate ?? toDateString(new Date());
      if (initialPost) {
        setType(initialPost.type);
        setCaption(initialPost.caption ?? '');
        setDate(initialPost.date ?? defaultDate);
        setTime(initialPost.time ?? '09:00');
        setPlatforms(Array.isArray(initialPost.platforms) ? initialPost.platforms : []);
      } else {
        setType('Text');
        setCaption('');
        setDate(defaultDate);
        setTime('09:00');
        setPlatforms([]);
      }
      setAiMode(false);
      setAiDescription('');
      setAiError(null);
    }
  }, [isOpen, initialDate, initialPost]);

  const handlePolishWithAi = useCallback(async () => {
    if (aiDescription.trim().length < 5 || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const { caption: polished } = await polishCaption(aiDescription.trim());
      setCaption(polished);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI caption is not available right now.';
      setAiError(msg === 'Not found' ? 'AI service not found. Is the backend running on port 3000?' : msg);
    } finally {
      setAiLoading(false);
    }
  }, [aiDescription, aiLoading]);

  const handleGenerateVariations = useCallback(async () => {
    if (caption.trim().length >= 5 && !aiLoading) {
      setAiLoading(true);
      setAiError(null);
      try {
        const { caption: polished } = await polishCaption(caption.trim());
        setCaption(polished);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'AI caption is not available right now.';
        setAiError(msg === 'Not found' ? 'AI service not found. Is the backend running on port 3000?' : msg);
      } finally {
        setAiLoading(false);
      }
    } else {
      setAiError('Write a few words in the caption first, or use AI Generate Full Post.');
    }
  }, [caption, aiLoading]);

  const togglePlatform = useCallback((p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = { type, caption, date, time, platforms };
    if (initialPost && onUpdate) {
      await onUpdate(initialPost.id, form);
    } else {
      onSave(form);
    }
    setCaption('');
    setAiDescription('');
    setAiError(null);
    setPlatforms([]);
    setDate(today);
    setTime('09:00');
    setType('Text');
    setAiMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xl" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              {initialPost ? 'Edit Post' : 'Create Post'}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Scheduled for {formatScheduledDate(date)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className={labelClass}>Post type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`${pillBase} ${type === t ? pillSelected : pillUnselected}`}
                >
                  {t === 'Text' && <IconText />}
                  {t === 'Image' && <IconImage />}
                  {t === 'Video' && <IconVideo />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={labelClass}>Mode</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAiMode(false)}
                className={`${pillBase} ${!aiMode ? pillSelected : pillUnselected}`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setAiMode(true)}
                className={`${pillBase} ${aiMode ? pillSelected : pillUnselected}`}
              >
                <IconSparkle />
                AI Generate Full Post
              </button>
            </div>
          </div>

          {aiMode && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)]/50 p-3">
              <p className="mb-2 text-sm font-medium text-[var(--text-secondary)]">
                Describe your post in ~20 words
              </p>
              <input
                type="text"
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="e.g. Product launch, tech, excited tone"
                className={inputClass}
                disabled={aiLoading}
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePolishWithAi}
                  disabled={aiDescription.trim().length < 5 || aiLoading}
                  className="rounded-full bg-[var(--accent)]/20 px-3 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/30 disabled:opacity-50"
                >
                  {aiLoading ? 'Generating…' : 'Polish with AI'}
                </button>
                {aiError && (
                  <span className="text-xs text-red-400">{aiError}</span>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className={labelClass + ' mb-0'}>Caption</label>
              <button
                type="button"
                onClick={handleGenerateVariations}
                disabled={aiLoading}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
              >
                <IconPencil />
                Generate Variations
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Write your caption..."
            />
            {!aiMode && aiError && (
              <p className="mt-1 text-xs text-red-400">{aiError}</p>
            )}
          </div>

          {type === 'Image' && (
            <div>
              <p className={labelClass}>Upload image</p>
              <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--bg-dark)]/50 py-10 text-center">
                <IconUpload />
                <p className="mt-2 text-sm text-[var(--text-muted)]">Click to upload image</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
              Publish To
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    platforms.includes(key)
                      ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--text-primary)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={platforms.includes(key)}
                    onChange={() => togglePlatform(key)}
                    className="h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-dark)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-dark)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-black)] hover:bg-[var(--accent-hover)]"
            >
              {initialPost ? 'Update' : 'Schedule Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
