'use client';

import { Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { NODE_CATEGORIES, NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { NodeTypeDefinition } from '@/constants/nodeTypes';

export default function Sidebar() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  const filteredCategories = NODE_CATEGORIES.map((cat) => ({
    ...cat,
    nodes: cat.nodes.filter((nodeType) => {
      const def = NODE_DEFINITIONS[nodeType];
      if (!def) return false;
      const query = searchQuery.toLowerCase();
      return (
        def.label.toLowerCase().includes(query) ||
        def.description.toLowerCase().includes(query) ||
        cat.label.toLowerCase().includes(query)
      );
    }),
  })).filter((cat) => cat.nodes.length > 0);

  return (
    <div className="flex flex-col h-full w-[220px] border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
      {/* Search */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Insert node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
              transition-all"
          />
        </div>
      </div>

      {/* Node categories */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredCategories.map((cat) => (
          <div key={cat.id}>
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {cat.label}
            </div>
            <div className="flex flex-col gap-1">
              {cat.nodes.map((nodeType) => {
                const def = NODE_DEFINITIONS[nodeType];
                return <SidebarNodeItem key={def.type} nodeDef={def} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarNodeItem({ nodeDef }: { nodeDef: NodeTypeDefinition }) {
  const Icon = nodeDef.icon;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeDef.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg
        bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50
        hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600
        cursor-grab active:cursor-grabbing transition-all select-none"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md text-white shrink-0"
        style={{ backgroundColor: nodeDef.color }}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
        {nodeDef.label}
      </span>
    </div>
  );
}
