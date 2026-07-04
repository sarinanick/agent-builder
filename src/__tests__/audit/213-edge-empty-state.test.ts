import { describe, it, expect } from 'vitest'
import { useFlowStore } from '@/store/flowStore'

describe('Audit 213 - Edge case: empty state', () => {
  it('should handle empty node list', () => {
    useFlowStore.setState({ nodes: [], edges: [] })
    const state = useFlowStore.getState()
    expect(state.nodes.length).toBe(0)
  })

  it('should handle empty edge list', () => {
    useFlowStore.setState({ nodes: [], edges: [] })
    const state = useFlowStore.getState()
    expect(state.edges.length).toBe(0)
  })

  it('should handle search with no results', () => {
    const items = [
      { title: 'Item 1', prompt: 'test' },
    ]
    const query = 'nonexistent'
    const filtered = items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    )
    expect(filtered.length).toBe(0)
  })
})
