'use client';

import type { FileSearchNodeData } from '@/types/nodes';

interface FileSearchPanelProps {
  data: FileSearchNodeData;
  onChange: (data: Partial<FileSearchNodeData>) => void;
}

export default function FileSearchPanel({ data, onChange }: FileSearchPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Vector Store ID</label>
        <input
          type="text"
          value={data.vectorStoreId || ''}
          onChange={(e) => onChange({ vectorStoreId: e.target.value })}
          placeholder="vs_xxxxxxxxxxxx"
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
          Top K: {data.topK || 5}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={data.topK || 5}
          onChange={(e) => onChange({ topK: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Score Threshold</label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.05"
          value={data.scoreThreshold || 0.7}
          onChange={(e) => onChange({ scoreThreshold: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>
  );
}
