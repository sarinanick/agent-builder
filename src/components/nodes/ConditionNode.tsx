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
      className={`flex flex-col rounded-xl border min-w-[170px] cursor-pointer transition-all
        ${selected ? 'border-foreground/30 shadow-lg ring-1 ring-foreground/10' : 'border-border hover:border-foreground/20'}
        bg-card`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-muted-foreground !border-2 !border-card"
      />
      <div className="flex items-center gap-2 px-3.5 py-2 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/15 text-orange-500">
          <GitBranch className="h-3 w-3" />
        </div>
        <span className="text-[13px] font-medium text-foreground">
          {data.label as string}
        </span>
      </div>
      <div className="px-3.5 py-2 text-[11px] text-muted-foreground font-mono">
        {data.expression ? String(data.expression).substring(0, 35) + (String(data.expression).length > 35 ? '...' : '') : 'condition...'}
      </div>
      <div className="flex border-t border-border">
        <div className="flex-1 px-3 py-1.5 text-[11px] text-center text-muted-foreground border-r border-border">
          {trueLabel}
        </div>
        <div className="flex-1 px-3 py-1.5 text-[11px] text-center text-muted-foreground">
          {falseLabel}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '40%' }}
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-card"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '70%' }}
        className="!w-2 !h-2 !bg-red-500 !border-2 !border-card"
      />
    </div>
  );
}
