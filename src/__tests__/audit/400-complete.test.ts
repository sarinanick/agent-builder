import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 400 - Complete audit coverage', () => {
  it('should have test infrastructure', () => {
    const vitestPath = join(process.cwd(), 'vitest.config.ts')
    const content = readFileSync(vitestPath, 'utf-8')
    expect(content).toContain('vitest')
    expect(content).toContain('jsdom')
  })

  it('should have design tokens', () => {
    const tokensPath = join(process.cwd(), 'src/styles/tokens.css')
    const content = readFileSync(tokensPath, 'utf-8')
    expect(content).toContain('--surface-canvas')
    expect(content).toContain('--text-primary')
    expect(content).toContain('--accent-primary')
  })

  it('should have node registry', () => {
    const registryPath = join(process.cwd(), 'src/lib/nodeRegistry.ts')
    const content = readFileSync(registryPath, 'utf-8')
    expect(content).toContain('NODE_REGISTRY')
  })

  it('should have lazy loading', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('lazy(')
    expect(content).toContain('Suspense')
  })

  it('should have shared components', () => {
    const buttonPath = join(process.cwd(), 'src/components/ui/Button.tsx')
    const formFieldPath = join(process.cwd(), 'src/components/ui/FormField.tsx')
    expect(readFileSync(buttonPath, 'utf-8')).toBeTruthy()
    expect(readFileSync(formFieldPath, 'utf-8')).toBeTruthy()
  })

  it('should have RTL support', () => {
    const i18nPath = join(process.cwd(), 'src/lib/i18n.tsx')
    const content = readFileSync(i18nPath, 'utf-8')
    expect(content).toContain('rtl')
    expect(content).toContain('ltr')
  })

  it('should have accessibility features', () => {
    const sidebarPath = join(process.cwd(), 'src/components/sidebar/Sidebar.tsx')
    const content = readFileSync(sidebarPath, 'utf-8')
    expect(content).toContain('aria-label')
    expect(content).toContain('role=')
  })

  it('should have performance optimizations', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('useMemo')
    expect(content).toContain('useCallback')
  })
})
