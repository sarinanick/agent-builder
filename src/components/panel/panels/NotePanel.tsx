'use client';

import type { NoteNodeData } from '@/types/nodes';

interface NotePanelProps {
  data: NoteNodeData;
  onChange: (data: Partial<NoteNodeData>) => void;
}

export default function NotePanel({ data, onChange }: NotePanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Note Content</label>
        <textarea value={data.text || ''} onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Write your note here..." rows={6}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Color</label>
        <div className="flex gap-2">
          {['#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444'].map((color) => (
            <button key={color} onClick={() => onChange({ color })}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                data.color === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
              }`} style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
