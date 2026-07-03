'use client';

import type { GuardrailsNodeData } from '@/types/nodes';

interface GuardrailsPanelProps {
  data: GuardrailsNodeData;
  onChange: (data: Partial<GuardrailsNodeData>) => void;
}

export default function GuardrailsPanel({ data, onChange }: GuardrailsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Check Type</label>
        <div className="flex gap-2">
          {['input', 'output', 'both'].map((type) => (
            <button key={type} onClick={() => onChange({ checkType: type as 'input' | 'output' | 'both' })}
              className={`flex-1 px-3 py-1.5 text-xs rounded-md border capitalize transition-colors ${
                data.checkType === type
                  ? 'bg-foreground/10 border-foreground/20 text-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-foreground/20'
              }`}>{type}</button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Pattern (Regex)</label>
        <input type="text" value={data.pattern || ''} onChange={(e) => onChange({ pattern: e.target.value })}
          placeholder='(SSN|credit card|password)'
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
    </div>
  );
}
