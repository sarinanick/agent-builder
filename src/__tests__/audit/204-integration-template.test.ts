import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 204 - Integration: load template', () => {
  it('should load template workflow', () => {
    const store = useFlowStore.getState()
    store.loadTemplate()

    const afterState = useFlowStore.getState()
    expect(afterState.nodes.length).toBeGreaterThan(0)
    expect(afterState.edges.length).toBeGreaterThan(0)
  })
})
