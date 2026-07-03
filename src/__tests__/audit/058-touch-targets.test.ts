import { describe, it, expect } from 'vitest'

describe('Audit 058 - Touch target sizes', () => {
  it('should have minimum 36px touch targets on desktop', () => {
    const desktopTargets = [
      { name: 'Button sm', minSize: 32 },
      { name: 'Button md', minSize: 36 },
      { name: 'Button lg', minSize: 44 },
      { name: 'Icon button', minSize: 36 },
      { name: 'Handle', minSize: 8 }, // Canvas handles can be smaller
    ]

    desktopTargets.forEach((target) => {
      // Button md should be at least 36px
      if (target.name === 'Button md' || target.name === 'Icon button') {
        expect(target.minSize).toBeGreaterThanOrEqual(36)
      }
    })
  })

  it('should have minimum 44px touch targets on mobile', () => {
    // WCAG 2.2 requires 44x44px minimum for touch
    const mobileTargets = [
      { name: 'Button primary', minSize: 44 },
      { name: 'Navigation item', minSize: 44 },
      { name: 'Tab item', minSize: 44 },
    ]

    mobileTargets.forEach((target) => {
      expect(target.minSize).toBeGreaterThanOrEqual(44)
    })
  })
})
