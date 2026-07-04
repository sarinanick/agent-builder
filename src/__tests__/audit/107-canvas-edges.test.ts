import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 107 - Canvas edges', () => {
  it('should have smooth step edges', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('smoothstep')
  })

  it('should have animated edges', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('animated')
  })
})
