'use client';

import type { ComponentType } from 'react';
import type { NodeProps } from '@xyflow/react';

// Audit item #4: Central node registry
export interface NodeRegistryEntry {
  type: string;
  defaults: Record<string, unknown>;
  component: ComponentType<NodeProps>;
  panel: ComponentType<{ data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>;
  icon: string;
  colorToken: string;
  category: 'start-end' | 'agent' | 'tools' | 'logic' | 'data' | 'utility';
  handles: { type: 'target' | 'source'; position: 'left' | 'right' }[];
}

// Lazy import components
import StartNode from '@/components/nodes/StartNode';
import EndNode from '@/components/nodes/EndNode';
import AgentNode from '@/components/nodes/AgentNode';
import ConditionNode from '@/components/nodes/ConditionNode';
import FileSearchNode from '@/components/nodes/FileSearchNode';
import GuardrailsNode from '@/components/nodes/GuardrailsNode';
import McpNode from '@/components/nodes/McpNode';
import WhileNode from '@/components/nodes/WhileNode';
import HumanApprovalNode from '@/components/nodes/HumanApprovalNode';
import TransformNode from '@/components/nodes/TransformNode';
import SetStateNode from '@/components/nodes/SetStateNode';
import NoteNode from '@/components/nodes/NoteNode';

import AgentPanel from '@/components/panel/panels/AgentPanel';
import ConditionPanel from '@/components/panel/panels/ConditionPanel';
import FileSearchPanel from '@/components/panel/panels/FileSearchPanel';
import GuardrailsPanel from '@/components/panel/panels/GuardrailsPanel';
import McpPanel from '@/components/panel/panels/McpPanel';
import WhilePanel from '@/components/panel/panels/WhilePanel';
import HumanApprovalPanel from '@/components/panel/panels/HumanApprovalPanel';
import TransformPanel from '@/components/panel/panels/TransformPanel';
import SetStatePanel from '@/components/panel/panels/SetStatePanel';
import NotePanel from '@/components/panel/panels/NotePanel';

export const NODE_REGISTRY: Record<string, NodeRegistryEntry> = {
  start: {
    type: 'start',
    component: StartNode,
    panel: () => null,
    icon: '▶',
    colorToken: 'var(--color-emerald-500)',
    category: 'start-end',
    handles: [{ type: 'source', position: 'right' }],
    defaults: { label: 'Start', description: 'Entry point' },
  },
  end: {
    type: 'end',
    component: EndNode,
    panel: () => null,
    icon: '⏹',
    colorToken: 'var(--color-emerald-500)',
    category: 'start-end',
    handles: [{ type: 'target', position: 'left' }],
    defaults: { label: 'End', description: 'Exit point' },
  },
  agent: {
    type: 'agent',
    component: AgentNode,
    panel: AgentPanel as any,
    icon: '🤖',
    colorToken: 'var(--color-purple-500)',
    category: 'agent',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'Agent', model: 'gpt-4o', instructions: '', tools: [], temperature: 0.7 },
  },
  condition: {
    type: 'condition',
    component: ConditionNode,
    panel: ConditionPanel as any,
    icon: '⚡',
    colorToken: 'var(--color-orange-500)',
    category: 'logic',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'If', expression: '', trueLabel: 'True', falseLabel: 'False' },
  },
  fileSearch: {
    type: 'fileSearch',
    component: FileSearchNode,
    panel: FileSearchPanel as any,
    icon: '🔍',
    colorToken: 'var(--color-yellow-500)',
    category: 'tools',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'File Search', vectorStoreId: '', topK: 5, scoreThreshold: 0.7 },
  },
  guardrails: {
    type: 'guardrails',
    component: GuardrailsNode,
    panel: GuardrailsPanel as any,
    icon: '🛡️',
    colorToken: 'var(--color-yellow-500)',
    category: 'tools',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'Guardrails', checkType: 'both', pattern: '' },
  },
  mcp: {
    type: 'mcp',
    component: McpNode,
    panel: McpPanel as any,
    icon: '🔌',
    colorToken: 'var(--color-yellow-500)',
    category: 'tools',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'MCP', serverUrl: '', toolName: '', parameters: '' },
  },
  whileLoop: {
    type: 'whileLoop',
    component: WhileNode,
    panel: WhilePanel as any,
    icon: '🔄',
    colorToken: 'var(--color-orange-500)',
    category: 'logic',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'While', condition: '', maxIterations: 10 },
  },
  humanApproval: {
    type: 'humanApproval',
    component: HumanApprovalNode,
    panel: HumanApprovalPanel as any,
    icon: '✋',
    colorToken: 'var(--color-orange-500)',
    category: 'logic',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'Human Approval', instructions: '', timeout: 300 },
  },
  transform: {
    type: 'transform',
    component: TransformNode,
    panel: TransformPanel as any,
    icon: '🔀',
    colorToken: 'var(--color-blue-500)',
    category: 'data',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'Transform', inputSchema: '', outputSchema: '', transformCode: '' },
  },
  setState: {
    type: 'setState',
    component: SetStateNode,
    panel: SetStatePanel as any,
    icon: '📦',
    colorToken: 'var(--color-blue-500)',
    category: 'data',
    handles: [
      { type: 'target', position: 'left' },
      { type: 'source', position: 'right' },
    ],
    defaults: { label: 'Set State', variables: [] },
  },
  note: {
    type: 'note',
    component: NoteNode,
    panel: NotePanel as any,
    icon: '📝',
    colorToken: 'var(--color-gray-500)',
    category: 'utility',
    handles: [],
    defaults: { label: 'Note', text: '', color: '#eab308' },
  },
};

export function getNodeDefaults(type: string) {
  return NODE_REGISTRY[type]?.defaults || { label: type };
}

export function getNodeComponent(type: string) {
  return NODE_REGISTRY[type]?.component;
}

export function getNodePanel(type: string) {
  return NODE_REGISTRY[type]?.panel;
}
