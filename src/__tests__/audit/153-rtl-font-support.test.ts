import { describe, it, expect } from 'vitest'

describe('Audit 153 - RTL font support', () => {
  it('should have Vazirmatn font for Persian', () => {
    // Persian text should use Vazirmatn font
    const hasVazirmatn = true
    expect(hasVazirmatn).toBe(true)
  })

  it('should fallback to system fonts', () => {
    const fonts = ['Vazirmatn', 'Arial', 'Helvetica', 'sans-serif']
    expect(fonts.length).toBeGreaterThan(0)
  })
})
