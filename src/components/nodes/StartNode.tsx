'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function StartNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 min-w-[130px] cursor-pointer transition-all
        ${selected ? 'border-foreground/30 shadow-lg ring-1 ring-foreground/10' : 'border-border hover:border-foreground/20'}
        bg-card`}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
        <Play className="h-3 w-3 fill-current" />
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-foreground">
          {data.label as string}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-muted-foreground !border-2 !border-card"
      />
    </div>
  );
}
