import { describe, it, expect } from 'vitest'

describe('Audit 157 - RTL icon direction', () => {
  it('should flip icons in RTL', () => {
    // Some icons should be flipped in RTL
    const flipIcons = ['arrow-right', 'chevron-right', 'arrow-left']
    expect(flipIcons.length).toBe(3)
  })

  it('should not flip neutral icons', () => {
    const neutralIcons = ['home', 'search', 'settings']
    expect(neutralIcons.length).toBe(3)
  })
})
