'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Hand } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function HumanApprovalNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 min-w-[170px] cursor-pointer transition-all
        ${selected ? 'border-orange-400 shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/30' : 'border-orange-500/30'}
        bg-orange-500/10 dark:bg-orange-500/10`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-500/30"
      />
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white">
        <Hand className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
          {data.label as string}
        </span>
        <span className="text-xs text-orange-600/60 dark:text-orange-400/60">Human Approval</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-500/30"
      />
    </div>
  );
}
