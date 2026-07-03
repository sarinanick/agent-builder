'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode, useId } from 'react';

// Audit item #33: Shared form field components with labels

interface FieldWrapperProps {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function FieldWrapper({ label, error, description, required, children, htmlFor }: FieldWrapperProps) {
  const id = useId();
  const fieldId = htmlFor || id;
  const errorId = `${fieldId}-error`;
  const descId = `${fieldId}-desc`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="text-xs font-medium text-[var(--text-secondary)]"
      >
        {label}
        {required && <span className="text-[var(--accent-danger)] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-xs text-[var(--accent-danger)]" role="alert">
          {error}
        </p>
      )}
      {description && !error && (
        <p id={descId} className="text-xs text-[var(--text-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full h-9 px-3 text-sm rounded-[var(--radius-lg)]
          bg-[var(--surface-card)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/50' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);
FieldInput.displayName = 'FieldInput';

interface FieldTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FieldTextarea = forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-3 py-2 text-sm rounded-[var(--radius-lg)]
          bg-[var(--surface-card)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]
          disabled:cursor-not-allowed disabled:opacity-50 resize-none
          ${error ? 'border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/50' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);
FieldTextarea.displayName = 'FieldTextarea';

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

export const FieldSelect = forwardRef<HTMLSelectElement, FieldSelectProps>(
  ({ error, options, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={`
          w-full h-9 px-3 text-sm rounded-[var(--radius-lg)]
          bg-[var(--surface-card)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/50' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
FieldSelect.displayName = 'FieldSelect';

interface FieldRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  error?: string;
}

export function FieldRange({ label, value, min, max, step = 1, onChange, error }: FieldRangeProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </label>
        <span className="text-xs font-mono text-[var(--text-muted)]">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-invalid={!!error}
        className="w-full h-1.5 rounded-full bg-[var(--surface-elevated)] accent-[var(--accent-primary)]"
      />
    </div>
  );
}

interface FieldSegmentedProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function FieldSegmented({ label, value, options, onChange }: FieldSegmentedProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--surface-card)]">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)]
              transition-all duration-[var(--transition-fast)]
              ${value === opt.value
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
