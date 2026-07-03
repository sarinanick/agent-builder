import { describe, it, expect } from 'vitest'
import { NODE_REGISTRY } from '@/lib/nodeRegistry'

describe('Audit 090 - Node registry completeness', () => {
  it('should have all 12 node types registered', () => {
    const expectedTypes = [
      'start', 'end', 'agent', 'condition', 'fileSearch',
      'guardrails', 'mcp', 'whileLoop', 'humanApproval',
      'transform', 'setState', 'note',
    ]

    expectedTypes.forEach((type) => {
      expect(NODE_REGISTRY[type]).toBeDefined()
    })
  })

  it('each node should have required fields', () => {
    Object.values(NODE_REGISTRY).forEach((node) => {
      expect(node.type).toBeTruthy()
      expect(node.component).toBeDefined()
      expect(node.panel).toBeDefined()
      expect(node.icon).toBeTruthy()
      expect(node.colorToken).toBeTruthy()
      expect(node.category).toBeTruthy()
      expect(node.handles).toBeDefined()
      expect(node.defaults).toBeDefined()
    })
  })

  it('start node should have no inputs', () => {
    const start = NODE_REGISTRY['start']
    expect(start.handles.filter((h) => h.type === 'target').length).toBe(0)
  })

  it('end node should have no outputs', () => {
    const end = NODE_REGISTRY['end']
    expect(end.handles.filter((h) => h.type === 'source').length).toBe(0)
  })

  it('condition node should have 2 outputs', () => {
    const condition = NODE_REGISTRY['condition']
    expect(condition.handles.filter((h) => h.type === 'source').length).toBe(2)
  })
})
