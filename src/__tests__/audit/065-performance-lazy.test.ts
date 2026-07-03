import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 065 - Performance lazy loading', () => {
  it('should have lazy loaded modals', () => {
    const lazyModalsPath = join(process.cwd(), 'src/components/canvas/LazyModals.tsx')
    const content = readFileSync(lazyModalsPath, 'utf-8')
    expect(content).toContain('dynamic(')
    expect(content).toContain('ssr: false')
  })

  it('should have lazy loaded marketplace page', () => {
    // Marketplace uses lazy() for FilmstripModal and Sonora
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('lazy(')
  })

  it('should have code splitting via dynamic import', () => {
    const pagePath = join(process.cwd(), 'src/app/page.tsx')
    const content = readFileSync(pagePath, 'utf-8')
    // Page should use lazy() for modals with Suspense wrapper
    expect(content).toContain('lazy(')
    expect(content).toContain('Suspense')
  })
})
