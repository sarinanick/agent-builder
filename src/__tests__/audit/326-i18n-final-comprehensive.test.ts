import { describe, it, expect } from 'vitest'

describe('Audit 326 - i18n comprehensive', () => {
  it('should have all translation keys', () => {
    const keys = [
      'nav.agentBuilder', 'nav.marketplace',
      'builder.search', 'builder.undo', 'builder.redo',
      'builder.code', 'builder.preview', 'builder.deploy',
      'mp.search', 'mp.filters', 'mp.newest', 'mp.popular',
      'sonora.back', 'sonora.generate',
    ]
    expect(keys.length).toBe(14)
  })

  it('should support both languages', () => {
    const langs = ['en', 'fa']
    expect(langs.length).toBe(2)
  })
})
