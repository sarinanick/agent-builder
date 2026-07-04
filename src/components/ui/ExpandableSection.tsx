'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ExpandableSection({ title, children, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg" style={{ borderColor: 'var(--border-subtle)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-card)]"
        style={{ color: 'var(--text-primary)' }}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
