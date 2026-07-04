import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 214 - Edge case: max nodes', () => {
  it('should handle adding many nodes', () => {
    const store = useFlowStore.getState()
    const initial = store.nodes.length

    // Add 50 nodes
    for (let i = 0; i < 50; i++) {
      store.addNode('agent', { x: i * 100, y: 0 }, { label: `Node ${i}` })
    }

    expect(useFlowStore.getState().nodes.length).toBe(initial + 50)
  })

  it('should handle rapid undo/redo', () => {
    const store = useFlowStore.getState()

    // Add 10 nodes
    for (let i = 0; i < 10; i++) {
      store.addNode('agent', { x: i * 100, y: 0 }, { label: `Rapid ${i}` })
    }

    // Rapid undo
    for (let i = 0; i < 5; i++) {
      store.undo()
    }

    // Rapid redo
    for (let i = 0; i < 5; i++) {
      store.redo()
    }

    expect(useFlowStore.getState().nodes.length).toBeGreaterThan(0)
  })
})
