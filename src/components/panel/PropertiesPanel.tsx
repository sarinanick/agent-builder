'use client';

import { useUIStore } from '@/store/uiStore';
import { useFlowStore } from '@/store/flowStore';
import { NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { CustomNodeType } from '@/types/nodes';
import { X, Trash2 } from 'lucide-react';

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
    // Mark the node as selected so deleteSelected works
    const store = useFlowStore.getState();
    const updatedNodes = store.nodes.map((n) =>
      n.id === selectedNodeId ? { ...n, selected: true } : { ...n, selected: false }
    );
    useFlowStore.setState({ nodes: updatedNodes });
    deleteSelected();
    setSelectedNodeId(null);
  };

  return (
    <div className="flex flex-col h-full w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {definition && (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md text-white"
              style={{ backgroundColor: definition.color }}
            >
              <definition.icon className="h-3.5 w-3.5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {selectedNode.data.label as string}
            </h3>
            {definition && (
              <p className="text-xs text-zinc-400">{definition.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete node"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Label edit */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Label</label>
          <input
            type="text"
            value={(selectedNode.data.label as string) || ''}
            onChange={(e) => handleDataChange({ label: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Description edit */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Description</label>
          <input
            type="text"
            value={(selectedNode.data.description as string) || ''}
            onChange={(e) => handleDataChange({ description: e.target.value })}
            placeholder="Optional description..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <hr className="border-zinc-200 dark:border-zinc-700 mb-4" />

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
          <div className="text-sm text-zinc-400 text-center py-8">
            No additional configuration available.
          </div>
        )}
      </div>
    </div>
  );
}
