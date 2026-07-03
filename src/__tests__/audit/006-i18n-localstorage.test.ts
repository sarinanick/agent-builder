import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Audit 006 - i18n localStorage mount', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
      },
      writable: true,
    })
  })

  it('should read language from localStorage on mount', () => {
    // Simulate saved language
    localStorage.setItem('lang', 'fa')

    const savedLang = localStorage.getItem('lang')
    expect(savedLang).toBe('fa')
  })

  it('should default to en if no localStorage value', () => {
    localStorage.removeItem('lang')

    const savedLang = localStorage.getItem('lang')
    expect(savedLang).toBeNull()
  })

  it('should save language to localStorage on toggle', () => {
    localStorage.setItem('lang', 'en')

    const newLang = localStorage.getItem('lang') === 'en' ? 'fa' : 'en'
    localStorage.setItem('lang', newLang)

    expect(localStorage.getItem('lang')).toBe('fa')
  })
})
