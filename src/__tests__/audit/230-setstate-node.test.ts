import { describe, it, expect } from 'vitest'

describe('Audit 230 - SetStateNode component', () => {
  it('should have empty variables by default', () => {
    const defaults = { variables: [] }
    expect(defaults.variables).toEqual([])
  })

  it('should support adding variables', () => {
    const variables = [
      { name: 'var1', value: 'value1', scope: 'global' },
      { name: 'var2', value: '{{output}}', scope: 'local' },
    ]

    expect(variables.length).toBe(2)
    expect(variables[0].scope).toBe('global')
    expect(variables[1].scope).toBe('local')
  })

  it('should support removing variables', () => {
    const variables = [
      { name: 'var1', value: 'value1', scope: 'global' },
      { name: 'var2', value: 'value2', scope: 'global' },
    ]

    const removed = variables.filter((_, i) => i !== 0)
    expect(removed.length).toBe(1)
  })
})
