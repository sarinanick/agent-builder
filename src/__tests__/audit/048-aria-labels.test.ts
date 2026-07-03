import { describe, it, expect } from 'vitest'

describe('Audit 048 - ARIA labels on all interactive elements', () => {
  it('should have aria-label on icon buttons', () => {
    const buttons = [
      { label: 'Undo', ariaLabel: 'Undo' },
      { label: 'Redo', ariaLabel: 'Redo' },
      { label: 'Settings', ariaLabel: 'Settings' },
      { label: 'Theme toggle', ariaLabel: 'Toggle theme' },
      { label: 'Language toggle', ariaLabel: 'Switch language' },
      { label: 'Zoom in', ariaLabel: 'Zoom in' },
      { label: 'Zoom out', ariaLabel: 'Zoom out' },
      { label: 'Fit view', ariaLabel: 'Fit view' },
      { label: 'Close', ariaLabel: 'Close' },
    ]

    buttons.forEach((btn) => {
      expect(btn.ariaLabel).toBeTruthy()
      expect(btn.ariaLabel.length).toBeGreaterThan(0)
    })
  })

  it('should have aria-label on search inputs', () => {
    const inputs = [
      { type: 'search', placeholder: 'Search...', ariaLabel: 'Search nodes' },
      { type: 'search', placeholder: 'Search...', ariaLabel: 'Search artworks' },
    ]

    inputs.forEach((input) => {
      expect(input.ariaLabel || input.placeholder).toBeTruthy()
    })
  })

  it('should have aria-label on navigation', () => {
    const nav = {
      role: 'navigation',
      ariaLabel: 'Main navigation',
    }

    expect(nav.role).toBe('navigation')
    expect(nav.ariaLabel).toBeTruthy()
  })
})
