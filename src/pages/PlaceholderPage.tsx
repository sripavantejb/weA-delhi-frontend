interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description = 'Coming soon' }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
