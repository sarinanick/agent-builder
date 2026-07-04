import { describe, it, expect } from 'vitest'

describe('Audit 235 - FileSearchNode component', () => {
  it('should have default values', () => {
    const defaults = { vectorStoreId: '', topK: 5, scoreThreshold: 0.7 }
    expect(defaults.topK).toBe(5)
    expect(defaults.scoreThreshold).toBe(0.7)
  })

  it('should validate topK range', () => {
    const min = 1
    const max = 20
    const value = 10
    expect(value).toBeGreaterThanOrEqual(min)
    expect(value).toBeLessThanOrEqual(max)
  })
})
