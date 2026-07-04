import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 202 - Integration: undo/redo', () => {
  it('should undo last action', () => {
    const store = useFlowStore.getState()
    const initialCount = store.nodes.length

    // Add a node
    store.addNode('agent', { x: 0, y: 0 }, { label: 'Undo Test' })
    expect(useFlowStore.getState().nodes.length).toBe(initialCount + 1)

    // Undo
    store.undo()
    expect(useFlowStore.getState().nodes.length).toBe(initialCount)
  })

  it('should redo after undo', () => {
    const store = useFlowStore.getState()
    const initialCount = store.nodes.length

    // Add a node
    store.addNode('agent', { x: 0, y: 0 }, { label: 'Redo Test' })
    // Undo
    store.undo()
    // Redo
    store.redo()

    expect(useFlowStore.getState().nodes.length).toBe(initialCount + 1)
  })
})
