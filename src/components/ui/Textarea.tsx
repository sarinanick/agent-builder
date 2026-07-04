'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
            {props.required && <span className="text-[var(--accent-danger)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm rounded-lg border resize-none
            ${error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-subtle)]'}
            bg-[var(--surface-card)] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: 'var(--accent-danger)' }} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
