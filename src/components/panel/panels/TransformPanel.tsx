'use client';

import type { TransformNodeData } from '@/types/nodes';

interface TransformPanelProps {
  data: TransformNodeData;
  onChange: (data: Partial<TransformNodeData>) => void;
}

export default function TransformPanel({ data, onChange }: TransformPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Input Schema</label>
        <textarea
          value={data.inputSchema || ''}
          onChange={(e) => onChange({ inputSchema: e.target.value })}
          placeholder='{ "text": "string" }'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Output Schema</label>
        <textarea
          value={data.outputSchema || ''}
          onChange={(e) => onChange({ outputSchema: e.target.value })}
          placeholder='{ "result": "string" }'
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Transform Code</label>
        <textarea
          value={data.transformCode || ''}
          onChange={(e) => onChange({ transformCode: e.target.value })}
          placeholder="return { result: input.text.toUpperCase() }"
          rows={5}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>
    </div>
  );
}
