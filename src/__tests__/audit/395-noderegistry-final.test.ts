import { describe, it, expect } from 'vitest'
import { NODE_REGISTRY } from '@/lib/nodeRegistry'

describe('Audit 395 - Node registry final check', () => {
  it('should have all 12 node types', () => {
    const types = Object.keys(NODE_REGISTRY)
    expect(types.length).toBe(12)
  })

  it('each node should have component', () => {
    Object.values(NODE_REGISTRY).forEach((node) => {
      expect(node.component).toBeDefined()
    })
  })

  it('each node should have panel', () => {
    Object.values(NODE_REGISTRY).forEach((node) => {
      expect(node.panel).toBeDefined()
    })
  })

  it('each node should have defaults', () => {
    Object.values(NODE_REGISTRY).forEach((node) => {
      expect(node.defaults).toBeDefined()
    })
  })
})
