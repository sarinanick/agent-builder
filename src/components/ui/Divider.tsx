'use client';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{
        background: 'var(--border-subtle)',
        ...(orientation === 'horizontal'
          ? { height: '1px', width: '100%' }
          : { width: '1px', height: '100%' }),
      }}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
