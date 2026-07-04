import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 101 - Canvas controls completeness', () => {
  it('should have zoom in/out', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('zoomIn')
    expect(content).toContain('zoomOut')
  })

  it('should have fit view', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('fitView')
  })

  it('should have lock canvas', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('Lock') || expect(content).toContain('isLocked')
  })

  it('should have grid toggle', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('Grid') || expect(content).toContain('showGrid')
  })

  it('should have help button', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('Help') || expect(content).toContain('help')
  })

  it('should have aria labels', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('aria-label')
  })

  it('should have toolbar role', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('role="toolbar"')
  })
})
