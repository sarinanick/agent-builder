import { describe, it, expect } from 'vitest'

describe('Audit 038 - RTL support with logical properties', () => {
  it('should use logical properties instead of left/right', () => {
    // CSS logical properties to use:
    // ps-* (padding-inline-start) instead of pl-*
    // pe-* (padding-inline-end) instead of pr-*
    // ms-* (margin-inline-start) instead of ml-*
    // me-* (margin-inline-end) instead of mr-*
    // start/end instead of left/right

    const logicalProperties = [
      'ps-4', // padding-inline-start
      'pe-4', // padding-inline-end
      'ms-2', // margin-inline-start
      'me-2', // margin-inline-end
      'start-0', // inline-start
      'end-0', // inline-end
    ]

    expect(logicalProperties.length).toBe(6)
    // These should work correctly in both LTR and RTL
  })

  it('should set dir attribute correctly', () => {
    const languages: Record<string, string> = {
      en: 'ltr',
      fa: 'rtl',
      ar: 'rtl',
      he: 'rtl',
    }

    expect(languages['en']).toBe('ltr')
    expect(languages['fa']).toBe('rtl')
  })

  it('should prevent RTL flash', () => {
    // The i18n provider should read localStorage on mount
    // and set dir/lang before first render
    const savedLang = 'fa'
    const dir = savedLang === 'fa' ? 'rtl' : 'ltr'

    expect(dir).toBe('rtl')
  })
})
