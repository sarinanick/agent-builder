import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'
import { useUIStore } from '@/store/uiStore'

describe('Audit 200 - Integration: workflow creation', () => {
  it('should add a node to the canvas', () => {
    const store = useFlowStore.getState()
    const initialCount = store.nodes.length

    store.addNode('agent', { x: 100, y: 100 }, { label: 'Test Agent' })

    const afterState = useFlowStore.getState()
    expect(afterState.nodes.length).toBe(initialCount + 1)
  })

  it('should select a node', () => {
    const store = useUIStore.getState()
    store.setSelectedNodeId('test-node')

    const afterState = useUIStore.getState()
    expect(afterState.selectedNodeId).toBe('test-node')
  })

  it('should deselect a node', () => {
    const store = useUIStore.getState()
    store.setSelectedNodeId(null)

    const afterState = useUIStore.getState()
    expect(afterState.selectedNodeId).toBeNull()
  })
})
