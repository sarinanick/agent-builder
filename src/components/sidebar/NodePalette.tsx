'use client';

import type { NodeTypeDefinition } from '@/constants/nodeTypes';
import type { CustomNodeType } from '@/types/nodes';

interface NodePaletteProps {
  nodeDef: NodeTypeDefinition;
}

export default function NodePalette({ nodeDef }: NodePaletteProps) {
  const Icon = nodeDef.icon;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeDef.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700/50
        bg-white dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/50
        cursor-grab active:cursor-grabbing transition-all group"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md text-white shrink-0"
        style={{ backgroundColor: nodeDef.color }}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {nodeDef.label}
        </span>
      </div>
    </div>
  );
}
