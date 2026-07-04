import { describe, it, expect } from 'vitest'
import { NODE_REGISTRY, getNodeDefaults, getNodeComponent, getNodePanel } from '@/lib/nodeRegistry'

describe('Audit 206 - Integration: node registry', () => {
  it('should get defaults for any node type', () => {
    const agentDefaults = getNodeDefaults('agent')
    expect(agentDefaults).toBeDefined()
    expect(agentDefaults.label).toBe('Agent')
  })

  it('should get component for any node type', () => {
    const agentComponent = getNodeComponent('agent')
    expect(agentComponent).toBeDefined()
  })

  it('should get panel for any node type', () => {
    const agentPanel = getNodePanel('agent')
    expect(agentPanel).toBeDefined()
  })

  it('should have all node types in registry', () => {
    const types = Object.keys(NODE_REGISTRY)
    expect(types.length).toBe(12)
  })
})
