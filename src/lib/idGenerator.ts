import { nanoid } from 'nanoid';

export function generateNodeId(): string {
  return `node_${nanoid(8)}`;
}

export function generateEdgeId(): string {
  return `edge_${nanoid(8)}`;
}
