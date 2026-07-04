'use client';

import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'purple' | 'blue' | 'green' | 'orange' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-[var(--surface-card)] text-[var(--text-secondary)]',
  purple: 'bg-purple-500/10 text-purple-400',
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-green-500/10 text-green-400',
  orange: 'bg-orange-500/10 text-orange-400',
  red: 'bg-red-500/10 text-red-400',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
};

export function Tag({ children, variant = 'default', size = 'sm', className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-md
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
