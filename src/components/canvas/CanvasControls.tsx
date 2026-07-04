'use client';

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, Lock, Unlock, Grid3X3, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const viewport = getViewport();
  const zoomPercent = Math.round(viewport.zoom * 100);
  const [isLocked, setIsLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const { lang } = useI18n();

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 rounded-2xl panel-glass"
      role="toolbar"
      aria-label={lang === 'fa' ? 'ابزارهای canvas' : 'Canvas controls'}
    >
      <button onClick={() => zoomOut()} className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
        title={lang === 'fa' ? 'کوچک‌نمایی' : 'Zoom out'}
        aria-label={lang === 'fa' ? 'کوچک‌نمایی' : 'Zoom out'}>
        <ZoomOut className="h-3.5 w-3.5" />
      </button>

      <span className="text-[11px] font-mono min-w-[40px] text-center select-none px-1"
        style={{ color: 'var(--text-on-shell-muted)' }}>
        {zoomPercent}%
      </span>

      <button onClick={() => zoomIn()} className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
        title={lang === 'fa' ? 'بزرگ‌نمایی' : 'Zoom in'}
        aria-label={lang === 'fa' ? 'بزرگ‌نمایی' : 'Zoom in'}>
        <ZoomIn className="h-3.5 w-3.5" />
      </button>

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border-shell)' }} />

      <button onClick={() => fitView({ padding: 0.3 })} className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
        title={lang === 'fa' ? 'تنظیم نما' : 'Fit view'}
        aria-label={lang === 'fa' ? 'تنظیم نما' : 'Fit view'}>
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      <button onClick={() => setIsLocked(!isLocked)}
        className={`btn-3d btn-3d-icon !w-8 !h-8 !p-0 ${isLocked ? 'btn-3d-primary' : 'btn-3d-secondary'}`}
        title={isLocked ? (lang === 'fa' ? 'بازکردن قفل' : 'Unlock') : (lang === 'fa' ? 'قفل کردن' : 'Lock')}
        aria-label={isLocked ? (lang === 'fa' ? 'بازکردن قفل' : 'Unlock canvas') : (lang === 'fa' ? 'قفل کردن' : 'Lock canvas')}
        aria-pressed={isLocked}>
        {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
      </button>

      <button onClick={() => setShowGrid(!showGrid)}
        className={`btn-3d btn-3d-icon !w-8 !h-8 !p-0 ${showGrid ? 'btn-3d-primary' : 'btn-3d-secondary'}`}
        title={lang === 'fa' ? 'شبکه' : 'Grid'}
        aria-label={lang === 'fa' ? 'شبکه' : 'Grid'}
        aria-pressed={showGrid}>
        <Grid3X3 className="h-3.5 w-3.5" />
      </button>

      <button className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
        title={lang === 'fa' ? 'راهنما' : 'Help'}
        aria-label={lang === 'fa' ? 'راهنما' : 'Help'}>
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
