'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onRemove?: () => void;
  className?: string;
}

const variantStyles = {
  default: 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
  success: 'bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)]/20',
  warning: 'bg-[var(--accent-warning)]/10 text-[var(--accent-warning)] border-[var(--accent-warning)]/20',
  danger: 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border-[var(--accent-danger)]/20',
  info: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
};

export function Chip({ children, variant = 'default', onRemove, className = '' }: ChipProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
