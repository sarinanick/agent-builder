'use client';

import {
  ReactFlow,
  Background,
  MiniMap,
  type NodeTypes,
  BackgroundVariant,
  type Node,
  useReactFlow,
} from '@xyflow/react';
import { useCallback } from 'react';
import { useFlowStore } from '@/store/flowStore';
import { useUIStore } from '@/store/uiStore';
import { NODE_DEFINITIONS } from '@/constants/nodeTypes';
import type { CustomNodeType } from '@/types/nodes';
import { generateNodeId } from '@/lib/idGenerator';

// Node components
import StartNode from '@/components/nodes/StartNode';
import EndNode from '@/components/nodes/EndNode';
import AgentNode from '@/components/nodes/AgentNode';
import NoteNode from '@/components/nodes/NoteNode';
import FileSearchNode from '@/components/nodes/FileSearchNode';
import GuardrailsNode from '@/components/nodes/GuardrailsNode';
import McpNode from '@/components/nodes/McpNode';
import ConditionNode from '@/components/nodes/ConditionNode';
import WhileNode from '@/components/nodes/WhileNode';
import HumanApprovalNode from '@/components/nodes/HumanApprovalNode';
import TransformNode from '@/components/nodes/TransformNode';
import SetStateNode from '@/components/nodes/SetStateNode';

import CanvasControls from './CanvasControls';

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  agent: AgentNode,
  note: NoteNode,
  fileSearch: FileSearchNode,
  guardrails: GuardrailsNode,
  mcp: McpNode,
  condition: ConditionNode,
  whileLoop: WhileNode,
  humanApproval: HumanApprovalNode,
  transform: TransformNode,
  setState: SetStateNode,
};

const defaultNodeData: Record<CustomNodeType, Record<string, unknown>> = {
  start: { label: 'Start', description: 'Workflow entry point' },
  end: { label: 'End', description: 'Workflow termination' },
  agent: {
    label: 'Agent',
    description: 'AI agent',
    model: 'gpt-4o',
    instructions: '',
    tools: [],
    temperature: 0.7,
  },
  note: { label: 'Note', text: 'Write a note...', color: '#eab308' },
  fileSearch: {
    label: 'File Search',
    description: 'Retrieve from vector store',
    vectorStoreId: '',
    topK: 5,
    scoreThreshold: 0.7,
  },
  guardrails: {
    label: 'Guardrails',
    description: 'Safety check',
    checkType: 'both',
    pattern: '',
  },
  mcp: {
    label: 'MCP',
    description: 'External tool',
    serverUrl: '',
    toolName: '',
    parameters: '',
  },
  condition: {
    label: 'If',
    description: 'Conditional branching',
    expression: '',
    trueLabel: 'True',
    falseLabel: 'False',
  },
  whileLoop: {
    label: 'While',
    description: 'Loop with condition',
    condition: '',
    maxIterations: 10,
  },
  humanApproval: {
    label: 'Human Approval',
    description: 'Wait for review',
    instructions: '',
    timeout: 300,
  },
  transform: {
    label: 'Transform',
    description: 'Reshape data',
    inputSchema: '',
    outputSchema: '',
    transformCode: '',
  },
  setState: {
    label: 'Set State',
    description: 'Update global variables',
    variables: [],
  },
};

export default function EditorCanvas() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as CustomNodeType;
      if (!type || !NODE_DEFINITIONS[type]) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const data = defaultNodeData[type] || { label: type };
      addNode(type, position, data);
    },
    [addNode, screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const minimapNodeColor = (node: Node) => {
    const colors: Record<string, string> = {
      start: '#30d158',
      end: '#30d158',
      agent: '#bf5af2',
      fileSearch: '#ff9f0a',
      guardrails: '#ff9f0a',
      mcp: '#ff9f0a',
      condition: '#ff9f0a',
      whileLoop: '#ff9f0a',
      humanApproval: '#ff9f0a',
      transform: '#0a84ff',
      setState: '#0a84ff',
      note: '#8e8e93',
    };
    return colors[node.type as string] || '#666';
  };

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(0,0,0,0.05)"
          pannable
          zoomable
        />
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
