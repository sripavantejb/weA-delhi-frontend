import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`border border-[var(--border)] bg-[var(--bg-card)] p-5 ${className}`}
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h2 className={`text-lg font-bold text-[var(--accent)] ${className}`}>
      {children}
    </h2>
  );
}
