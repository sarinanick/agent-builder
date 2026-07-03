'use client';

import type { SetStateNodeData } from '@/types/nodes';
import { Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface SetStatePanelProps {
  data: SetStateNodeData;
  onChange: (data: Partial<SetStateNodeData>) => void;
}

export default function SetStatePanel({ data, onChange }: SetStatePanelProps) {
  const { lang } = useI18n();
  const variables = data.variables || [];

  const addVariable = () => { onChange({ variables: [...variables, { name: '', value: '', scope: 'global' }] }); };
  const updateVariable = (index: number, field: string, value: string) => {
    const updated = [...variables]; updated[index] = { ...updated[index], [field]: value }; onChange({ variables: updated });
  };
  const removeVariable = (index: number) => { onChange({ variables: variables.filter((_, i) => i !== index) }); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="panel-label !mb-0">{lang === 'fa' ? 'متغیرها' : 'Variables'}</label>
        <button onClick={addVariable} className="flex items-center gap-1 text-xs" style={{ color: 'var(--ring)' }}>
          <Plus className="h-3 w-3" /> {lang === 'fa' ? 'افزودن' : 'Add'}
        </button>
      </div>
      <div className="space-y-2">
        {variables.map((v, i) => (
          <div key={i} className="p-2.5 rounded-xl space-y-2" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{lang === 'fa' ? 'متغیر' : 'Variable'} {i + 1}</span>
              <button onClick={() => removeVariable(i)} className="hover:opacity-70" style={{ color: 'var(--muted-foreground)' }}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <input type="text" placeholder={lang === 'fa' ? 'نام' : 'Name'} value={v.name} onChange={(e) => updateVariable(i, 'name', e.target.value)} className="panel-input !h-8 !text-xs" />
            <input type="text" placeholder={lang === 'fa' ? 'مقدار (مثلاً {{output}})' : 'Value (e.g. {{output}})'} value={v.value} onChange={(e) => updateVariable(i, 'value', e.target.value)} className="panel-input !h-8 !text-xs font-mono" />
            <select value={v.scope} onChange={(e) => updateVariable(i, 'scope', e.target.value)} className="panel-select !h-8 !text-xs">
              <option value="global">{lang === 'fa' ? 'سراسری' : 'Global'}</option>
              <option value="local">{lang === 'fa' ? 'محلی' : 'Local'}</option>
            </select>
          </div>
        ))}
      </div>
      {variables.length === 0 && (
        <button onClick={addVariable} className="w-full py-3 rounded-xl text-xs border-2 border-dashed transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          + {lang === 'fa' ? 'افزودن متغیر' : 'Add variable'}
        </button>
      )}
    </div>
  );
}
