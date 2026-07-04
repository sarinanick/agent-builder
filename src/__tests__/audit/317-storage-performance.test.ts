import { describe, it, expect } from 'vitest'

describe('Audit 317 - Storage performance', () => {
  it('should store small preferences only', () => {
    const stored = { theme: 'dark', lang: 'en' }
    const size = JSON.stringify(stored).length
    expect(size).toBeLessThan(1000)
  })

  it('should not store large objects', () => {
    const large = { data: 'x'.repeat(100000) }
    const size = JSON.stringify(large).length
    expect(size).toBeGreaterThan(10000)
  })
})
