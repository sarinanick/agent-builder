'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function ConditionNode({ id, data, selected }: any) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const trueLabel = (data.trueLabel as string) || 'True';
  const falseLabel = (data.falseLabel as string) || 'False';

  return (
    <div className={`node-ios ${selected ? 'selected' : ''}`} onClick={() => setSelectedNodeId(id)}>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />

      <div className="node-ios-header">
        <div className="node-ios-icon" style={{ backgroundColor: '#ff9f0a' }}>
          <GitBranch className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="node-ios-label">{(data.label as string) || 'If'}</span>
          <span className="node-ios-sublabel">Condition</span>
        </div>
      </div>

      <div className="node-ios-body font-mono text-[10px]">
        {data.expression ? String(data.expression).substring(0, 35) + (String(data.expression).length > 35 ? '...' : '') : 'condition...'}
      </div>

      <div className="flex border-t border-border" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <div className="flex-1 px-3 py-1.5 text-[10px] text-center text-emerald-500 font-medium border-r border-border">{trueLabel}</div>
        <div className="flex-1 px-3 py-1.5 text-[10px] text-center text-red-400 font-medium">{falseLabel}</div>
      </div>

      <Handle type="source" position={Position.Right} id="true" style={{ top: '35%' }} className="!w-2 !h-2 !bg-emerald-500" />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '65%' }} className="!w-2 !h-2 !bg-red-500" />
    </div>
  );
}
