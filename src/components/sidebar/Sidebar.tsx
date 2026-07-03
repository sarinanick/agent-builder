'use client';

import { Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { NODE_CATEGORIES, NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { NodeTypeDefinition } from '@/constants/nodeTypes';
import { useI18n } from '@/lib/i18n';

export default function Sidebar() {
  const { lang } = useI18n();
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  const filteredCategories = NODE_CATEGORIES.map((cat) => ({
    ...cat,
    nodes: cat.nodes.filter((nodeType) => {
      const def = NODE_DEFINITIONS[nodeType];
      if (!def) return false;
      const query = searchQuery.toLowerCase();
      return def.label.toLowerCase().includes(query) || def.description.toLowerCase().includes(query) || cat.label.toLowerCase().includes(query);
    }),
  })).filter((cat) => cat.nodes.length > 0);

  return (
    <div className="sidebar-ios flex flex-col h-full w-[220px]">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder={lang === 'fa' ? 'جستجوی نود...' : 'Insert node...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search"
          />
        </div>
      </div>

      {/* Node categories */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-2">
        {filteredCategories.map((cat, catIndex) => (
          <div key={cat.id} className="animate-fadeInUp" style={{ animationDelay: `${catIndex * 50}ms` }}>
            <div className="sidebar-category">{cat.label}</div>
            <div className="flex flex-col gap-0.5">
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
    <div draggable onDragStart={onDragStart} className="sidebar-item">
      <div className="node-ios-icon" style={{ backgroundColor: nodeDef.color }}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-[13px] font-medium truncate">{nodeDef.label}</span>
    </div>
  );
}
