'use client';

import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';
import { NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { CustomNodeType } from '@/types/nodes';
import { X, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { FieldInput } from '@/components/ui/FormField';

import AgentPanel from './panels/AgentPanel';
import ConditionPanel from './panels/ConditionPanel';
import WhilePanel from './panels/WhilePanel';
import TransformPanel from './panels/TransformPanel';
import SetStatePanel from './panels/SetStatePanel';
import FileSearchPanel from './panels/FileSearchPanel';
import GuardrailsPanel from './panels/GuardrailsPanel';
import McpPanel from './panels/McpPanel';
import HumanApprovalPanel from './panels/HumanApprovalPanel';
import NotePanel from './panels/NotePanel';

export default function PropertiesPanel() {
  const { lang } = useI18n();
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const deleteSelected = useFlowStore((s) => s.deleteSelected);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const nodeType = selectedNode.type as CustomNodeType;
  const definition = NODE_DEFINITIONS[nodeType];

  const handleDataChange = (data: Record<string, unknown>) => {
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, data);
    }
  };

  const handleDelete = () => {
    if (!selectedNodeId) return;
    const store = useFlowStore.getState();
    const updatedNodes = store.nodes.map((n) =>
      n.id === selectedNodeId ? { ...n, selected: true } : { ...n, selected: false }
    );
    useFlowStore.setState({ nodes: updatedNodes });
    deleteSelected();
    setSelectedNodeId(null);
  };

  return (
      <div
        key={selectedNodeId}
        className="panel-ios flex flex-col h-full w-[300px] animate-fadeIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            {definition && (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md text-white shrink-0"
                style={{ backgroundColor: definition.color }}
              >
                <definition.icon className="h-3.5 w-3.5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {selectedNode.data.label as string}
              </h3>
              {definition && (
                <p className="text-[11px] text-muted-foreground">{definition.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              className="btn-3d btn-3d-danger btn-3d-icon !w-8 !h-8 !p-0 !text-xs"
              title={lang === 'fa' ? 'حذف نود' : 'Delete node'}
              aria-label={lang === 'fa' ? 'حذف نود' : 'Delete node'}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="btn-3d btn-3d-secondary btn-3d-icon !w-8 !h-8 !p-0"
              title={lang === 'fa' ? 'بستن' : 'Close'}
              aria-label={lang === 'fa' ? 'بستن پنل' : 'Close panel'}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Label edit */}
          <div>
            <label className="panel-label">{lang === 'fa' ? 'عنوان' : 'Label'}</label>
            <FieldInput
              value={(selectedNode.data.label as string) || ''}
              onChange={(e) => handleDataChange({ label: e.target.value })}
            />
          </div>

          {/* Description edit */}
          <div>
            <label className="panel-label">{lang === 'fa' ? 'توضیحات' : 'Description'}</label>
            <FieldInput
              value={(selectedNode.data.description as string) || ''}
              onChange={(e) => handleDataChange({ description: e.target.value })}
              placeholder={lang === 'fa' ? 'توضیحات اختیاری...' : 'Optional description...'}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Type-specific panel */}
          {nodeType === 'agent' && (
            <AgentPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'condition' && (
            <ConditionPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'whileLoop' && (
            <WhilePanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'transform' && (
            <TransformPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'setState' && (
            <SetStatePanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'fileSearch' && (
            <FileSearchPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'guardrails' && (
            <GuardrailsPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'mcp' && (
            <McpPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'humanApproval' && (
            <HumanApprovalPanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {nodeType === 'note' && (
            <NotePanel data={selectedNode.data as any} onChange={handleDataChange} />
          )}
          {(nodeType === 'start' || nodeType === 'end') && (
            <div className="text-sm text-muted-foreground text-center py-8">
              No additional configuration available.
            </div>
          )}
        </div>
      </div>
  );
}
