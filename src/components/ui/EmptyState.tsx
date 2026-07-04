'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4" style={{ color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {title || (lang === 'fa' ? 'چیزی یافت نشد' : 'Nothing found')}
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        {description || (lang === 'fa' ? 'نتیجه‌ای برای جستجوی شما پیدا نشد.' : 'No results match your search.')}
      </p>
      {action}
    </div>
  );
}
