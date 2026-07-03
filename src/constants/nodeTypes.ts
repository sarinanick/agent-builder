import {
  Play,
  Square,
  Bot,
  StickyNote,
  FileSearch,
  Shield,
  Plug,
  GitBranch,
  Repeat,
  Hand,
  Shuffle,
  Database,
} from 'lucide-react';
import type { NodeCategory, CustomNodeType } from '@/types/nodes';

export interface NodeTypeDefinition {
  type: CustomNodeType;
  label: string;
  description: string;
  category: NodeCategory;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  headerColor: string;
  inputs: number;
  outputs: number;
}

export const NODE_CATEGORIES: {
  id: NodeCategory;
  label: string;
  nodes: CustomNodeType[];
}[] = [
  {
    id: 'start-end',
    label: 'Start / End',
    nodes: ['start', 'end'],
  },
  {
    id: 'agent',
    label: 'Agent',
    nodes: ['agent'],
  },
  {
    id: 'tools',
    label: 'Tools',
    nodes: ['fileSearch', 'guardrails', 'mcp'],
  },
  {
    id: 'logic',
    label: 'Logic',
    nodes: ['condition', 'whileLoop', 'humanApproval'],
  },
  {
    id: 'data',
    label: 'Data',
    nodes: ['transform', 'setState'],
  },
  {
    id: 'utility',
    label: 'Utility',
    nodes: ['note'],
  },
];

export const NODE_DEFINITIONS: Record<CustomNodeType, NodeTypeDefinition> = {
  start: {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    category: 'start-end',
    icon: Play,
    color: '#22c55e',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    headerColor: 'bg-emerald-500',
    inputs: 0,
    outputs: 1,
  },
  end: {
    type: 'end',
    label: 'End',
    description: 'Workflow termination',
    category: 'start-end',
    icon: Square,
    color: '#22c55e',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    headerColor: 'bg-emerald-500',
    inputs: 1,
    outputs: 0,
  },
  agent: {
    type: 'agent',
    label: 'Agent',
    description: 'AI agent with model, instructions & tools',
    category: 'agent',
    icon: Bot,
    color: '#a855f7',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    headerColor: 'bg-purple-500',
    inputs: 1,
    outputs: 1,
  },
  fileSearch: {
    type: 'fileSearch',
    label: 'File Search',
    description: 'Retrieve data from vector stores',
    category: 'tools',
    icon: FileSearch,
    color: '#eab308',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    headerColor: 'bg-yellow-500',
    inputs: 1,
    outputs: 1,
  },
  guardrails: {
    type: 'guardrails',
    label: 'Guardrails',
    description: 'Monitor inputs/outputs for safety',
    category: 'tools',
    icon: Shield,
    color: '#eab308',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    headerColor: 'bg-yellow-500',
    inputs: 1,
    outputs: 1,
  },
  mcp: {
    type: 'mcp',
    label: 'MCP',
    description: 'Connect to external tools via MCP',
    category: 'tools',
    icon: Plug,
    color: '#eab308',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    headerColor: 'bg-yellow-500',
    inputs: 1,
    outputs: 1,
  },
  condition: {
    type: 'condition',
    label: 'If / Else',
    description: 'Conditional branching with expressions',
    category: 'logic',
    icon: GitBranch,
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    headerColor: 'bg-orange-500',
    inputs: 1,
    outputs: 2,
  },
  whileLoop: {
    type: 'whileLoop',
    label: 'While',
    description: 'Loop based on a condition',
    category: 'logic',
    icon: Repeat,
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    headerColor: 'bg-orange-500',
    inputs: 1,
    outputs: 1,
  },
  humanApproval: {
    type: 'humanApproval',
    label: 'Human Approval',
    description: 'Pause workflow for human review',
    category: 'logic',
    icon: Hand,
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    headerColor: 'bg-orange-500',
    inputs: 1,
    outputs: 1,
  },
  transform: {
    type: 'transform',
    label: 'Transform',
    description: 'Reshape data between steps',
    category: 'data',
    icon: Shuffle,
    color: '#a855f7',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    headerColor: 'bg-purple-500',
    inputs: 1,
    outputs: 1,
  },
  setState: {
    type: 'setState',
    label: 'Set State',
    description: 'Define and update global variables',
    category: 'data',
    icon: Database,
    color: '#a855f7',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    headerColor: 'bg-purple-500',
    inputs: 1,
    outputs: 1,
  },
  note: {
    type: 'note',
    label: 'Note',
    description: 'Add annotations to the workflow',
    category: 'utility',
    icon: StickyNote,
    color: '#78716c',
    bgColor: 'bg-stone-500/10',
    borderColor: 'border-stone-500/30',
    headerColor: 'bg-stone-500',
    inputs: 0,
    outputs: 0,
  },
};
