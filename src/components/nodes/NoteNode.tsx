'use client';

import { type NodeProps, NodeResizer } from '@xyflow/react';
import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';

export default function NoteNode({ id, data, selected }: NodeProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const text = (data.text as string) || 'Click to edit...';

  return (
    <div
      className={`w-full h-full rounded-2xl cursor-pointer transition-all ${selected ? 'ring-2 ring-[var(--ring)] shadow-lg' : 'shadow-md'}`}
      style={{ background: 'linear-gradient(135deg, oklch(85% 0.08 80), oklch(80% 0.1 70))', border: '1px solid oklch(70% 0.08 80)' }}
      onClick={() => setSelectedNodeId(id)}
    >
      {selected && (
        <NodeResizer minWidth={150} minHeight={80} lineClassName="!border-blue-400" handleClassName="!bg-blue-400 !w-2 !h-2" />
      )}
      <div className="p-3 h-full overflow-auto">
        <textarea
          className="w-full h-full bg-transparent border-none outline-none resize-none text-sm font-medium"
          style={{ color: 'oklch(25% 0.05 80)' }}
          value={text}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Write a note..."
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
