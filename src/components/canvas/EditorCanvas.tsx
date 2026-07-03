'use client';

import {
  ReactFlow,
  Background,
  MiniMap,
  type NodeTypes,
  BackgroundVariant,
  type Node,
} from '@xyflow/react';
import { useCallback, useMemo } from 'react';
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as CustomNodeType;
      if (!type || !NODE_DEFINITIONS[type]) return;

      const flowContainer = document.querySelector('.react-flow');
      if (!flowContainer) return;

      const rect = flowContainer.getBoundingClientRect();
      const position = {
        x: (event.clientX - rect.left) / 1.2,
        y: (event.clientY - rect.top) / 1.2,
      };

      const data = defaultNodeData[type] || { label: type };
      addNode(type, position, data);
    },
    [addNode]
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
    const def = NODE_DEFINITIONS[node.type as CustomNodeType];
    return def?.color || '#666';
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
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(0,0,0,0.05)"
          className="!bg-zinc-100 dark:!bg-zinc-800 !border-zinc-200 dark:!border-zinc-700"
          pannable
          zoomable
        />
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
