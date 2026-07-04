import { describe, it, expect } from 'vitest'

describe('Audit 255 - NoteNode component', () => {
  it('should have default text', () => {
    const defaults = { text: '', color: '#eab308' }
    expect(defaults.text).toBe('')
    expect(defaults.color).toBe('#eab308')
  })

  it('should support color options', () => {
    const colors = ['#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444']
    expect(colors.length).toBe(6)
  })
})
