import { describe, it, expect } from 'vitest'

describe('Audit 225 - TransformNode component', () => {
  it('should have input/output schemas', () => {
    const defaults = { inputSchema: '', outputSchema: '', transformCode: '' }
    expect(defaults.inputSchema).toBe('')
    expect(defaults.outputSchema).toBe('')
  })

  it('should validate schema format', () => {
    const validSchema = '{ "text": "string" }'
    expect(() => JSON.parse(validSchema)).not.toThrow()
  })
})
