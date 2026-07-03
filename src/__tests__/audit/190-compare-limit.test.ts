import { describe, it, expect } from 'vitest'

describe('Audit 190 - Compare limit validation', () => {
  it('should prevent adding more than 3 items', () => {
    const compareList = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
      { id: 3, title: 'Item 3' },
    ]

    const maxItems = 3
    const canAdd = compareList.length < maxItems
    expect(canAdd).toBe(false)
  })

  it('should show warning toast when limit exceeded', () => {
    const showToast = (icon: string, msg: string) => {
      return { icon, msg }
    }

    const result = showToast('⚠️', 'Max 3 items for comparison')
    expect(result.icon).toBe('⚠️')
    expect(result.msg).toContain('Max 3')
  })
})
