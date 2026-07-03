import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 080 - Store history management', () => {
  it('should have undo/redo capability', () => {
    const store = useFlowStore.getState()
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
  })

  it('should track canUndo/canRedo state', () => {
    const state = useFlowStore.getState()
    expect(typeof state.canUndo).toBe('boolean')
    expect(typeof state.canRedo).toBe('boolean')
  })

  it('should have loadTemplate function', () => {
    const store = useFlowStore.getState()
    expect(typeof store.loadTemplate).toBe('function')
  })

  it('should have deleteSelected function', () => {
    const store = useFlowStore.getState()
    expect(typeof store.deleteSelected).toBe('function')
  })
})
