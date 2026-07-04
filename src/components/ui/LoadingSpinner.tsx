'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      style={{ color: 'var(--accent-primary)' }}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'oklch(0% 0 0 / 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="flex flex-col items-center gap-3 p-6 rounded-xl" style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)' }}>
        <LoadingSpinner size="lg" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    </div>
  );
}
