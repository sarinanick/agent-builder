'use client';

import type { ConditionNodeData } from '@/types/nodes';

interface ConditionPanelProps {
  data: ConditionNodeData;
  onChange: (data: Partial<ConditionNodeData>) => void;
}

export default function ConditionPanel({ data, onChange }: ConditionPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Expression (CEL)</label>
        <textarea
          value={data.expression || ''}
          onChange={(e) => onChange({ expression: e.target.value })}
          placeholder='input.category == "qa"'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">True Branch</label>
        <input
          type="text"
          value={data.trueLabel || 'True'}
          onChange={(e) => onChange({ trueLabel: e.target.value })}
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">False Branch</label>
        <input
          type="text"
          value={data.falseLabel || 'False'}
          onChange={(e) => onChange({ falseLabel: e.target.value })}
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}
