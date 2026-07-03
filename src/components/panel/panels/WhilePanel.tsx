'use client';

import type { WhileNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface WhilePanelProps {
  data: WhileNodeData;
  onChange: (data: Partial<WhileNodeData>) => void;
}

export default function WhilePanel({ data, onChange }: WhilePanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'شرط' : 'Condition'}</label>
        <textarea value={data.condition || ''} onChange={(e) => onChange({ condition: e.target.value })}
          placeholder='output.status != "complete"' rows={3} className="panel-textarea font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'حداکثر تکرار' : 'Max Iterations'}</label>
        <input type="number" min="1" max="100" value={data.maxIterations || 10}
          onChange={(e) => onChange({ maxIterations: parseInt(e.target.value) || 10 })} className="panel-input" />
      </div>
    </div>
  );
}
