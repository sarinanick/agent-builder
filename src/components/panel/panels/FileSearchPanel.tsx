'use client';

import type { FileSearchNodeData } from '@/types/nodes';

interface FileSearchPanelProps {
  data: FileSearchNodeData;
  onChange: (data: Partial<FileSearchNodeData>) => void;
}

export default function FileSearchPanel({ data, onChange }: FileSearchPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Vector Store ID</label>
        <input type="text" value={data.vectorStoreId || ''} onChange={(e) => onChange({ vectorStoreId: e.target.value })}
          placeholder="vs_xxxxxxxxxxxx"
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Top K: {data.topK || 5}</label>
        <input type="range" min="1" max="20" value={data.topK || 5} onChange={(e) => onChange({ topK: parseInt(e.target.value) })}
          className="w-full accent-foreground" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Score Threshold</label>
        <input type="number" min="0" max="1" step="0.05" value={data.scoreThreshold || 0.7}
          onChange={(e) => onChange({ scoreThreshold: parseFloat(e.target.value) })}
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
    </div>
  );
}
