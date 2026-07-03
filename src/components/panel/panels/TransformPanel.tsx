'use client';

import type { TransformNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface TransformPanelProps {
  data: TransformNodeData;
  onChange: (data: Partial<TransformNodeData>) => void;
}

export default function TransformPanel({ data, onChange }: TransformPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'اسکمای ورودی' : 'Input Schema'}</label>
        <textarea value={data.inputSchema || ''} onChange={(e) => onChange({ inputSchema: e.target.value })}
          placeholder='{ "text": "string" }' rows={3} className="panel-textarea font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'اسکمای خروجی' : 'Output Schema'}</label>
        <textarea value={data.outputSchema || ''} onChange={(e) => onChange({ outputSchema: e.target.value })}
          placeholder='{ "result": "string" }' rows={3} className="panel-textarea font-mono" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'کد تبدیل' : 'Transform Code'}</label>
        <textarea value={data.transformCode || ''} onChange={(e) => onChange({ transformCode: e.target.value })}
          placeholder="return { result: input.text.toUpperCase() }" rows={4} className="panel-textarea font-mono" />
      </div>
    </div>
  );
}
