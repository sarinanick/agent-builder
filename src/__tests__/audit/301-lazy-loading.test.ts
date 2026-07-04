import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 301 - Lazy loading', () => {
  it('should lazy load modals in page.tsx', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('lazy(')
    expect(content).toContain('Suspense')
  })

  it('should lazy load marketplace components', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('lazy(')
  })

  it('should have lazy modals component', () => {
    const lazyPath = join(process.cwd(), 'src/components/canvas/LazyModals.tsx')
    const content = readFileSync(lazyPath, 'utf-8')
    expect(content).toContain('dynamic(')
  })
})
