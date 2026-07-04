'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
            {props.required && <span className="text-[var(--accent-danger)] ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full h-9 px-3 text-sm rounded-lg border
            ${error ? 'border-[var(--accent-danger)]' : 'border-[var(--border-subtle)]'}
            bg-[var(--surface-card)] text-[var(--text-primary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs" style={{ color: 'var(--accent-danger)' }} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
