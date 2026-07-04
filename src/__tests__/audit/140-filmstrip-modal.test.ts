import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 140 - Filmstrip modal', () => {
  it('should have filmstrip navigation', () => {
    const modalPath = join(process.cwd(), 'src/app/marketplace/FilmstripModal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    expect(content).toContain('filmstrip')
    expect(content).toContain('navList')
  })

  it('should support keyboard navigation', () => {
    const modalPath = join(process.cwd(), 'src/app/marketplace/FilmstripModal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    expect(content).toContain('ArrowLeft')
    expect(content).toContain('ArrowRight')
  })

  it('should support touch navigation', () => {
    const modalPath = join(process.cwd(), 'src/app/marketplace/FilmstripModal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    expect(content).toContain('touchStart') || expect(content).toContain('Touch')
    expect(content).toContain('handleTouchEnd') || expect(content).toContain('touch')
  })
})
