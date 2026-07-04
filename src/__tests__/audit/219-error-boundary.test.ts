import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 219 - Error boundary', () => {
  it('should have ErrorBoundary component', () => {
    const errorBoundaryPath = join(process.cwd(), 'src/components/ui/ErrorBoundary.tsx')
    const content = readFileSync(errorBoundaryPath, 'utf-8')
    expect(content).toContain('ErrorBoundary')
    expect(content).toContain('componentDidCatch')
  })

  it('should have error UI', () => {
    const errorBoundaryPath = join(process.cwd(), 'src/components/ui/ErrorBoundary.tsx')
    const content = readFileSync(errorBoundaryPath, 'utf-8')
    expect(content).toContain('Something went wrong')
    expect(content).toContain('Try again')
  })

  it('should be used in page.tsx', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('ErrorBoundary')
  })
})
