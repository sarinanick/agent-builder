import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 109 - Canvas selection', () => {
  it('should have pane click handler', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('onPaneClick')
  })

  it('should have node click handler', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('onNodeClick')
  })
})
