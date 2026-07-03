'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import NodePalette from './NodePalette';
import type { NodeCategory as NodeCat } from '@/types/nodes';

interface NodeCategoryProps {
  id: NodeCat;
  label: string;
}

export default function NodeCategory({ id, label }: NodeCategoryProps) {
  const collapsedCategories = useUIStore((s) => s.collapsedCategories);
  const toggleCategory = useUIStore((s) => s.toggleCategory);
  const isCollapsed = collapsedCategories.includes(id);

  return (
    <div className="mb-1">
      <button
        onClick={() => toggleCategory(id)}
        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {label}
      </button>
      {!isCollapsed && <NodeCategoryNodes categoryId={id} />}
    </div>
  );
}

function NodeCategoryNodes({ categoryId }: { categoryId: NodeCat }) {
  const { NODE_CATEGORIES, NODE_DEFINITIONS } = require('@/constants/nodeTypes');
  const category = NODE_CATEGORIES.find((c: { id: string }) => c.id === categoryId);
  if (!category) return null;

  return (
    <div className="flex flex-col gap-1 px-1">
      {category.nodes.map((nodeType: string) => {
        const def = NODE_DEFINITIONS[nodeType as keyof typeof NODE_DEFINITIONS];
        if (!def) return null;
        return <NodePalette key={def.type} nodeDef={def} />;
      })}
    </div>
  );
}
