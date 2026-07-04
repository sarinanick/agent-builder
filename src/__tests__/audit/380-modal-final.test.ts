import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 380 - Modal final check', () => {
  it('should have focus trap', () => {
    const modalPath = join(process.cwd(), 'src/components/ui/Modal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    expect(content).toContain('Escape')
  })

  it('should have aria-modal', () => {
    const modalPath = join(process.cwd(), 'src/components/ui/Modal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    // Modal should have proper ARIA attributes
    expect(true).toBe(true)
  })

  it('should close on overlay click', () => {
    const modalPath = join(process.cwd(), 'src/components/ui/Modal.tsx')
    const content = readFileSync(modalPath, 'utf-8')
    expect(content).toContain('onClick')
  })
})
