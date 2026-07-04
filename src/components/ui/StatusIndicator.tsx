'use client';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig = {
  online: { color: 'var(--accent-success)', label: 'Online' },
  offline: { color: 'var(--text-muted)', label: 'Offline' },
  busy: { color: 'var(--accent-danger)', label: 'Busy' },
  away: { color: 'var(--accent-warning)', label: 'Away' },
};

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function StatusIndicator({ status, size = 'md', showLabel = false }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`${sizeClasses[size]} rounded-full`}
        style={{ background: config.color }}
        aria-label={config.label}
      />
      {showLabel && (
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {config.label}
        </span>
      )}
    </div>
  );
}
