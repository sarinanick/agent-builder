'use client';

import type { McpNodeData } from '@/types/nodes';

interface McpPanelProps {
  data: McpNodeData;
  onChange: (data: Partial<McpNodeData>) => void;
}

export default function McpPanel({ data, onChange }: McpPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Server URL</label>
        <input
          type="text"
          value={data.serverUrl || ''}
          onChange={(e) => onChange({ serverUrl: e.target.value })}
          placeholder="https://mcp-server.example.com"
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Tool Name</label>
        <input
          type="text"
          value={data.toolName || ''}
          onChange={(e) => onChange({ toolName: e.target.value })}
          placeholder="search_documents"
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Parameters (JSON)</label>
        <textarea
          value={data.parameters || ''}
          onChange={(e) => onChange({ parameters: e.target.value })}
          placeholder='{ "query": "{{input}}" }'
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>
    </div>
  );
}
