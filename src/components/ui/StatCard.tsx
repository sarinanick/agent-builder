'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({ label, value, icon, trend, trendValue }: StatCardProps) {
  const trendColors = {
    up: 'var(--accent-success)',
    down: 'var(--accent-danger)',
    neutral: 'var(--text-muted)',
  };

  return (
    <div
      className="p-4 rounded-xl border transition-all hover:shadow-lg"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-card)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
        {icon && <span style={{ color: 'var(--text-muted)' }}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
        {trend && trendValue && (
          <span className="text-xs font-medium" style={{ color: trendColors[trend] }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
