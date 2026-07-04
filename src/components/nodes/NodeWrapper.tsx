'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useUIStore } from '@/store/uiStore';
import type { ReactNode } from 'react';

interface NodeWrapperProps {
  id: string;
  data: Record<string, unknown>;
  selected?: boolean;
  icon: ReactNode;
  iconColor: string;
  label: string;
  sublabel?: string;
  body?: ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
  children?: ReactNode;
}

export default function NodeWrapper({
  id, data, selected, icon, iconColor, label, sublabel, body, hasInput = true, hasOutput = true, children,
}: NodeWrapperProps) {
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);

  return (
    <div
      className={`node-ios ${selected ? 'selected' : ''}`}
      onClick={() => setSelectedNodeId(id)}
      role="button"
      tabIndex={0}
      aria-label={`${(data.label as string) || label} node. Click to select.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedNodeId(id); } }}
    >
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5"
          aria-label="Input connection"
        />
      )}

      <div className="node-ios-header">
        <div className="node-ios-icon" style={{ backgroundColor: iconColor }}>
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="node-ios-label">{(data.label as string) || label}</span>
          {sublabel && <span className="node-ios-sublabel">{sublabel}</span>}
        </div>
      </div>

      {body && <div className="node-ios-body">{body}</div>}

      {children}

      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5"
          aria-label="Output connection"
        />
      )}
    </div>
  );
}
