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
    onChange({
      variables: [...variables, { name: '', value: '', scope: 'global' }],
    });
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
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Variables</label>
        <button
          onClick={addVariable}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {variables.map((v, i) => (
          <div key={i} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Variable {i + 1}</span>
              <button
                onClick={() => removeVariable(i)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={v.name}
              onChange={(e) => updateVariable(i, 'name', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
            <input
              type="text"
              placeholder="Value (e.g. {{output}})"
              value={v.value}
              onChange={(e) => updateVariable(i, 'value', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
            <select
              value={v.scope}
              onChange={(e) => updateVariable(i, 'scope', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="global">Global</option>
              <option value="local">Local</option>
            </select>
          </div>
        ))}
      </div>

      {variables.length === 0 && (
        <button
          onClick={addVariable}
          className="w-full py-3 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-sm text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-500 transition-colors"
        >
          + Add variable
        </button>
      )}
    </div>
  );
}
