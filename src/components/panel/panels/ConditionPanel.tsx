'use client';

import type { ConditionNodeData } from '@/types/nodes';

interface ConditionPanelProps {
  data: ConditionNodeData;
  onChange: (data: Partial<ConditionNodeData>) => void;
}

export default function ConditionPanel({ data, onChange }: ConditionPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Expression (CEL)</label>
        <textarea
          value={data.expression || ''}
          onChange={(e) => onChange({ expression: e.target.value })}
          placeholder='input.output_parsed.category == "qa"'
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">True Branch Label</label>
        <input
          type="text"
          value={data.trueLabel || 'True'}
          onChange={(e) => onChange({ trueLabel: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">False Branch Label</label>
        <input
          type="text"
          value={data.falseLabel || 'False'}
          onChange={(e) => onChange({ falseLabel: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>
  );
}
