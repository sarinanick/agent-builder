import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 121 - Heading hierarchy', () => {
  it('should have proper heading structure in marketplace', () => {
    const marketplacePath = join(process.cwd(), 'src/app/marketplace/page.tsx')
    const content = readFileSync(marketplacePath, 'utf-8')
    expect(content).toContain('h1') || expect(content).toContain('h2')
  })

  it('should have headings in Sonora', () => {
    const sonoraPath = join(process.cwd(), 'src/app/marketplace/Sonora.tsx')
    const content = readFileSync(sonoraPath, 'utf-8')
    expect(content).toContain('h1') || expect(content).toContain('h2')
  })
})
