import { describe, it, expect } from 'vitest'
import { useUIStore } from '@/store/uiStore'

describe('Audit 201 - Integration: search functionality', () => {
  it('should update search query', () => {
    const store = useUIStore.getState()
    store.setSearchQuery('test query')

    const afterState = useUIStore.getState()
    expect(afterState.searchQuery).toBe('test query')
  })

  it('should clear search query', () => {
    const store = useUIStore.getState()
    store.setSearchQuery('')

    const afterState = useUIStore.getState()
    expect(afterState.searchQuery).toBe('')
  })
})
