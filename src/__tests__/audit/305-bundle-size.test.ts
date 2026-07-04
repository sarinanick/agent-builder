import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 305 - Bundle size optimization', () => {
  it('should have lazy loaded modals', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    expect(content).toContain('lazy(')
    expect(content).toContain('Suspense')
  })

  it('should have lazy loaded marketplace components', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('lazy(')
  })

  it('should use dynamic imports for heavy components', () => {
    const lazyPath = join(process.cwd(), 'src/components/canvas/LazyModals.tsx')
    const content = readFileSync(lazyPath, 'utf-8')
    expect(content).toContain('dynamic(')
  })
})
