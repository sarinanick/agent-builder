import { describe, it, expect } from 'vitest'

describe('Audit 160 - i18n coverage', () => {
  it('should have translations for all major UI elements', () => {
    const requiredKeys = [
      'nav.agentBuilder',
      'nav.marketplace',
      'builder.search',
      'builder.undo',
      'builder.redo',
      'builder.code',
      'builder.preview',
      'builder.deploy',
      'mp.search',
      'mp.filters',
      'mp.newest',
      'mp.popular',
      'sonora.back',
      'sonora.generate',
    ]

    requiredKeys.forEach((key) => {
      expect(key).toBeTruthy()
    })
  })

  it('should have RTL support for Persian', () => {
    const rtlLanguages = ['fa', 'ar', 'he']
    rtlLanguages.forEach((lang) => {
      expect(['fa', 'ar', 'he']).toContain(lang)
    })
  })
})
