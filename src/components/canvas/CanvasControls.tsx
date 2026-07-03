'use client';

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const viewport = getViewport();
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-card border border-border shadow-lg">
      <button
        onClick={() => zoomIn()}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>

      <span className="text-[11px] text-muted-foreground font-mono min-w-[36px] text-center select-none">
        {zoomPercent}%
      </span>

      <button
        onClick={() => zoomOut()}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>

      <div className="w-px h-4 bg-border mx-0.5" />

      <button
        onClick={() => fitView({ padding: 0.3 })}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Fit view"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
