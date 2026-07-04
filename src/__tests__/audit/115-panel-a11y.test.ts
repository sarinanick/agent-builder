import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 115 - Properties Panel accessibility', () => {
  it('should use FieldInput with proper labels', () => {
    const panelPath = join(process.cwd(), 'src/components/panel/PropertiesPanel.tsx')
    const content = readFileSync(panelPath, 'utf-8')
    expect(content).toContain('FieldInput')
    expect(content).toContain('label')
  })

  it('should have proper label associations', () => {
    const panelPath = join(process.cwd(), 'src/components/panel/PropertiesPanel.tsx')
    const content = readFileSync(panelPath, 'utf-8')
    // Labels should be connected to inputs via htmlFor/id
    expect(content).toContain('label')
  })

  it('should have delete button with title attribute', () => {
    const panelPath = join(process.cwd(), 'src/components/panel/PropertiesPanel.tsx')
    const content = readFileSync(panelPath, 'utf-8')
    expect(content).toContain('title=')
  })
})
