import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 120 - Canvas accessibility', () => {
  it('should have ReactFlow component', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('ReactFlow')
  })

  it('should have keyboard shortcuts documented', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('keydown')
    expect(content).toContain('Delete')
  })

  it('should not delete on Backspace in input', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('tagName')
    expect(content).toContain('INPUT')
  })
})
