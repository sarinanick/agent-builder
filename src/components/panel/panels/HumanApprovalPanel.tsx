'use client';

import type { HumanApprovalNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface HumanApprovalPanelProps {
  data: HumanApprovalNodeData;
  onChange: (data: Partial<HumanApprovalNodeData>) => void;
}

export default function HumanApprovalPanel({ data, onChange }: HumanApprovalPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'دستورات' : 'Instructions'}</label>
        <textarea value={data.instructions || ''} onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder={lang === 'fa' ? 'لطفاً خروجی را بررسی کنید...' : 'Please review the output before proceeding...'}
          rows={4} className="panel-textarea" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'مهلت (ثانیه)' : 'Timeout (seconds)'}: {data.timeout || 300}</label>
        <input type="range" min="30" max="3600" step="30" value={data.timeout || 300}
          onChange={(e) => onChange({ timeout: parseInt(e.target.value) })} className="panel-range" />
      </div>
    </div>
  );
}
