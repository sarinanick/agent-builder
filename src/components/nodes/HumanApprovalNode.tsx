'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Hand } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function HumanApprovalNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 min-w-[155px] cursor-pointer transition-all
        ${selected ? 'border-foreground/30 shadow-lg ring-1 ring-foreground/10' : 'border-border hover:border-foreground/20'}
        bg-card`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-muted-foreground !border-2 !border-card"
      />
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500">
        <Hand className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-foreground">{data.label as string}</span>
        <span className="text-[11px] text-muted-foreground">Human Approval</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-muted-foreground !border-2 !border-card"
      />
    </div>
  );
}
