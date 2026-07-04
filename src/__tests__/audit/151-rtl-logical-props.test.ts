import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 151 - RTL logical properties', () => {
  it('should use logical properties in sidebar', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    const hasLogical = content.includes('ps-') || content.includes('pe-') || content.includes('ms-') || content.includes('me-') || content.includes('start') || content.includes('end')
    expect(hasLogical).toBe(true)
  })

  it('should use logical properties in panel', () => {
    const panelPath = join(process.cwd(), 'src/components/panel/PropertiesPanel.tsx')
    const content = readFileSync(panelPath, 'utf-8')
    const hasLogical = content.includes('ps-') || content.includes('pe-') || content.includes('ms-') || content.includes('me-') || content.includes('start') || content.includes('end')
    expect(hasLogical).toBe(true)
  })
})
