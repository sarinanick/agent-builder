'use client';

import type { NoteNodeData } from '@/types/nodes';
import { useI18n } from '@/lib/i18n';

interface NotePanelProps {
  data: NoteNodeData;
  onChange: (data: Partial<NoteNodeData>) => void;
}

export default function NotePanel({ data, onChange }: NotePanelProps) {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <label className="panel-label">{lang === 'fa' ? 'محتوای یادداشت' : 'Note Content'}</label>
        <textarea value={data.text || ''} onChange={(e) => onChange({ text: e.target.value })}
          placeholder={lang === 'fa' ? 'یادداشت خود را اینجا بنویسید...' : 'Write your note here...'}
          rows={6} className="panel-textarea" />
      </div>
      <div>
        <label className="panel-label">{lang === 'fa' ? 'رنگ' : 'Color'}</label>
        <div className="flex gap-2">
          {['#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444'].map((color) => (
            <button key={color} onClick={() => onChange({ color })}
              className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
              style={{ backgroundColor: color, borderColor: data.color === color ? 'var(--foreground)' : 'transparent' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
