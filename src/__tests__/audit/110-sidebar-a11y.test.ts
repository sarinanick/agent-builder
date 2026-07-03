import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 110 - Sidebar accessibility', () => {
  it('should have aria-label on sidebar', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('aria-label')
  })

  it('should have search input with aria-label', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('aria-label')
    expect(content).toContain('type="search"')
  })

  it('should have role="list" on node list', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('role="list"')
  })

  it('should have draggable items with keyboard support', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('role="button"')
    expect(content).toContain('tabIndex={0}')
    expect(content).toContain('onKeyDown')
  })
})
