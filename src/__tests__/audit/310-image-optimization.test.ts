import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 310 - Image optimization', () => {
  it('should use picsum with ID format', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('picsum.photos/id/')
    expect(content).not.toContain('picsum.photos/seed/')
  })

  it('should have lazy loading on images', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('loading="lazy"')
  })

  it('should have error handling for images', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('onError')
  })
})
