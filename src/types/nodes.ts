export type NodeCategory = 'start-end' | 'agent' | 'tools' | 'logic' | 'data' | 'utility';

export type CustomNodeType =
  | 'start'
  | 'end'
  | 'agent'
  | 'note'
  | 'fileSearch'
  | 'guardrails'
  | 'mcp'
  | 'condition'
  | 'whileLoop'
  | 'humanApproval'
  | 'transform'
  | 'setState';

export interface BaseNodeData {
  label: string;
  description?: string;
  [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
  inputs: string[];
}

export interface EndNodeData extends BaseNodeData {
  outputs: string[];
}

export interface AgentNodeData extends BaseNodeData {
  model: string;
  instructions: string;
  tools: string[];
  temperature: number;
}

export interface NoteNodeData extends BaseNodeData {
  text: string;
  color: string;
}

export interface FileSearchNodeData extends BaseNodeData {
  vectorStoreId: string;
  topK: number;
  scoreThreshold: number;
}

export interface GuardrailsNodeData extends BaseNodeData {
  checkType: 'input' | 'output' | 'both';
  pattern: string;
}

export interface McpNodeData extends BaseNodeData {
  serverUrl: string;
  toolName: string;
  parameters: string;
}

export interface ConditionNodeData extends BaseNodeData {
  expression: string;
  trueLabel: string;
  falseLabel: string;
}

export interface WhileNodeData extends BaseNodeData {
  condition: string;
  maxIterations: number;
}

export interface HumanApprovalNodeData extends BaseNodeData {
  instructions: string;
  timeout: number;
}

export interface TransformNodeData extends BaseNodeData {
  inputSchema: string;
  outputSchema: string;
  transformCode: string;
}

export interface SetStateNodeData extends BaseNodeData {
  variables: { name: string; value: string; scope: string }[];
}

export type AllNodeData =
  | StartNodeData
  | EndNodeData
  | AgentNodeData
  | NoteNodeData
  | FileSearchNodeData
  | GuardrailsNodeData
  | McpNodeData
  | ConditionNodeData
  | WhileNodeData
  | HumanApprovalNodeData
  | TransformNodeData
  | SetStateNodeData;
