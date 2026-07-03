'use client';

import type { SetStateNodeData } from '@/types/nodes';
import { Plus, Trash2 } from 'lucide-react';

interface SetStatePanelProps {
  data: SetStateNodeData;
  onChange: (data: Partial<SetStateNodeData>) => void;
}

export default function SetStatePanel({ data, onChange }: SetStatePanelProps) {
  const variables = data.variables || [];

  const addVariable = () => {
    onChange({ variables: [...variables, { name: '', value: '', scope: 'global' }] });
  };

  const updateVariable = (index: number, field: string, value: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ variables: updated });
  };

  const removeVariable = (index: number) => {
    onChange({ variables: variables.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">Variables</label>
        <button onClick={addVariable} className="flex items-center gap-1 text-xs text-foreground hover:opacity-70 transition-opacity">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {variables.map((v, i) => (
          <div key={i} className="p-2.5 rounded-lg border border-border bg-background space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Variable {i + 1}</span>
              <button onClick={() => removeVariable(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <input type="text" placeholder="Name" value={v.name} onChange={(e) => updateVariable(i, 'name', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input type="text" placeholder="Value (e.g. {{output}})" value={v.value} onChange={(e) => updateVariable(i, 'value', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-input bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring" />
            <select value={v.scope} onChange={(e) => updateVariable(i, 'scope', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none">
              <option value="global">Global</option>
              <option value="local">Local</option>
            </select>
          </div>
        ))}
      </div>
      {variables.length === 0 && (
        <button onClick={addVariable} className="w-full py-3 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-colors">
          + Add variable
        </button>
      )}
    </div>
  );
}
