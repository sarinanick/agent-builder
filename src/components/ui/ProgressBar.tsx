'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'var(--accent-primary)',
  success: 'var(--accent-success)',
  warning: 'var(--accent-warning)',
  danger: 'var(--accent-danger)',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs">
          {label && <span style={{ color: 'var(--text-secondary)' }}>{label}</span>}
          {showValue && <span style={{ color: 'var(--text-muted)' }}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-elevated)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, background: variantStyles[variant] }}
        />
      </div>
    </div>
  );
}
