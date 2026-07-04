import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 127 - ARIA roles', () => {
  it('should have role on sidebar', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('role=')
  })

  it('should have role on toolbar', () => {
    const canvasPath = join(process.cwd(), 'src/components/canvas/CanvasControls.tsx')
    const content = readFileSync(canvasPath, 'utf-8')
    expect(content).toContain('role="toolbar"')
  })

  it('should have role on navigation', () => {
    const navbarPath = join(process.cwd(), 'src/components/layout/Navbar.tsx')
    const content = readFileSync(navbarPath, 'utf-8')
    expect(content).toContain('role=')
  })
})
