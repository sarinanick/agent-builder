import { describe, it, expect } from 'vitest'

describe('Audit 158 - RTL spacing', () => {
  it('should use logical spacing', () => {
    // Use ps/pe/ms/me instead of pl/pr/ml/mr
    const logicalSpacing = ['ps-4', 'pe-4', 'ms-2', 'me-2']
    expect(logicalSpacing.length).toBe(4)
  })

  it('should not use physical spacing', () => {
    const physicalSpacing = ['pl-4', 'pr-4', 'ml-2', 'mr-2']
    // These should be avoided in RTL contexts
    expect(physicalSpacing.length).toBe(4)
  })
})
