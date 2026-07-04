import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 105 - Canvas minimap', () => {
  it('should have minimap component', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('MiniMap')
  })

  it('should have node colors for minimap', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('minimapNodeColor')
  })
})
