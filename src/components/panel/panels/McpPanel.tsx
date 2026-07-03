'use client';

import type { McpNodeData } from '@/types/nodes';

interface McpPanelProps {
  data: McpNodeData;
  onChange: (data: Partial<McpNodeData>) => void;
}

export default function McpPanel({ data, onChange }: McpPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Server URL</label>
        <input type="text" value={data.serverUrl || ''} onChange={(e) => onChange({ serverUrl: e.target.value })}
          placeholder="https://mcp-server.example.com"
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tool Name</label>
        <input type="text" value={data.toolName || ''} onChange={(e) => onChange({ toolName: e.target.value })}
          placeholder="search_documents"
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Parameters (JSON)</label>
        <textarea value={data.parameters || ''} onChange={(e) => onChange({ parameters: e.target.value })}
          placeholder='{ "query": "{{input}}" }' rows={4}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      </div>
    </div>
  );
}
