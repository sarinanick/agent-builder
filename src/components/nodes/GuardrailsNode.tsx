'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Shield } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function GuardrailsNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 min-w-[160px] cursor-pointer transition-all
        ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-400/30' : 'border-yellow-500/30'}
        bg-yellow-500/10 dark:bg-yellow-500/10`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-500/30"
      />
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white">
        <Shield className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
          {data.label as string}
        </span>
        <span className="text-xs text-yellow-600/60 dark:text-yellow-400/60">Guardrails</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-500/30"
      />
    </div>
  );
}
