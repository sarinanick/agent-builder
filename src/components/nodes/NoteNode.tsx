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
      className={`w-full h-full cursor-pointer rounded-lg border shadow-md transition-all
        ${selected ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/20' : 'border-amber-600/30'}
        bg-amber-200 dark:bg-amber-900/40`}
      onClick={() => setSelectedNodeId(id)}
    >
      {selected && (
        <NodeResizer
          minWidth={150}
          minHeight={80}
          lineClassName="!border-amber-400"
          handleClassName="!bg-amber-400 !w-2 !h-2"
        />
      )}
      <div className="p-3 h-full overflow-auto">
        <textarea
          className="w-full h-full bg-transparent border-none outline-none resize-none text-sm text-amber-900 dark:text-amber-200 placeholder:text-amber-600/50 dark:placeholder:text-amber-400/50"
          value={text}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Write a note..."
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
