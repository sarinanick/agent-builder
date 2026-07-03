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
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Model</label>
        <select
          value={data.model || 'gpt-4o'}
          onChange={(e) => onChange({ model: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">System Instructions</label>
        <textarea
          value={data.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="You are a helpful assistant..."
          rows={6}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
          Temperature: {data.temperature ?? 0.7}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={data.temperature ?? 0.7}
          onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Tools</label>
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
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
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
