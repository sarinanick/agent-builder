'use client';

import type { TransformNodeData } from '@/types/nodes';

interface TransformPanelProps {
  data: TransformNodeData;
  onChange: (data: Partial<TransformNodeData>) => void;
}

export default function TransformPanel({ data, onChange }: TransformPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Input Schema</label>
        <textarea
          value={data.inputSchema || ''}
          onChange={(e) => onChange({ inputSchema: e.target.value })}
          placeholder='{ "text": "string" }'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Output Schema</label>
        <textarea
          value={data.outputSchema || ''}
          onChange={(e) => onChange({ outputSchema: e.target.value })}
          placeholder='{ "result": "string" }'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Transform Code</label>
        <textarea
          value={data.transformCode || ''}
          onChange={(e) => onChange({ transformCode: e.target.value })}
          placeholder="return { result: input.text.toUpperCase() }"
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>
    </div>
  );
}
