'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function ConditionNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const trueLabel = (data.trueLabel as string) || 'True';
  const falseLabel = (data.falseLabel as string) || 'False';

  return (
    <div
      className={`flex flex-col rounded-lg border min-w-[180px] cursor-pointer transition-all
        ${selected ? 'border-orange-400 shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/30' : 'border-orange-500/30'}
        bg-orange-500/10 dark:bg-orange-500/10`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-500/30"
      />
      <div className="flex items-center gap-2 px-4 py-2 border-b border-orange-500/20">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white">
          <GitBranch className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
          {data.label as string}
        </span>
      </div>
      <div className="px-4 py-2 text-xs text-orange-600/70 dark:text-orange-400/70">
        {data.expression ? String(data.expression).substring(0, 40) + (String(data.expression).length > 40 ? '...' : '') : 'Enter expression...'}
      </div>
      <div className="flex border-t border-orange-500/20">
        <div className="flex-1 px-4 py-1 text-xs text-center text-orange-600 dark:text-orange-400 border-r border-orange-500/20">
          {trueLabel}
        </div>
        <div className="flex-1 px-4 py-1 text-xs text-center text-orange-600 dark:text-orange-400">
          {falseLabel}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '40%' }}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-green-500/30"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '70%' }}
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-red-500/30"
      />
    </div>
  );
}
