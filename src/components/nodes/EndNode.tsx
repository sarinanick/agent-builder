'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Square } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function EndNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 min-w-[140px] cursor-pointer transition-all
        ${selected ? 'border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30' : 'border-emerald-500/30'}
        bg-emerald-500/10 dark:bg-emerald-500/10`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-500/30"
      />
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white">
        <Square className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {data.label as string}
        </span>
        {typeof data.description === 'string' && data.description.length > 0 && (
          <span className="text-xs text-emerald-600/60 dark:text-emerald-400/60">
            {data.description}
          </span>
        )}
      </div>
    </div>
  );
}
