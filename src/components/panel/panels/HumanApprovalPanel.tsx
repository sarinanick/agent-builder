'use client';

import type { HumanApprovalNodeData } from '@/types/nodes';

interface HumanApprovalPanelProps {
  data: HumanApprovalNodeData;
  onChange: (data: Partial<HumanApprovalNodeData>) => void;
}

export default function HumanApprovalPanel({ data, onChange }: HumanApprovalPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Instructions</label>
        <textarea value={data.instructions || ''} onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Please review the output before proceeding..." rows={4}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Timeout (seconds): {data.timeout || 300}</label>
        <input type="range" min="30" max="3600" step="30" value={data.timeout || 300}
          onChange={(e) => onChange({ timeout: parseInt(e.target.value) })}
          className="w-full accent-foreground" />
      </div>
    </div>
  );
}
