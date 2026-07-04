import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'
import { useUIStore } from '@/store/uiStore'

describe('Audit 212 - Integration: store operations', () => {
  it('should add and remove nodes', () => {
    const store = useFlowStore.getState()
    const initial = store.nodes.length

    store.addNode('start', { x: 0, y: 0 }, { label: 'Test' })
    expect(useFlowStore.getState().nodes.length).toBe(initial + 1)

    store.undo()
    expect(useFlowStore.getState().nodes.length).toBe(initial)
  })

  it('should update node data', () => {
    const store = useFlowStore.getState()
    store.addNode('agent', { x: 0, y: 0 }, { label: 'Original' })

    const nodeId = useFlowStore.getState().nodes[useFlowStore.getState().nodes.length - 1].id
    store.updateNodeData(nodeId, { label: 'Updated' })

    const updatedNode = useFlowStore.getState().nodes.find((n) => n.id === nodeId)
    expect(updatedNode?.data.label).toBe('Updated')
  })

  it('should manage UI state', () => {
    const store = useUIStore.getState()
    store.setSelectedNodeId('test-123')
    expect(useUIStore.getState().selectedNodeId).toBe('test-123')

    store.setSelectedNodeId(null)
    expect(useUIStore.getState().selectedNodeId).toBeNull()
  })
})
