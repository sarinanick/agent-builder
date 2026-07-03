'use client';

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, Hand } from 'lucide-react';

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const viewport = getViewport();
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-lg">
      <button
        onClick={() => zoomIn()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono min-w-[40px] text-center">
        {zoomPercent}%
      </span>

      <button
        onClick={() => zoomOut()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

      <button
        onClick={() => fitView({ padding: 0.2 })}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        title="Fit view"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
