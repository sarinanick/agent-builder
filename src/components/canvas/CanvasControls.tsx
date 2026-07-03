'use client';

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const viewport = getViewport();
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl shadow-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
      <button onClick={() => zoomOut()} className="btn-ios btn-ios-ghost btn-ios-icon !w-7 !h-7" title="Zoom out">
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
      <span className="text-[11px] font-mono min-w-[36px] text-center select-none" style={{ color: 'var(--muted-foreground)' }}>
        {zoomPercent}%
      </span>
      <button onClick={() => zoomIn()} className="btn-ios btn-ios-ghost btn-ios-icon !w-7 !h-7" title="Zoom in">
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
      <button onClick={() => fitView({ padding: 0.3 })} className="btn-ios btn-ios-ghost btn-ios-icon !w-7 !h-7" title="Fit view">
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
