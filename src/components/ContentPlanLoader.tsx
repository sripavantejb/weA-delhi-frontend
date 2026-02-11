export function ContentPlanLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <style>{`
        @keyframes content-plan-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes content-plan-dots {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
        .content-plan-spinner {
          animation: content-plan-spin 0.9s linear infinite;
        }
        .content-plan-dot {
          animation: content-plan-dots 1.4s ease-in-out infinite both;
        }
        .content-plan-dot:nth-child(2) { animation-delay: 0.2s; }
        .content-plan-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div
        className="content-plan-spinner mb-8 h-12 w-12 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
        aria-hidden
      />
      <p className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
        Curating your content ideas
        <span className="inline-flex content-plan-dot ml-0.5">.</span>
        <span className="content-plan-dot">.</span>
        <span className="content-plan-dot">.</span>
      </p>
      <p className="text-sm text-[var(--text-muted)]">This may take a moment</p>
    </div>
  );
}
