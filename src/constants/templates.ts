import type { Node, Edge } from '@xyflow/react';
import type { CustomNodeType } from '@/types/nodes';

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

function createNode(
  id: string,
  type: CustomNodeType,
  x: number,
  y: number,
  data: Record<string, unknown>
): Node {
  return {
    id,
    type,
    position: { x, y },
    data: { label: type.charAt(0).toUpperCase() + type.slice(1), ...data },
  };
}

const homeworkHelperNodes: Node[] = [
  createNode('start-1', 'start', 50, 250, {
    label: 'Start',
    description: 'User input received',
  }),
  createNode('agent-1', 'agent', 280, 250, {
    label: 'Query rewrite',
    description: 'Rewrite the user\'s question to be more specific and relevant to the knowledge base.',
    model: 'gpt-4o',
    instructions: 'You are a query rewriting assistant. Rewrite the user\'s question to be more specific and relevant to the knowledge base.',
    tools: [],
    temperature: 0.7,
  }),
  createNode('setState-1', 'setState', 530, 250, {
    label: 'Set state',
    description: 'Store rewritten query',
    variables: [{ name: 'rewritten_query', value: '{{output}}', scope: 'global' }],
  }),
  createNode('agent-2', 'agent', 770, 250, {
    label: 'Classify',
    description: 'Based on the question asked, triage to a particular agent.',
    model: 'gpt-4o',
    instructions: 'Classify the incoming query into one of: q-and-a, fact-finding, or other.',
    tools: [],
    temperature: 0.3,
  }),
  createNode('condition-1', 'condition', 1020, 230, {
    label: 'If',
    description: 'Route based on classification',
    expression: 'input.output_parsed.operating_procedure == "q-and-a"',
    trueLabel: 'Q&A',
    falseLabel: 'Else',
  }),
  createNode('agent-3', 'agent', 1310, 150, {
    label: 'Q&A',
    description: 'Handle question-answer requests',
    model: 'gpt-4o',
    instructions: 'You are a helpful Q&A assistant. Answer questions using the knowledge base.',
    tools: ['fileSearch'],
    temperature: 0.5,
  }),
  createNode('agent-4', 'agent', 1310, 350, {
    label: 'Fact finding',
    description: 'Handle fact-finding requests',
    model: 'gpt-4o',
    instructions: 'You are a fact-finding assistant. Research and verify facts using the knowledge base.',
    tools: ['fileSearch'],
    temperature: 0.3,
  }),
  createNode('end-1', 'end', 1580, 250, {
    label: 'End',
    description: 'Response delivered',
  }),
  createNode('note-1', 'note', 480, 80, {
    label: 'Note',
    text: 'Rewrite the user\'s question to be more specific and relevant to the knowledge base.',
    color: '#eab308',
  }),
  createNode('note-2', 'note', 970, 60, {
    label: 'Note',
    text: 'Based on the question asked, triage to a particular agent.',
    color: '#eab308',
  }),
  createNode('note-3', 'note', 1250, 60, {
    label: 'Note',
    text: 'Create additional sub-workflows to handle specialized requests.',
    color: '#eab308',
  }),
];

const homeworkHelperEdges: Edge[] = [
  { id: 'e-start-agent1', source: 'start-1', target: 'agent-1', type: 'smoothstep', animated: true },
  { id: 'e-agent1-setstate', source: 'agent-1', target: 'setState-1', type: 'smoothstep', animated: true },
  { id: 'e-setstate-agent2', source: 'setState-1', target: 'agent-2', type: 'smoothstep', animated: true },
  { id: 'e-agent2-condition', source: 'agent-2', target: 'condition-1', type: 'smoothstep', animated: true },
  { id: 'e-cond-qa', source: 'condition-1', target: 'agent-3', sourceHandle: 'true', type: 'smoothstep', animated: true, label: 'Q&A' },
  { id: 'e-cond-fact', source: 'condition-1', target: 'agent-4', sourceHandle: 'false', type: 'smoothstep', animated: true, label: 'Fact finding' },
  { id: 'e-qa-end', source: 'agent-3', target: 'end-1', type: 'smoothstep', animated: true },
  { id: 'e-fact-end', source: 'agent-4', target: 'end-1', type: 'smoothstep', animated: true },
];

export const TEMPLATE_HOMEWORK_HELPER: TemplateData = {
  id: 'homework-helper',
  name: 'Homework helper',
  description: 'A multi-agent workflow that rewrites queries, classifies them, and routes to specialized agents.',
  nodes: homeworkHelperNodes,
  edges: homeworkHelperEdges,
};

export const TEMPLATES: TemplateData[] = [TEMPLATE_HOMEWORK_HELPER];
