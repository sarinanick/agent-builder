'use client';

import type { GuardrailsNodeData } from '@/types/nodes';

interface GuardrailsPanelProps {
  data: GuardrailsNodeData;
  onChange: (data: Partial<GuardrailsNodeData>) => void;
}

export default function GuardrailsPanel({ data, onChange }: GuardrailsPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Check Type</label>
        <div className="flex gap-2">
          {['input', 'output', 'both'].map((type) => (
            <button
              key={type}
              onClick={() => onChange({ checkType: type as 'input' | 'output' | 'both' })}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border capitalize transition-colors ${
                data.checkType === type
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Pattern (Regex)</label>
        <input
          type="text"
          value={data.pattern || ''}
          onChange={(e) => onChange({ pattern: e.target.value })}
          placeholder='(SSN|credit card|password)'
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>
  );
}
