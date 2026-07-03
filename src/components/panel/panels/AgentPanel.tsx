'use client';

import type { AgentNodeData } from '@/types/nodes';

interface AgentPanelProps {
  data: AgentNodeData;
  onChange: (data: Partial<AgentNodeData>) => void;
}

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];

export default function AgentPanel({ data, onChange }: AgentPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Model</label>
        <select
          value={data.model || 'gpt-4o'}
          onChange={(e) => onChange({ model: e.target.value })}
          className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">System Instructions</label>
        <textarea
          value={data.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="You are a helpful assistant..."
          rows={5}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Temperature: {data.temperature ?? 0.7}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={data.temperature ?? 0.7}
          onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tools</label>
        <div className="flex flex-wrap gap-1.5">
          {['fileSearch', 'webSearch', 'codeInterpreter'].map((tool) => (
            <button
              key={tool}
              onClick={() => {
                const tools = data.tools || [];
                const newTools = tools.includes(tool)
                  ? tools.filter((t) => t !== tool)
                  : [...tools, tool];
                onChange({ tools: newTools });
              }}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                (data.tools || []).includes(tool)
                  ? 'bg-foreground/10 border-foreground/20 text-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-foreground/20'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
