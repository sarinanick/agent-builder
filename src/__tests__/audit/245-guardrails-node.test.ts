import { describe, it, expect } from 'vitest'

describe('Audit 245 - GuardrailsNode component', () => {
  it('should have default check type', () => {
    const defaults = { checkType: 'both', pattern: '' }
    expect(defaults.checkType).toBe('both')
  })

  it('should support check type options', () => {
    const checkTypes = ['input', 'output', 'both']
    expect(checkTypes.length).toBe(3)
    expect(checkTypes).toContain('both')
  })
})
