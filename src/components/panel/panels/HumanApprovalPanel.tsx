'use client';

import type { HumanApprovalNodeData } from '@/types/nodes';

interface HumanApprovalPanelProps {
  data: HumanApprovalNodeData;
  onChange: (data: Partial<HumanApprovalNodeData>) => void;
}

export default function HumanApprovalPanel({ data, onChange }: HumanApprovalPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Instructions</label>
        <textarea
          value={data.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Please review the output before proceeding..."
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
          Timeout (seconds): {data.timeout || 300}
        </label>
        <input
          type="range"
          min="30"
          max="3600"
          step="30"
          value={data.timeout || 300}
          onChange={(e) => onChange({ timeout: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
