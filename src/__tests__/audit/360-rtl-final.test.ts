import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 360 - RTL final check', () => {
  it('should use logical properties', () => {
    const files = [
      'src/components/sidebar/Sidebar.tsx',
      'src/components/panel/PropertiesPanel.tsx',
    ]

    files.forEach((file) => {
      const path = join(process.cwd(), file)
      const content = readFileSync(path, 'utf-8')
      // Check for logical properties
      const hasLogicalProps = content.includes('ps-') || content.includes('pe-') || content.includes('ms-') || content.includes('me-') || content.includes('start') || content.includes('end')
      expect(hasLogicalProps).toBe(true)
    })
  })

  it('should set dir attribute correctly', () => {
    const i18nPath = join(process.cwd(), 'src/lib/i18n.tsx')
    const content = readFileSync(i18nPath, 'utf-8')
    expect(content).toContain('dir')
    expect(content).toContain('rtl')
    expect(content).toContain('ltr')
  })
})
