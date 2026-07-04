import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 216 - Edge case: concurrent actions', () => {
  it('should handle simultaneous add and delete', () => {
    const store = useFlowStore.getState()
    const initial = store.nodes.length

    // Add nodes
    store.addNode('agent', { x: 0, y: 0 }, { label: 'Concurrent 1' })
    store.addNode('agent', { x: 100, y: 0 }, { label: 'Concurrent 2' })

    // Delete one
    const nodes = useFlowStore.getState().nodes
    const lastNodeId = nodes[nodes.length - 1].id
    useFlowStore.setState({
      nodes: nodes.map((n) => n.id === lastNodeId ? { ...n, selected: true } : n),
    })
    useFlowStore.getState().deleteSelected()

    expect(useFlowStore.getState().nodes.length).toBe(initial + 1)
  })
})
