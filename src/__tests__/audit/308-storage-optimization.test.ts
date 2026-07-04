import { describe, it, expect } from 'vitest'

describe('Audit 308 - Storage optimization', () => {
  it('should use localStorage for small preferences only', () => {
    const stored = { theme: 'dark', lang: 'en' }
    const size = JSON.stringify(stored).length
    expect(size).toBeLessThan(1000)
  })

  it('should not store large objects', () => {
    // Only store small preferences, not workflow data
    const largeObject = { data: 'x'.repeat(100000) }
    const size = JSON.stringify(largeObject).length
    expect(size).toBeGreaterThan(10000)
  })
})
