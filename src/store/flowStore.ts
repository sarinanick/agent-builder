import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { TEMPLATE_HOMEWORK_HELPER } from '@/constants/templates';
import type { CustomNodeType, AllNodeData } from '@/types/nodes';
import { generateNodeId } from '@/lib/idGenerator';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (type: CustomNodeType, position: { x: number; y: number }, data?: Partial<AllNodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<AllNodeData>) => void;
  deleteSelected: () => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  loadTemplate: () => void;
  undo: () => void;
  redo: () => void;
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  canUndo: boolean;
  canRedo: boolean;
}

function pushToHistory(state: FlowState): { past: typeof state.past; future: typeof state.future } {
  const snapshot = { nodes: state.nodes, edges: state.edges };
  const past = [...state.past, snapshot].slice(-50);
  return { past, future: [] };
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  onNodesChange: (changes) => {
    const state = get();
    const { past, future } = pushToHistory(state);
    set({
      nodes: applyNodeChanges(changes, state.nodes) as Node[],
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  onEdgesChange: (changes) => {
    const state = get();
    const { past, future } = pushToHistory(state);
    set({
      edges: applyEdgeChanges(changes, state.edges),
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  onConnect: (connection) => {
    const state = get();
    const { past, future } = pushToHistory(state);
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, state.edges),
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  addNode: (type, position, data) => {
    const state = get();
    const { past, future } = pushToHistory(state);
    const newNode: Node = {
      id: generateNodeId(),
      type,
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), ...data },
    };
    set({
      nodes: [...state.nodes, newNode],
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  updateNodeData: (nodeId, data) => {
    const state = get();
    const { past, future } = pushToHistory(state);
    set({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  deleteSelected: () => {
    const state = get();
    const { past, future } = pushToHistory(state);
    set({
      nodes: state.nodes.filter((n) => n.selected !== true),
      edges: state.edges.filter((e) => e.selected !== true),
      past,
      future,
      canUndo: true,
      canRedo: false,
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  loadTemplate: () => {
    set({
      nodes: TEMPLATE_HOMEWORK_HELPER.nodes,
      edges: TEMPLATE_HOMEWORK_HELPER.edges,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
      canUndo: newPast.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
  },
}));
