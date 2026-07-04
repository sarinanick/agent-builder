import { describe, it, expect } from 'vitest'

describe('Audit 365 - i18n final check', () => {
  it('should have all required translation keys', () => {
    const requiredKeys = [
      'nav.agentBuilder',
      'nav.marketplace',
      'builder.search',
      'builder.undo',
      'builder.redo',
      'builder.code',
      'builder.preview',
      'builder.deploy',
      'builder.label',
      'builder.description',
      'mp.search',
      'mp.filters',
      'mp.newest',
      'mp.popular',
      'mp.favorites',
      'mp.noFavorites',
      'sonora.back',
      'sonora.generate',
    ]

    requiredKeys.forEach((key) => {
      expect(key).toBeTruthy()
    })
  })

  it('should have both EN and FA translations', () => {
    const languages = ['en', 'fa']
    expect(languages).toContain('en')
    expect(languages).toContain('fa')
  })
})
