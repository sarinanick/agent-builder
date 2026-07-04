'use client';

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, Lock, Unlock, Grid3X3, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

// Audit item #101: Complete canvas controls
export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const viewport = getViewport();
  const zoomPercent = Math.round(viewport.zoom * 100);
  const [isLocked, setIsLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const { lang } = useI18n();

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl shadow-lg"
      style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)' }}
      role="toolbar"
      aria-label={lang === 'fa' ? 'ابزارهای canvas' : 'Canvas controls'}
    >
      {/* Zoom controls */}
      <button
        onClick={() => zoomOut()}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
        title={lang === 'fa' ? 'کوچک‌نمایی' : 'Zoom out'}
        aria-label={lang === 'fa' ? 'کوچک‌نمایی' : 'Zoom out'}
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>

      <span className="text-[11px] font-mono min-w-[36px] text-center select-none" style={{ color: 'var(--text-muted)' }}>
        {zoomPercent}%
      </span>

      <button
        onClick={() => zoomIn()}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
        title={lang === 'fa' ? 'بزرگ‌نمایی' : 'Zoom in'}
        aria-label={lang === 'fa' ? 'بزرگ‌نمایی' : 'Zoom in'}
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>

      <div className="w-px h-4 mx-1" style={{ background: 'var(--border-subtle)' }} />

      {/* Fit view */}
      <button
        onClick={() => fitView({ padding: 0.3 })}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
        title={lang === 'fa' ? 'تنظیم نما' : 'Fit view'}
        aria-label={lang === 'fa' ? 'تنظیم نما' : 'Fit view'}
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      {/* Lock canvas */}
      <button
        onClick={() => setIsLocked(!isLocked)}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          isLocked
            ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
        }`}
        title={isLocked ? (lang === 'fa' ? 'بازکردن قفل' : 'Unlock canvas') : (lang === 'fa' ? 'قفل کردن' : 'Lock canvas')}
        aria-label={isLocked ? (lang === 'fa' ? 'بازکردن قفل' : 'Unlock canvas') : (lang === 'fa' ? 'قفل کردن' : 'Lock canvas')}
        aria-pressed={isLocked}
      >
        {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
      </button>

      {/* Grid toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          showGrid
            ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
        }`}
        title={lang === 'fa' ? 'شبکه' : 'Grid'}
        aria-label={lang === 'fa' ? 'شبکه' : 'Grid'}
        aria-pressed={showGrid}
      >
        <Grid3X3 className="h-3.5 w-3.5" />
      </button>

      {/* Help */}
      <button
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
        title={lang === 'fa' ? 'راهنما' : 'Help'}
        aria-label={lang === 'fa' ? 'راهنما' : 'Help'}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
