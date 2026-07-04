import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 302 - Image loading', () => {
  it('should use lazy loading on images', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('loading="lazy"')
  })

  it('should use async decoding', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('decoding="async"')
  })

  it('should have error handling', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('onError')
  })
})
