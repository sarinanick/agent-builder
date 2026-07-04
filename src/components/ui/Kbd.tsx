'use client';

import type { ReactNode } from 'react';

interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({ children, className = '' }: KbdProps) {
  return (
    <kbd
      className={`
        inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded-md border
        ${className}
      `}
      style={{
        background: 'var(--surface-card)',
        color: 'var(--text-muted)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {children}
    </kbd>
  );
}
