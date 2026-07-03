'use client';

import { Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { NODE_CATEGORIES, NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { NodeTypeDefinition } from '@/constants/nodeTypes';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col h-full w-[220px] border-r border-border bg-card">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Insert node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
      </div>

      {/* Node categories */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-3">
        {filteredCategories.map((cat, catIndex) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.05, duration: 0.3 }}
          >
            <div className="px-1.5 mb-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {cat.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {cat.nodes.map((nodeType) => {
                const def = NODE_DEFINITIONS[nodeType];
                return <SidebarNodeItem key={def.type} nodeDef={def} />;
              })}
            </div>
          </motion.div>
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
        bg-transparent hover:bg-accent/50
        cursor-grab active:cursor-grabbing transition-all select-none group
        active:scale-[0.98] hover:scale-[1.01]"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md text-white shrink-0"
        style={{ backgroundColor: nodeDef.color }}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-[13px] font-medium text-foreground truncate">
        {nodeDef.label}
      </span>
    </div>
  );
}
