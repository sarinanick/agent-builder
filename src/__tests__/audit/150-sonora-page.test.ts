import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 150 - Sonora page', () => {
  it('should have waveform visualization', () => {
    const sonoraPath = join(process.cwd(), 'src/app/marketplace/Sonora.tsx')
    const content = readFileSync(sonoraPath, 'utf-8')
    expect(content).toContain('waveBars')
    expect(content).toContain('sonora-bounce')
  })

  it('should have track list', () => {
    const sonoraPath = join(process.cwd(), 'src/app/marketplace/Sonora.tsx')
    const content = readFileSync(sonoraPath, 'utf-8')
    expect(content).toContain('tracks')
    expect(content).toContain('playTrack')
  })

  it('should have genre selection', () => {
    const sonoraPath = join(process.cwd(), 'src/app/marketplace/Sonora.tsx')
    const content = readFileSync(sonoraPath, 'utf-8')
    expect(content).toContain('SONORA_GENRES') || expect(content).toContain('selectedGenre')
  })
})
