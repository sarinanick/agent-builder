'use client';

import type { ConditionNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface ConditionPanelProps {
  data: ConditionNodeData;
  onChange: (data: Partial<ConditionNodeData>) => void;
}

export default function ConditionPanel({ data, onChange }: ConditionPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'عبارت (CEL)' : 'Expression (CEL)'}</label>
        <textarea value={data.expression || ''} onChange={(e) => onChange({ expression: e.target.value })}
          placeholder='input.category == "qa"' rows={3} className="panel-textarea font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'شاخه درست' : 'True Branch'}</label>
        <input type="text" value={data.trueLabel || 'True'} onChange={(e) => onChange({ trueLabel: e.target.value })} className="panel-input" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'شاخه غلط' : 'False Branch'}</label>
        <input type="text" value={data.falseLabel || 'False'} onChange={(e) => onChange({ falseLabel: e.target.value })} className="panel-input" />
      </div>
    </div>
  );
}
