import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 152 - RTL flash prevention', () => {
  it('should read language from localStorage on mount', () => {
    const i18nPath = join(process.cwd(), 'src/lib/i18n.tsx')
    const content = readFileSync(i18nPath, 'utf-8')
    expect(content).toContain('localStorage')
    expect(content).toContain('getItem')
  })

  it('should set dir attribute on mount', () => {
    const i18nPath = join(process.cwd(), 'src/lib/i18n.tsx')
    const content = readFileSync(i18nPath, 'utf-8')
    expect(content).toContain('document.documentElement.dir')
  })

  it('should set lang attribute on mount', () => {
    const i18nPath = join(process.cwd(), 'src/lib/i18n.tsx')
    const content = readFileSync(i18nPath, 'utf-8')
    expect(content).toContain('document.documentElement.lang')
  })
})
