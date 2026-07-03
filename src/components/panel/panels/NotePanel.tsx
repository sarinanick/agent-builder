'use client';

import type { NoteNodeData } from '@/types/nodes';

interface NotePanelProps {
  data: NoteNodeData;
  onChange: (data: Partial<NoteNodeData>) => void;
}

export default function NotePanel({ data, onChange }: NotePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Note Content</label>
        <textarea
          value={data.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Write your note here..."
          rows={8}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Color</label>
        <div className="flex gap-2">
          {['#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444'].map((color) => (
            <button
              key={color}
              onClick={() => onChange({ color })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                data.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
