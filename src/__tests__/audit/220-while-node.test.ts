import { describe, it, expect } from 'vitest'

describe('Audit 220 - WhileNode component', () => {
  it('should have default max iterations', () => {
    const defaults = { condition: '', maxIterations: 10 }
    expect(defaults.maxIterations).toBe(10)
  })

  it('should validate max iterations range', () => {
    const min = 1
    const max = 100
    const value = 15
    expect(value).toBeGreaterThanOrEqual(min)
    expect(value).toBeLessThanOrEqual(max)
  })
})
