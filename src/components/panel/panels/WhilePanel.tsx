'use client';

import type { WhileNodeData } from '@/types/nodes';

interface WhilePanelProps {
  data: WhileNodeData;
  onChange: (data: Partial<WhileNodeData>) => void;
}

export default function WhilePanel({ data, onChange }: WhilePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Condition</label>
        <textarea
          value={data.condition || ''}
          onChange={(e) => onChange({ condition: e.target.value })}
          placeholder='output.status != "complete"'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Max Iterations</label>
        <input
          type="number"
          min="1"
          max="100"
          value={data.maxIterations || 10}
          onChange={(e) => onChange({ maxIterations: parseInt(e.target.value) || 10 })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>
  );
}
