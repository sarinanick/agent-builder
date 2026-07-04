import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 203 - Integration: delete node', () => {
  it('should delete selected node', () => {
    const store = useFlowStore.getState()
    const initialCount = store.nodes.length

    // Add a node
    store.addNode('agent', { x: 0, y: 0 }, { label: 'Delete Test' })
    const newNodeId = useFlowStore.getState().nodes[useFlowStore.getState().nodes.length - 1].id

    // Select it
    useFlowStore.setState({
      nodes: useFlowStore.getState().nodes.map((n) =>
        n.id === newNodeId ? { ...n, selected: true } : n
      ),
    })

    // Delete
    useFlowStore.getState().deleteSelected()

    expect(useFlowStore.getState().nodes.length).toBe(initialCount)
  })
})
