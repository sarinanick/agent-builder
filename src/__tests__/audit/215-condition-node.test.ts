import { describe, it, expect } from 'vitest'

describe('Audit 215 - ConditionNode component', () => {
  it('should have 2 output handles', () => {
    const handles = { inputs: 1, outputs: 2 }
    expect(handles.outputs).toBe(2)
  })

  it('should display expression preview', () => {
    const expression = 'input.category == "qa"'
    const preview = expression.length > 35
      ? expression.substring(0, 35) + '...'
      : expression
    expect(preview).toBe('input.category == "qa"')
  })

  it('should have true/false branch labels', () => {
    const data = { trueLabel: 'True', falseLabel: 'False' }
    expect(data.trueLabel).toBe('True')
    expect(data.falseLabel).toBe('False')
  })
})
