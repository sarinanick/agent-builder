'use client';

import type { GuardrailsNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface GuardrailsPanelProps {
  data: GuardrailsNodeData;
  onChange: (data: Partial<GuardrailsNodeData>) => void;
}

export default function GuardrailsPanel({ data, onChange }: GuardrailsPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'نوع بررسی' : 'Check Type'}</label>
        <div className="flex gap-2">
          {['input', 'output', 'both'].map((type) => (
            <button key={type} onClick={() => onChange({ checkType: type as 'input' | 'output' | 'both' })}
              className="flex-1 px-3 py-2 text-xs rounded-xl border transition-all capitalize"
              style={data.checkType === type
                ? { background: 'rgba(10,132,255,0.1)', borderColor: 'rgba(10,132,255,0.3)', color: 'var(--ring)' }
                : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'الگو (Regex)' : 'Pattern (Regex)'}</label>
        <input type="text" value={data.pattern || ''} onChange={(e) => onChange({ pattern: e.target.value })}
          placeholder='(SSN|credit card|password)' className="panel-input font-mono" />
      </div>
    </div>
  );
}
