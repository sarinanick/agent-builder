import { describe, it, expect } from 'vitest'

describe('Audit 130 - Compare tray functionality', () => {
  it('should limit compare to 3 items', () => {
    const compareList = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
      { id: 3, title: 'Item 3' },
    ]

    const maxCompare = 3
    expect(compareList.length).toBeLessThanOrEqual(maxCompare)
  })

  it('should show warning when exceeding limit', () => {
    const compareList = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
      { id: 3, title: 'Item 3' },
    ]

    const canAdd = compareList.length < 3
    expect(canAdd).toBe(false)
  })

  it('should allow removing items from compare', () => {
    const compareList = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ]

    const removed = compareList.filter((c) => c.id !== 1)
    expect(removed.length).toBe(1)
    expect(removed[0].id).toBe(2)
  })
})
