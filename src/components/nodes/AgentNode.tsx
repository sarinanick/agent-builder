'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Bot } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function AgentNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 min-w-[160px] cursor-pointer transition-all
        ${selected ? 'border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/30' : 'border-purple-500/30'}
        bg-purple-500/10 dark:bg-purple-500/10`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-500/30"
      />
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
          {data.label as string}
        </span>
        <span className="text-xs text-purple-600/60 dark:text-purple-400/60">Agent</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-500/30"
      />
    </div>
  );
}
