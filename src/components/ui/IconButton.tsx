'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'filled';
  tooltip?: string;
}

const sizeStyles = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const variantStyles = {
  ghost: 'bg-transparent hover:bg-[var(--surface-card)]',
  outline: 'bg-transparent border border-[var(--border-subtle)] hover:bg-[var(--surface-card)]',
  filled: 'bg-[var(--surface-card)] hover:bg-[var(--surface-elevated)]',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', tooltip, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg
          transition-colors
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        style={{ color: 'var(--text-secondary)' }}
        title={tooltip}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
