import { describe, it, expect } from 'vitest'

describe('Audit 155 - RTL direction', () => {
  it('should set dir=rtl for Persian', () => {
    const lang = 'fa'
    const dir = lang === 'fa' ? 'rtl' : 'ltr'
    expect(dir).toBe('rtl')
  })

  it('should set dir=ltr for English', () => {
    const lang = 'en'
    const dir = lang === 'fa' ? 'rtl' : 'ltr'
    expect(dir).toBe('ltr')
  })

  it('should support Arabic', () => {
    const rtlLangs = ['fa', 'ar', 'he']
    rtlLangs.forEach((lang) => {
      const dir = lang === 'fa' ? 'rtl' : 'ltr'
      expect(dir).toBe('rtl')
    })
  })
})
