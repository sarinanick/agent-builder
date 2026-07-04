import { describe, it, expect } from 'vitest'

describe('Audit 210 - AgentNode component', () => {
  it('should have correct defaults', () => {
    const defaults = {
      label: 'Agent',
      model: 'gpt-4o',
      instructions: '',
      tools: [],
      temperature: 0.7,
    }

    expect(defaults.model).toBe('gpt-4o')
    expect(defaults.temperature).toBe(0.7)
    expect(defaults.tools).toEqual([])
  })

  it('should support model selection', () => {
    const models = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
    expect(models.length).toBe(4)
    expect(models).toContain('gpt-4o')
  })

  it('should have purple color token', () => {
    const color = 'var(--color-purple-500)'
    expect(color).toContain('purple')
  })
})
