import { describe, it, expect, beforeEach } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 024 - deleteSelected by selectedNodeId', () => {
  beforeEach(() => {
    useFlowStore.setState({
      nodes: [
        { id: 'node-1', type: 'agent', position: { x: 0, y: 0 }, data: { label: 'Test 1' } },
        { id: 'node-2', type: 'start', position: { x: 200, y: 0 }, data: { label: 'Test 2' } },
      ],
      edges: [],
    })
  })

  it('should delete only the selected node', () => {
    const store = useFlowStore.getState()

    // Set selectedNodeId
    useFlowStore.setState({
      nodes: store.nodes.map((n) => ({
        ...n,
        selected: n.id === 'node-1' ? true : false,
      })),
    })

    // Call deleteSelected
    store.deleteSelected()

    const afterState = useFlowStore.getState()
    expect(afterState.nodes.length).toBe(1)
    expect(afterState.nodes[0].id).toBe('node-2')
  })

  it('should not delete any node if none selected', () => {
    const beforeState = useFlowStore.getState()
    beforeState.deleteSelected()

    const afterState = useFlowStore.getState()
    expect(afterState.nodes.length).toBe(beforeState.nodes.length)
  })
})
