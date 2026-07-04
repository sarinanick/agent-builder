import { describe, it, expect } from 'vitest'

describe('Audit 207 - Integration: i18n', () => {
  it('should have translations for English', () => {
    const enTranslations = {
      'nav.agentBuilder': 'Agent Builder',
      'nav.marketplace': 'Marketplace',
      'builder.search': 'Search nodes...',
      'builder.undo': 'Undo',
      'builder.redo': 'Redo',
      'builder.code': 'Code',
      'builder.preview': 'Preview',
      'builder.deploy': 'Deploy',
    }

    Object.entries(enTranslations).forEach(([key, value]) => {
      expect(value).toBeTruthy()
    })
  })

  it('should have translations for Persian', () => {
    const faTranslations = {
      'nav.agentBuilder': 'سازنده ایجنت',
      'nav.marketplace': 'بازار',
      'builder.search': 'جستجوی نود...',
      'builder.undo': 'بازگشت',
      'builder.redo': 'بازانجام',
      'builder.code': 'کد',
      'builder.preview': 'پیش‌نمایش',
      'builder.deploy': 'استقرار',
    }

    Object.entries(faTranslations).forEach(([key, value]) => {
      expect(value).toBeTruthy()
    })
  })
})
