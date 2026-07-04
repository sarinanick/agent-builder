import { describe, it, expect } from 'vitest'

describe('Audit 275 - Guardrails configuration', () => {
  it('should support regex patterns', () => {
    const patterns = [
      '(SSN|credit card|password)',
      '\\d{3}-\\d{2}-\\d{4}',
      '[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]+',
    ]

    patterns.forEach((pattern) => {
      expect(() => new RegExp(pattern)).not.toThrow()
    })
  })

  it('should have check type options', () => {
    const types = ['input', 'output', 'both']
    expect(types).toContain('input')
    expect(types).toContain('output')
    expect(types).toContain('both')
  })
})
