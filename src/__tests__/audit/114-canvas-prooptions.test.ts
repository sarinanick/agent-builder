import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 114 - Canvas pro options', () => {
  it('should hide attribution', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/EditorCanvas.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('proOptions')
    expect(content).toContain('hideAttribution')
  })
})
