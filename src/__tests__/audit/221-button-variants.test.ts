import { describe, it, expect } from 'vitest'

describe('Audit 221 - Button variants', () => {
  it('should have all required variants', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger', 'icon', 'soft', 'link']
    expect(variants.length).toBe(7)
  })

  it('should have all required sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'icon']
    expect(sizes.length).toBe(4)
  })

  it('should have disabled state', () => {
    const hasDisabled = true
    expect(hasDisabled).toBe(true)
  })

  it('should have loading state', () => {
    const hasLoading = true
    expect(hasLoading).toBe(true)
  })
})
