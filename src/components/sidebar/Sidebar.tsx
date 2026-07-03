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
    <aside
      className="flex flex-col h-full w-[220px] border-e border-[var(--border-subtle)] bg-[var(--surface-panel)]"
      aria-label={lang === 'fa' ? 'پالت نودها' : 'Node palette'}
    >
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search
            className="absolute inset-inline-start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: 'var(--text-muted)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={lang === 'fa' ? 'جستجوی نود...' : 'Search nodes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={lang === 'fa' ? 'جستجوی نودها' : 'Search nodes'}
            className="w-full ps-8 pe-3 py-2 text-sm rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-inline-end-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label={lang === 'fa' ? 'پاک کردن جستجو' : 'Clear search'}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Node categories */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-2" aria-label={lang === 'fa' ? 'دسته‌بندی نودها' : 'Node categories'}>
        {filteredCategories.map((cat, catIndex) => (
          <div key={cat.id}>
            <h3 className="px-1.5 mb-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {cat.label}
            </h3>
            <ul className="flex flex-col gap-0.5" role="list">
              {cat.nodes.map((nodeType) => {
                const def = NODE_DEFINITIONS[nodeType];
                return <SidebarNodeItem key={def.type} nodeDef={def} />;
              })}
            </ul>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-center text-xs text-[var(--text-muted)] py-4">
            {lang === 'fa' ? 'نودی یافت نشد' : 'No nodes found'}
          </p>
        )}
      </nav>
    </aside>
  );
}

function SidebarNodeItem({ nodeDef }: { nodeDef: NodeTypeDefinition }) {
  const { lang } = useI18n();
  const Icon = nodeDef.icon;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeDef.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <li>
      <div
        draggable
        onDragStart={onDragStart}
        role="button"
        tabIndex={0}
        aria-label={`${nodeDef.label} - ${lang === 'fa' ? 'برای اضافه کردن بکشید' : 'Drag to add'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Could trigger add node action
          }
        }}
        className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-lg)] cursor-grab active:cursor-grabbing hover:bg-[var(--surface-card)] transition-all duration-[var(--transition-fast)] select-none"
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] text-white shrink-0"
          style={{ backgroundColor: nodeDef.color }}
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
          {nodeDef.label}
        </span>
      </div>
    </li>
  );
}
