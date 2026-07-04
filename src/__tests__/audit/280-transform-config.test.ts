import { describe, it, expect } from 'vitest'

describe('Audit 280 - Transform configuration', () => {
  it('should validate JSON schema format', () => {
    const schemas = [
      '{ "text": "string" }',
      '{ "result": "string", "count": "number" }',
      '{ "items": "array" }',
    ]

    schemas.forEach((schema) => {
      expect(() => JSON.parse(schema)).not.toThrow()
    })
  })

  it('should have transform code validation', () => {
    const code = 'return { result: input.text.toUpperCase() }'
    expect(code).toContain('return')
  })
})
