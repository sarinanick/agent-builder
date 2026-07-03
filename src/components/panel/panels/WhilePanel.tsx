'use client';

import type { WhileNodeData } from '@/types/nodes';

interface WhilePanelProps {
  data: WhileNodeData;
  onChange: (data: Partial<WhileNodeData>) => void;
}

export default function WhilePanel({ data, onChange }: WhilePanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Condition</label>
        <textarea
          value={data.condition || ''}
          onChange={(e) => onChange({ condition: e.target.value })}
          placeholder='output.status != "complete"'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Max Iterations</label>
        <input
          type="number"
          min="1"
          max="100"
          value={data.maxIterations || 10}
          onChange={(e) => onChange({ maxIterations: parseInt(e.target.value) || 10 })}
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}
