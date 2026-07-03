'use client';

import type { AgentNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface AgentPanelProps {
  data: AgentNodeData;
  onChange: (data: Partial<AgentNodeData>) => void;
}

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];

export default function AgentPanel({ data, onChange }: AgentPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'مدل' : 'Model'}</label>
        <select value={data.model || 'gpt-4o'} onChange={(e) => onChange({ model: e.target.value })} className="panel-select">
          {MODELS.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
      </div>

      <div>
        <label className="panel-label">{lang === 'fa' ? 'دستورات سیستم' : 'System Instructions'}</label>
        <textarea value={data.instructions || ''} onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder={lang === 'fa' ? 'شما یک دستیار هوشمند هستید...' : 'You are a helpful assistant...'}
          rows={5} className="panel-textarea" />
      </div>

      <div>
        <label className="panel-label">{lang === 'fa' ? 'دما' : 'Temperature'}: {data.temperature ?? 0.7}</label>
        <input type="range" min="0" max="2" step="0.1" value={data.temperature ?? 0.7}
          onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
          className="panel-range" />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>{lang === 'fa' ? 'دقیق' : 'Precise'}</span>
          <span>{lang === 'fa' ? 'خلاقانه' : 'Creative'}</span>
        </div>
      </div>

      <div>
        <label className="panel-label">{lang === 'fa' ? 'ابزارها' : 'Tools'}</label>
        <div className="flex flex-wrap gap-1.5">
          {['fileSearch', 'webSearch', 'codeInterpreter'].map((tool) => (
            <button key={tool} onClick={() => {
              const tools = data.tools || [];
              onChange({ tools: tools.includes(tool) ? tools.filter((t) => t !== tool) : [...tools, tool] });
            }}
              className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${(data.tools || []).includes(tool)
                ? 'bg-[var(--ring)]/10 border-[var(--ring)]/30 text-[var(--ring)]'
                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--ring)]/20'}`}
              style={(data.tools || []).includes(tool) ? { background: 'rgba(10,132,255,0.1)', borderColor: 'rgba(10,132,255,0.3)', color: 'var(--ring)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
