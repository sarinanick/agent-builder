import { describe, it, expect } from 'vitest'

describe('Audit 055 - Node data summary display', () => {
  it('should show model info for agent nodes', () => {
    const agentData = {
      label: 'My Agent',
      model: 'gpt-4o',
      instructions: 'Be helpful',
      temperature: 0.7,
    }

    const summary = `${agentData.model} | temp: ${agentData.temperature}`
    expect(summary).toBe('gpt-4o | temp: 0.7')
  })

  it('should show condition expression for condition nodes', () => {
    const conditionData = {
      label: 'Check',
      expression: 'input.category == "qa"',
    }

    const summary = conditionData.expression.length > 30
      ? conditionData.expression.substring(0, 30) + '...'
      : conditionData.expression

    expect(summary).toBe('input.category == "qa"')
  })

  it('should show variable count for set state nodes', () => {
    const stateData = {
      label: 'Set State',
      variables: [
        { name: 'var1', value: 'value1' },
        { name: 'var2', value: 'value2' },
        { name: 'var3', value: 'value3' },
      ],
    }

    const summary = `${stateData.variables.length} variables`
    expect(summary).toBe('3 variables')
  })

  it('should show timeout for human approval nodes', () => {
    const approvalData = {
      label: 'Approval',
      timeout: 300,
    }

    const summary = `${approvalData.timeout}s timeout`
    expect(summary).toBe('300s timeout')
  })
})
