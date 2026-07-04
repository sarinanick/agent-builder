import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 370 - Theme final check', () => {
  it('should have dark and light themes', () => {
    const cssPath = join(process.cwd(), 'src/app/globals.css')
    const content = readFileSync(cssPath, 'utf-8')
    expect(content).toContain('.dark')
    expect(content).toContain(':root')
  })

  it('should have semantic color tokens', () => {
    const tokensPath = join(process.cwd(), 'src/styles/tokens.css')
    const content = readFileSync(tokensPath, 'utf-8')
    expect(content).toContain('--surface-canvas')
    expect(content).toContain('--text-primary')
    expect(content).toContain('--accent-primary')
  })

  it('should have reduced motion support', () => {
    const tokensPath = join(process.cwd(), 'src/styles/tokens.css')
    const content = readFileSync(tokensPath, 'utf-8')
    expect(content).toContain('prefers-reduced-motion')
  })
})
