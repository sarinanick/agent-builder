'use client';

import type { FileSearchNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface FileSearchPanelProps {
  data: FileSearchNodeData;
  onChange: (data: Partial<FileSearchNodeData>) => void;
}

export default function FileSearchPanel({ data, onChange }: FileSearchPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'شناسه فروشگاه بردار' : 'Vector Store ID'}</label>
        <input type="text" value={data.vectorStoreId || ''} onChange={(e) => onChange({ vectorStoreId: e.target.value })}
          placeholder="vs_xxxxxxxxxxxx" className="panel-input font-mono" />
      </div>
      <div>
        <label className="panel-label">Top K: {data.topK || 5}</label>
        <input type="range" min="1" max="20" value={data.topK || 5}
          onChange={(e) => onChange({ topK: parseInt(e.target.value) })} className="panel-range" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'آستانه امتیاز' : 'Score Threshold'}</label>
        <input type="number" min="0" max="1" step="0.05" value={data.scoreThreshold || 0.7}
          onChange={(e) => onChange({ scoreThreshold: parseFloat(e.target.value) })} className="panel-input" />
      </div>
    </div>
  );
}
