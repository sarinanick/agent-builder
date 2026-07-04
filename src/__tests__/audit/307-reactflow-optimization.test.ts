import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 307 - React Flow optimization', () => {
  it('should use snap to grid', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('snapToGrid')
  })

  it('should have fit view on load', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('fitView')
  })

  it('should use smooth step edges', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('smoothstep')
  })
})
