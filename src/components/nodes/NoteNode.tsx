'use client';

import { type NodeProps, NodeResizer } from '@xyflow/react';
import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';

export default function NoteNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);

  const text = (data.text as string) || 'Click to edit note...';

  return (
    <div
      className={`w-full h-full cursor-pointer rounded-xl transition-all
        ${selected ? 'ring-1 ring-foreground/30 shadow-lg' : ''}
        bg-amber-200/80 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-700/30`}
      onClick={() => setSelectedNodeId(id)}
    >
      {selected && (
        <NodeResizer
          minWidth={150}
          minHeight={80}
          lineClassName="!border-foreground/30"
          handleClassName="!bg-foreground !w-1.5 !h-1.5"
        />
      )}
      <div className="p-3 h-full overflow-auto">
        <textarea
          className="w-full h-full bg-transparent border-none outline-none resize-none text-[13px] text-amber-900 dark:text-amber-200 placeholder:text-amber-600/40"
          value={text}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Write a note..."
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
