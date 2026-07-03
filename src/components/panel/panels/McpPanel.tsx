'use client';

import type { McpNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface McpPanelProps {
  data: McpNodeData;
  onChange: (data: Partial<McpNodeData>) => void;
}

export default function McpPanel({ data, onChange }: McpPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'آدرس سرور' : 'Server URL'}</label>
        <input type="text" value={data.serverUrl || ''} onChange={(e) => onChange({ serverUrl: e.target.value })}
          placeholder="https://mcp-server.example.com" className="panel-input font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'نام ابزار' : 'Tool Name'}</label>
        <input type="text" value={data.toolName || ''} onChange={(e) => onChange({ toolName: e.target.value })}
          placeholder="search_documents" className="panel-input font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'پارامترها (JSON)' : 'Parameters (JSON)'}</label>
        <textarea value={data.parameters || ''} onChange={(e) => onChange({ parameters: e.target.value })}
          placeholder='{ "query": "{{input}}" }' rows={4} className="panel-textarea font-mono" />
      </div>
    </div>
  );
}
